import logging
import requests
import pickle

import pandas as pd
from tqdm import tqdm
from fake_useragent import UserAgent

from utils import cookies, headers


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
df = pd.read_csv("./구로동_article.csv")
logger.warning(f"sample article row: \n{df.sample(1).to_dict('records')}")

# request article details
url = "https://fin.land.naver.com/articles/"

article_detail_list = list()
article_nos = df.atclNo.values.tolist()
for idx, article_no in tqdm(enumerate(article_nos)):
    endpoint_url = url + str(article_no)
    response = requests.get(endpoint_url, cookies=cookies, headers=headers)
    article_detail_list.append(response.text)


with open("./article_details.pkl","wb") as f:
    pickle.dump(article_detail_list, f)

