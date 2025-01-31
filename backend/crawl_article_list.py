import requests
import json
import ast
import time
import logging
import random

import pandas as pd
from tqdm import tqdm
from fake_useragent import UserAgent

from utils import cookies, headers


# job name
JOB_NAME = "crawl_article_list".upper()


# logger
logger = logging.getLogger()
logger.setLevel(logging.WARN)
formatter = logging.Formatter(f"%(asctime)s [{JOB_NAME}] %(levelname)s: %(message)s")
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


# unit code(법정 동코드)
unit_code_filepath = "./data/unit_code_list.txt"
unit_code_table = pd.read_csv(unit_code_filepath, encoding='cp949', sep="\t")
unit_code_table.columns = ["code", "name", "status"]
unit_code_table = unit_code_table[unit_code_table.status == "존재"]
logger.warning(f"법정동코드 예시: \n{unit_code_table.sample(1).to_dict('records')}")


#  동정보
target_unit = "구로동"
target_unit_info = unit_code_table[unit_code_table.name.str.contains(target_unit)]
logger.warning(f"검색 대상 동: {target_unit}")

target_unit_code = target_unit_info.code.tolist()[0]
logger.warning(f"대상 code: {target_unit_code}")

# request area cluster
# 네이버 부동산 지도창에서 동그라미로 매물이 묶여있는 그것
cluster_request_url = "https://m.land.naver.com/cluster/clusterList"
params = {
    "view": "atcl",
    "cortarNo": target_unit_code,
    "rletTpCd": "OPST:VL:OR",
    'tradTpCd': 'B1:B2',
    "z": 14,
    "addon": "COMPLEX",
    "bAddon": "COMPLEX",
    "isOnlyIsale": "false",
}
cluster_response = requests.get(cluster_request_url, params=params, cookies=cookies, headers=headers)
content = json.loads(cluster_response.text)
area_articles = content["data"]["ARTICLE"]
logger.warning(f"collected area cluster num is: {len(area_articles)}")


# collect articles
# 동그라미 매물덩어리 마다의 매물수집
article_list = list()
article_list_request_url = "https://m.land.naver.com/cluster/ajax/articleList"
for area in tqdm(area_articles):
    try:
        lgeo = area["lgeo"]; lat = area["lat"]; lon = area["lon"]
        for page_num in range(0, 25):
            random_t = random.uniform(1.0, 6.0)
            time.sleep(random_t)
            request_params = {
                'lgeo': lgeo, 'rletTpCd': 'OPST:VL:OR', 'tradTpCd': 'B1:B2', 'z': '14', "page": page_num
            }
            response = requests.get(article_list_request_url, params=request_params, cookies=cookies, headers=headers)
            estate_obj = json.loads(response.text)
            if estate_obj["code"] == "success":
                article_list.extend(estate_obj["body"])

    except Exception as e:
        print(e)

article_df = pd.DataFrame.from_dict(article_list)
article_df.to_csv(f"./data/{target_unit}_article.csv")
logger.warning(f"num of {target_unit}'s article: {len(article_list)}")
logger.warning(f"article dataframe: \n{article_df}")























