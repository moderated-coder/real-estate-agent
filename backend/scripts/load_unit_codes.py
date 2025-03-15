import pandas as pd
import logging
import sys
import os
from pymongo import MongoClient, UpdateOne
from pymongo.errors import BulkWriteError

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def load_unit_codes():
    
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [LOAD_UNIT_CODES] %(levelname)s: %(message)s"
    )
    logger = logging.getLogger(__name__)
    
    client = MongoClient("mongodb://localhost:27017/")
    db = client["real_estate_agent"]
    collection = db["unit_codes"]
    unit_code_filepath = "../data/unit_code_list.txt"
    
    try:

        existing_count = collection.count_documents({})
        if existing_count > 200:
            return
            
        unit_code_table = pd.read_csv(unit_code_filepath, encoding='utf-8', sep="\t", header=None).iloc[2:]
        unit_code_table.columns = ["code", "name", "status"]
        
        existing_codes = unit_code_table[unit_code_table.status == "존재"]
        
        # 벌크 업서트를 위한 operation 리스트 생성
        operations = []
        for _, row in existing_codes.iterrows():
            doc = {
                "unit_code": str(row["code"]),
                "dongname": row["name"]
            }
            
            # unit_code를 기준으로 upsert 설정
            operations.append(
                UpdateOne(
                    {"unit_code": doc["unit_code"]},  # 필터 조건
                    {"$set": doc},                   # 업데이트 내용
                    upsert=True                      # 없으면 삽입, 있으면 업데이트
                )
            )
        
        # 벌크 오퍼레이션 실행
        if operations:
            result = collection.bulk_write(operations)
            logger.info(f"Upserted: {result.upserted_count}, Modified: {result.modified_count}, Total: {len(operations)}")
        else:
            logger.info("No unit codes to import")
        
    except BulkWriteError as bwe:
        logger.error(f"Bulk write error: {bwe.details}")
        raise
    except Exception as e:
        logger.error(f"Error loading unit codes: {e}")
        raise