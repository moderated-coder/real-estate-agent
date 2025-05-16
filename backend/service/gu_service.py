import json
import time
import random
import requests
import logging
import traceback
import pandas as pd
from typing import Dict, Any, List
from tqdm import tqdm

from utils.crawl_utils import cookies, headers, extract_total_data_from_html
from repository.mongo_database import MongoDatabase


class GuService:

    def __init__(self):
        self.logger = self._get_logger(__name__)
        self.cluster_request_url = "https://m.land.naver.com/cluster/clusterList"
        self.article_list_request_url = "https://m.land.naver.com/cluster/ajax/articleList"
        self.article_detail_request_url = "https://fin.land.naver.com/articles/"
        self.target_summary_column_list = {
            "atclNo": "article_no",
            "atclNm": "article_title",
            "rletTpNm": "article_class",
            "tradTpNm": "transaction_type",
            "flrInfo": "floor",
            "direction": "direction",
            "atclCfmYmd": "article_regist_date",
            "tagList": "tag_list",
            "spc1": "supply_area",
            "spc2": "exclusive_area",
            "prc": "deposit_fee",
            "rentPrc": "rent_fee",
            "repImgUrl": "image_url",
        }
        
        self.target_refined_column_map = {
            "관리비": "management_fee",
            "융자금": "loan",
            "article_short_features": "article_short_features",
            "article_short_description": "article_short_description",
            "향": "house_direction",
            "입주가능일": "possible_move",
            "매물소개": "article_description_report",
            "agent_office": "agent_office",
            "agent_hp": "agent_hp",
            "agent_office_post": "agent_office_post",
            "방구조": "shape_of_house",
            "복층여부": "duplex",
        }

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


    def crawl(self, guname: str):
        try:
            start = time.time()
            dong_name_list, unit_code_list = self._get_dongname_unit_code_list(guname)
            for dong_name, unit_code in zip(dong_name_list, unit_code_list):
                crawl_result = self._get_article_from_unit_code(guname, dong_name, unit_code)
                if crawl_result["status"] == "success":
                    self.logger.info(f"[{guname}]:[{dong_name}]:[{unit_code}]: crawl finished...")
            end = time.time()
            self.logger.info(f"spend total time: {end - start}")
            return True
        except Exception as e:
            self.logger.warning(f"error: {e}")
            return False


    def _get_dongname_unit_code_list(self, guname: str):
        dong_response = self.mongo_db.unit_code_collection.find({"dongname": {"$regex": guname, "$options": "i"}})
        dong_response = [r.get("dongname").split(" ")[-1] for r in dong_response]
        self.logger.info(f"collected dong({len(dong_response)} 개): {dong_response}")

        unit_codes = [self._get_unit_code_from_dongname(r)["unit_code"] for r in dong_response][1:]
        self.logger.info(f"collectd unitcode({len(unit_codes)} 개): {unit_codes}")
        return dong_response, unit_codes


    def _get_unit_code_from_dongname(self, dongname: str) -> Dict[str, Any]:
        try:
            unit_code_obj = self.mongo_db.get_unit_code_by_dongname(dongname)
            if unit_code_obj:
                self.logger.warning(f"{dongname} has detected...")
                return {"unit_code": unit_code_obj.get("unit_code"), "status": "success"}
            return {"unit_code": "", "status": "fail", "error": "Unit code not found"}
        except Exception as e:
            return {"unit_code": "", "status": "fail", "error": str(e)}


    def _get_article_from_unit_code(self, guname: str, dong_name: str, unit_code: str) -> Dict[str, Any]:
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
                    random_t = random.uniform(6.0, 15.0)
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
            self.logger.info(f"Complete crawl article list")

            # article detail 수집
            article_detail_list = list()
            for article in tqdm(article_list):
                atcl_no = article.get("atclNo", None)
                if atcl_no is None:
                    continue
                request_article_detail_url = self.article_detail_request_url + str(atcl_no)
                article_detail_response = requests.get(request_article_detail_url, cookies=cookies, headers=headers).text
                parsed_response = extract_total_data_from_html(article_detail_response)
                article_detail_list.append(parsed_response)

            self.logger.info(f"Complete crawl article details")
            self.logger.info(f"article list: {len(article_list)}, article detail: {len(article_detail_list)}")
            
            # article detail 필드데이터 정리
            article_result = list()
            for index, (article, article_details) in enumerate(zip(article_list, article_detail_list)):
                
                article_num = article.get("atclNo")
                article_record = dict()
                
                # 요약정보, ArticleSummary Term
                summary_info = article_details.get("ArticleSummary", None)
            
                if summary_info is not None:
                    
                    article_record["article_title"] = summary_info.get("info-complex", None)
                    article_record["article_price"] = summary_info.get("info-price", None)
                    article_record["article_short_features"] = summary_info.get("list-detail", None)
                    article_record["article_short_description"] = summary_info.get("description", None)
                    article_record["article_check"] = summary_info.get("list-badge", None)
            
                # 기본정보, ArticleBaseInfo_list Term
                base_info_list = article_details.get("ArticleBaseInfo_list", None)
            
                if base_info_list is not None:
                    for info in base_info_list:
                        key = info["term"]
                        value = info["definition"]
                        article_record[key] = value
            
                # (게재 데이터, 상세소개) Data Source, ArticleDetailInfo
                article_record["data_source"] = article_details.get("DataSource")
                article_record["article_detail_info"] = article_details.get("ArticleDetailInfo")
            
                # 공인중개사 정보
                article_agent = article_details.get("ArticleAgent")
            
                if article_agent is not None:
                    article_record["agent_office"] = article_agent.get("중개소", None)
                    article_record["agent_hp"] = article_agent.get("phone_numbers", None)
                    article_record["agent_office_post"] = article_agent.get("위치", None)
                    article_record["agent_regist_no"] = article_agent.get("등록번호", None)
            
                article_result.append(article_record)

            refined_df = pd.DataFrame.from_dict(article_result).fillna("None")
            summary_df = pd.DataFrame.from_dict(article_list)
            self.logger.info(f"refined_df: \n{refined_df}")
            self.logger.info(f"summary_df: \n{summary_df}")
            self.logger.info(f"{len(refined_df)}, {len(summary_df)}")

            target_refined_df = refined_df.reindex(columns=list(self.target_refined_column_map.keys()))
            target_summary_df = summary_df.reindex(columns=list(self.target_summary_column_list.keys()))
            
            target_refined_df = target_refined_df.rename(columns=self.target_refined_column_map)
            target_summary_df = target_summary_df.rename(columns=self.target_summary_column_list)
            total_df = pd.concat([target_summary_df, target_refined_df], axis=1)

            total_df["gu"] = guname; total_df["dong"] = dong_name
            self.logger.info(f"total record:\n{total_df.sample(1).to_dict('records')[0]}")

            if self.mongo_db.insert_data(total_df.to_dict("records")):
                self.mongo_db.update_crawl_history(unit_code)
                return {"status": "success", "articles_count": len(article_list)}
            return {"status": "fail", "error": "Failed to insert data"}
        except Exception as e:
            self.logger.error(traceback.format_exc())
            return {"status": "fail", "error": str(e)}
            