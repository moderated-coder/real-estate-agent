import logging
from typing import Dict, Any

from repository.mongo_database import MongoDatabase

class ArticleReadService:

    def __init__(self):

        self.logger = self._get_logger(__name__)
        self.mongo_db = MongoDatabase()
        self.mongo_db.connect()

    def _get_logger(self, service_name: str):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        if not logger.handlers:
            formatter = logging.Formatter(f"%(asctime)s [{service_name.upper()}] %(levelname)s: %(message)s")
            handler = logging.StreamHandler()
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        return logger

    def get_article(self, conditions: Dict[str, Any]):

        target_gu = conditions.get("gu", "영등포구")
        target_dong = conditions.get("dong", None)
        self.logger.info(f"{target_gu}:{target_dong}")

        article_responses = self.mongo_db.get_article_list(gu_name=target_gu, dong_name=target_dong)
        self.logger.info(f"sample response: {len(article_responses)}")
        return len(article_responses)