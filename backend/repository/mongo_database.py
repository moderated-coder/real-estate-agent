import logging
import random
from typing import List, Dict, Any, Optional
from pymongo import MongoClient
import datetime

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s [MONGO_DB] %(levelname)s: %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

class MongoDatabase:
    def __init__(self):
        self.client = None
        self.db = None
        self.article_collection = None
        self.unit_code_collection = None
        self.crawl_history_collection = None

    def connect(self):
        try:
            self.client = MongoClient("mongodb://localhost:27017/")
            self.db = self.client["real_estate_agent"]
            self.article_collection = self.db["articles"]
            self.unit_code_collection = self.db["unit_codes"]
            self.crawl_history_collection = self.db["crawl_history"]
            return True
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            return False

    def insert_data(self, data: List[Dict[str, Any]]):
        try:
            if self.article_collection is None:
                logger.error("MongoDB collection not initialized")
                return False
            
            result = self.article_collection.insert_many(data)
            logger.info(f"Inserted {len(result.inserted_ids)} articles")
            return True
        except Exception as e:
            logger.error(f"Failed to insert data: {e}")
            return False
    
    def get_unit_code_collection(self):
        if self.unit_code_collection is None:
            logger.error("Unit code collection not initialized")
            return None
        return self.unit_code_collection
    
    def get_unit_code_by_dongname(self, dongname: str) -> Optional[Dict[str, Any]]:
        if self.unit_code_collection is None:
            logger.error("Unit code collection not initialized")
            return None
        
        return self.unit_code_collection.find_one(
            {"dongname": {"$regex": dongname, "$options": "i"}},
            {"_id": 0}
        )
    
    def get_random_dongname(self) -> Optional[str]:
        if self.unit_code_collection is None:
            logger.error("Unit code collection not initialized")
            return None
        
        pipeline = [{"$sample": {"size": 1000}}]
        result = list(self.unit_code_collection.aggregate(pipeline))
        
        if result:
            return random.sample(result, k=1)[0].get("dongname")
        return None
        
    def update_crawl_history(self, unit_code: str) -> bool:
        if self.crawl_history_collection is None:
            return False

        try:
            current_time = datetime.datetime.now()
            self.crawl_history_collection.update_one(
                {"unit_code": unit_code},
                {"$set": {"last_crawled_at": current_time}},
                upsert=True
            )
            return True
        except Exception as e:
            logger.error(f"Failed to update crawl history: {e}")
            return False
            
    def get_unit_codes_to_crawl(self, hours_threshold: int = 6) -> List[str]:
        if self.unit_code_collection is None or self.crawl_history_collection is None:
            logger.error("Collections not initialized")
            return []

        try:
            threshold_time = datetime.datetime.now() - datetime.timedelta(hours=hours_threshold)
            all_unit_codes = [doc["unit_code"] for doc in self.unit_code_collection.find({}, {"unit_code": 1, "_id": 0})]
            recent_crawls = {
                doc["unit_code"] for doc in self.crawl_history_collection.find(
                    {"last_crawled_at": {"$gt": threshold_time}},
                    {"unit_code": 1, "_id": 0}
                )
            }

            codes_to_crawl = [code for code in all_unit_codes if code not in recent_crawls]
            return codes_to_crawl
        except Exception as e:
            logger.error(f"Failed to get unit codes to crawl: {e}")
            return []