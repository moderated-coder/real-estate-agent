from typing import List, Optional, Dict, Any
import logging
import random
from pymongo.collection import Collection

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s [UNIT_CODE_REPO] %(levelname)s: %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

class UnitCodeRepository:
    def __init__(self, collection: Collection):
        self.collection = collection
    
    def get_all_unit_codes(self) -> List[Dict[str, Any]]:
        return list(self.collection.find({}, {"_id": 0}))
    
    def get_unit_code_by_dongname(self, dongname: str) -> Optional[Dict[str, Any]]:
        result = self.collection.find_one({"dongname": {"$regex": dongname, "$options": "i"}}, {"_id": 0})
        return result
    
    def get_random_dongname(self) -> Optional[str]:
        all_codes = self.get_all_unit_codes()
        if not all_codes:
            return None
        random_code = random.choice(all_codes)
        return random_code.get("dongname") 