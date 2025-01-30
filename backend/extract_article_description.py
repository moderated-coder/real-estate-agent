import logging
import pickle
import json
import requests
from tqdm import tqdm

import google.generativeai as genai
from utils import get_gemini


# llm api
gemini = get_gemini(model_name="gemini-1.5-flash-8b")


# job name
JOB_NAME = "extract_article_description".upper()

# logger
logger = logging.getLogger()
logger.setLevel(logging.WARN)
formatter = logging.Formatter(f"%(asctime)s [{JOB_NAME}] %(levelname)s: %(message)s")
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


# load data
with open("./article_details.pkl", "rb") as f:
    dataset = pickle.load(f)


local_llm_url = "http://localhost:8080/completion"
header = {"Content-Type": "application/json"}


example_output = {
 "매물tag": "<value>",
 "거래유형": {
   "종류": "<value>",
   "금액": "<value>",
   "단가": "<value>"
 },
 "건물정보": {
   "유형": "<value>",
   "면적": {
     "공급": "<value>",
     "전용": "<value>"
   },
   "층수": {
     "해당층": "<value>",
     "총층": "<value>"
   }
 },
 "특징": "<value>",
 "매물상태": {
   "현장확인": "<value>",
   "확인일자": "<value>"
 },
 "대출정보": {
   "한도": "<value>",
   "금리": {
        "<bank_name>": "<value>",
   }
 }
}


prompt = """
당신은 특정 정보를 추출하기 위해 HTML 데이터를 분석하는 전문가입니다. 주어진 HTML에서 부동산 전월세와 관련된 정보를 추출하여 키-값 형식의 JSON으로 출력해야 합니다. 형식은 예제를 그대로 따라해주세요. 다만, html 안에 해당 필드가 존재하지 않으면 채우지말고 null로 지정해주세요.

# 입력 데이터: {html}
# 출력 예제: {example}
# Output:
"""

prompt_format = """
<|im_start|>system
{system_prompt}<|im_end|>
<|im_start|>user
{prompt}<|im_end|>
<|im_start|>assistant
"""



logger.warning("get local llm response: [gemma2-2b-it, gemma2-9b-it]")

extract_results = list()
for record in tqdm(dataset):
    input_text = prompt.format(html=record[len(record)//2:], example=example_output)
    data = json.dumps({"prompt": input_text, "n_predict": -1, "temperature": 0.1})
    response = requests.post(local_llm_url, data=data)
    logger.warning(f"response: \n{response.json()['content']}")



logger.warning("gemini api response: [gemini-1.5-flash-8b]")
"""
extract_results = list()
for record in tqdm(dataset):
    input_text = prompt.format(html=record[len(record)//2:], example=example_output)
    response = gemini.generate_content(input_text, generation_config=genai.GenerationConfig(temperature=0.0))
    logger.warning(f"extract field: \n{response.text}")
    extract_results.append(response)
"""


logger.warning("get local llm reseponse: [qwen2.5-7b-instruct]")
"""
extract_results = list()
for record in tqdm(dataset):
    input_text = prompt_format.format(
        system_prompt="당신은 특정 정보를 추출하기 위해 HTML 데이터를 분석하는 전문가입니다. 주어진 HTML에서 부동산 전월세와 관련된 정보를 추출하여 키-값 형식의 JSON으로 출력해야 합니다. 형식은 예제를 그대로 따라해주세요. 다만, html 안에 해당 필드가 존재하지 않으면 채우지말고 null로 지정해주세요.",
        prompt=f"입력데이터는 {record[len(record)//2:]}입니다. 출력예제는 {example_output}입니다.",
    )
    data = json.dumps({"prompt": input_text, "n_predict": -1, "temperature": 0.1})
    response = requests.post(local_llm_url, data=data)
    logger.warning(f"response: \n{response.json()['content']}")
"""