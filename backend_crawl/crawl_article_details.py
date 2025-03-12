import logging
import requests

import pandas as pd
from tqdm import tqdm
from fake_useragent import UserAgent

from utils import cookies, headers, extract_total_data_from_html
import google.generativeai as genai
from utils import get_gemini


# job name
JOB_NAME = "crawl_article_details".upper()

# logger
logger = logging.getLogger()
logger.setLevel(logging.WARN)
formatter = logging.Formatter(f"%(asctime)s [{JOB_NAME}] %(levelname)s: %(message)s")
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


# load article table
df = pd.read_csv("./data/구로동_article.csv")
logger.warning(f"sample article row: \n{df.sample(1).to_dict('records')}")

# request article details
url = "https://fin.land.naver.com/articles/"
logger.warning(f"default article detail page: {url}")


article_detail_list = list()
article_nos = df.atclNo.values.tolist()

for idx, article_no in tqdm(enumerate(article_nos)):
    try:
        endpoint_url = url + str(article_no)
        article_detail_response = requests.get(endpoint_url, cookies=cookies, headers=headers).text
        parsed_response = extract_total_data_from_html(article_detail_response)
        article_detail_list.append(parsed_response)
    except Exception as e:
        logger.warning(f"error: {e}")

df["article_details"] = article_detail_list
df.to_csv("./data/구로동_parsed_article.csv")
