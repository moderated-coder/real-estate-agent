import json
import time
import random
import requests
import logging
from typing import Dict, Any
from tqdm import tqdm

from utils.crawl_utils import cookies, headers
from repository.mongo_database import MongoDatabase


class NaverCrawlerService:

    def __init__(self):
        # logger
        self.logger = self._get_logger()
        self.cluster_request_url = "https://m.land.naver.com/cluster/clusterList"
        self.article_list_request_url = "https://m.land.naver.com/cluster/ajax/articleList"
        self.article_detail_request_url = "https://fin.land.naver.com/articles/"

        self.mongo_db = MongoDatabase()
        self.mongo_db.connect()

    def _get_logger(self, service_name: str = "naver_crawler_service"):
        logger = logging.getLogger()
        logger.setLevel(logging.WARN)
        formatter = logging.Formatter(f"%(asctime)s [{service_name.upper()}] %(levelname)s: %(message)s")
        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def get_random_dongname(self):
        return self.mongo_db.get_random_dongname()

    def get_unit_code_from_dongname(self, dongname: str) -> Dict[str, Any]:
        try:
            unit_code_obj = self.mongo_db.get_unit_code_by_dongname(dongname)
            if unit_code_obj:
                self.logger.warning(f"{dongname} has detected...")
                return {"unit_code": unit_code_obj.get("unit_code"), "status": "success"}
            return {"unit_code": "", "status": "fail", "error": "Unit code not found"}
        except Exception as e:
            return {"unit_code": "", "status": "fail", "error": str(e)}

    def get_article_list_from_unit_code(self, unit_code: str) -> Dict[str, Any]:
        try:
            # 네이버 부동산 매물지도의 동그라미들에 해당하는 메타정보 수집
            params = dict()
            params["view"] = "atcl"
            params["cortarNo"] = unit_code
            params["rletTpCd"] = "OPST:VL:OR"
            params["tradTpCd"] = "B1:B2"
            params["z"] = 14
            params["addon"] = "COMPLEX"
            params["bAddon"] = "COMPLEX"
            params["isOnlyIsale"] = "false"
            
            cluster_response = requests.get(self.cluster_request_url, params=params, cookies=cookies, headers=headers)
            content = json.loads(cluster_response.text)
            area_articles = content["data"]["ARTICLE"]
            self.logger.warning(f"collected area cluster num is: {len(area_articles)}")
    
    
            # 동그라미 매물덩어리들마다 매물정보 수집
            article_list = list()
            for area in tqdm(area_articles):
                lgeo = area["lgeo"]; lat = area["lat"]; lon = area["lon"]
                for page_num in range(0, 25):
                    random_t = random.uniform(1.0, 6.0)
                    time.sleep(random_t)
                    request_params = {
                        'lgeo': lgeo, 'rletTpCd': 'OPST:VL:OR', 'tradTpCd': 'B1:B2', 'z': '14', "page": page_num
                    }
                    response = requests.get(
                        self.article_list_request_url,
                        params=request_params,
                        cookies=cookies,
                        headers=headers
                    )
                    estate_obj = json.loads(response.text)
                    if estate_obj["code"] == "success":
                        for record in estate_obj["body"]:
                            record["unit_code"] = unit_code
                        article_list.extend(estate_obj["body"])

            # article_df = pd.DataFrame.from_dict(article_list)
            self.logger.warning(article_list[:10])

            self.mongo_db.insert_data(article_list)
            return {"collection_name": self.mongo_db.collection_name, "status": "success"}
        except Exception as e:
            self.logger.error(e)
            return {"status": "fail"}