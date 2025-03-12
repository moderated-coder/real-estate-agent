import logging
from typing import List, Dict, Any, Optional
from pymongo import MongoClient

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

    def connect(self):
        try:
            self.client = MongoClient("mongodb://localhost:27017/")
            self.db = self.client["real_estate_agent"]
            self.article_collection = self.db["articles"]
            self.unit_code_collection = self.db["unit_codes"]
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
        
        pipeline = [{"$sample": {"size": 1}}]
        result = list(self.unit_code_collection.aggregate(pipeline))
        
        if result:
            return result[0].get("dongname")
        return None