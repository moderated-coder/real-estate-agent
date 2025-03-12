import pandas as pd
import logging
import sys
import os
from pymongo import MongoClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [LOAD_UNIT_CODES] %(levelname)s: %(message)s"
)
logger = logging.getLogger(__name__)

def load_unit_codes():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["real_estate_agent"]
    collection = db["unit_codes"]
    
    unit_code_filepath = "../data/unit_code_list.txt"
    
    try:
        existing_count = collection.count_documents({})
        if existing_count > 0:
            return
        
        unit_code_table = pd.read_csv(unit_code_filepath, encoding='utf-8', sep="\t", header=None)
        unit_code_table.columns = ["code", "name", "status"]
        
        existing_codes = unit_code_table[unit_code_table.status == "존재"]
        unit_codes_data = []
        for _, row in existing_codes.iterrows():
            unit_codes_data.append({
                "unit_code": str(row["code"]),
                "dongname": row["name"]
            })
        
            collection.insert_many(unit_codes_data)
            logger.info(f"imported {len(unit_codes_data)} unit codes")
        
    except Exception as e:
        logger.error(f"Error loading unit codes: {e}")
        raise

if __name__ == "__main__":
    load_unit_codes() 