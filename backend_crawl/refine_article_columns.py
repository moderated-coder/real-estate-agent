import ast
import logging
import requests
import pickle
import time
import random

import pandas as pd
from tqdm import tqdm


# job name
JOB_NAME = "refine_article_columns".upper()


# logger
logger = logging.getLogger()
logger.setLevel(logging.WARN)
formatter = logging.Formatter(f"%(asctime)s [{JOB_NAME}] %(levelname)s: %(message)s")
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


# load dataset
summary_df = pd.read_csv("./data/구로동_parsed_article.csv")


# refine
article_list = list()
for index, record in tqdm(enumerate(summary_df.to_dict('records'))):
    article_num = record["atclNo"]
    article_details = ast.literal_eval(record["article_details"])

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

    article_list.append(article_record)

refined_df = pd.DataFrame.from_dict(article_list).fillna("None")
refined_df.to_csv("./data/refined_articles.csv")



target_summary_column_list = {
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

target_refined_column_map = {
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

target_refined_df = refined_df[target_refined_column_map.keys()]
target_summary_df = summary_df[target_summary_column_list.keys()]

target_refined_df = target_refined_df.rename(columns=target_refined_column_map)
target_summary_df = target_summary_df.rename(columns=target_summary_column_list)

total_df = pd.concat([target_summary_df, target_refined_df], axis=1)
total_df.to_csv("./data/all_info_contained_articles.csv")
logger.warning(f"finally refine the articles: {'./data/all_info_contained_articles.csv'}")