import google.generativeai as genai
from bs4 import BeautifulSoup


def get_gemini(model_name: str = "gemini-1.5-flash-8b"):
    API_KEY = open("/Users/junwkim/workspace/official/personal_info/gemini_api.txt").read().split("\n")[1]
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(
        model_name,
    )
    return model

cookies = {
    'NNB': '7IYBCUPJFBYGI',
    'ASID': 'de6c3e080000018a44fc234e0000005e',
    '_ga_451MFZ9CFM': 'GS1.1.1702882336.1.1.1702882362.0.0.0',
    'naverfinancial_CID': '6c8ba4b5b22e4476a1084be26cc8af1e',
    '_ga_Q7G1QTKPGB': 'GS1.1.1704685281.1.0.1704685286.0.0.0',
    '_fwb': '224CSfYfTtiQBnHeVhfOGjO.1732259722100',
    'landHomeFlashUseYn': 'Y',
    '_gcl_au': '1.1.1111152357.1734935794',
    '_ga': 'GA1.2.213098511.1702882336',
    '_ga_LP604D3B7P': 'GS1.1.1734935794.1.0.1734935803.51.0.0',
    'NAC': 'RtWyBcAnAF2b',
    'page_uid': 'iGA4Ksqo1SossB7eLRlssssstd0-147241',
    'nid_inf': '120919248',
    'NID_JKL': 'dMSr5ZLuAiLUb3eamb45GLht7/OhWPvrX99Tn5iMLKs=',
    'NACT': '1',
    'SRT30': '1737328984',
    'SHOW_FIN_BADGE': 'Y',
    'HT': 'HM',
    'BNB_FINANCE_HOME_TOOLTIP_ESTATE': 'true',
    'SRT5': '1737329606',
    'REALESTATE': '1737329610470',
    'JSESSIONID': '77D726D33A8E9C5B8BE6F95969C9D814',
    'BUC': 'D_gfBHyuW2-jW08EZ3rBzmehCQdDp-YwoZkbUdDxrMY=',
    'wcs_bt': '44058a670db444:1737329897',
}

headers = {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    # 'cookie': 'NNB=7IYBCUPJFBYGI; ASID=de6c3e080000018a44fc234e0000005e; _ga_451MFZ9CFM=GS1.1.1702882336.1.1.1702882362.0.0.0; naverfinancial_CID=6c8ba4b5b22e4476a1084be26cc8af1e; _ga_Q7G1QTKPGB=GS1.1.1704685281.1.0.1704685286.0.0.0; _fwb=224CSfYfTtiQBnHeVhfOGjO.1732259722100; landHomeFlashUseYn=Y; _gcl_au=1.1.1111152357.1734935794; _ga=GA1.2.213098511.1702882336; _ga_LP604D3B7P=GS1.1.1734935794.1.0.1734935803.51.0.0; NAC=RtWyBcAnAF2b; page_uid=iGA4Ksqo1SossB7eLRlssssstd0-147241; nid_inf=120919248; NID_JKL=dMSr5ZLuAiLUb3eamb45GLht7/OhWPvrX99Tn5iMLKs=; NACT=1; SRT30=1737328984; SHOW_FIN_BADGE=Y; HT=HM; BNB_FINANCE_HOME_TOOLTIP_ESTATE=true; SRT5=1737329606; REALESTATE=1737329610470; JSESSIONID=77D726D33A8E9C5B8BE6F95969C9D814; BUC=D_gfBHyuW2-jW08EZ3rBzmehCQdDp-YwoZkbUdDxrMY=; wcs_bt=44058a670db444:1737329897',
    'priority': 'u=1, i',
    'referer': 'https://m.land.naver.com/',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
}



def extract_total_data_from_html(html_content):
    """
    HTML 내용에서 ArticleSummary, ArticleBaseInfo_list, ArticleDetailInfo, DataSource, ArticleAgent 필드에 해당하는 데이터를 추출합니다.

    Args:
        html_content: HTML 문자열

    Returns:
        추출된 데이터를 포함하는 딕셔너리.
    """

    soup = BeautifulSoup(html_content, 'html.parser')
    data = {}

    # ArticleSummary 추출
    article_summary_div = soup.find('div', class_=lambda x: x and 'ArticleSummary_information' in x)
    if article_summary_div:
        data['ArticleSummary'] = {}
        info_complex_span = article_summary_div.find('span', class_=lambda x: x and 'ArticleSummary_info-complex' in x)
        info_price_span = article_summary_div.find('span', class_=lambda x: x and 'ArticleSummary_info-price' in x)
        if info_complex_span:
            data['ArticleSummary']['info-complex'] = info_complex_span.text.strip()
        if info_price_span:
            data['ArticleSummary']['info-price'] = info_price_span.text.strip()
        list_detail_ul = article_summary_div.find('ul', class_=lambda x: x and 'ArticleSummary_list-detail' in x)
        if list_detail_ul:
            data['ArticleSummary']['list-detail'] = []
            for item in list_detail_ul.find_all('li', class_=lambda x: x and 'ArticleSummary_item-detail' in x):
                data['ArticleSummary']['list-detail'].append(item.text.strip())
        description_p = article_summary_div.find('p', class_=lambda x: x and 'ArticleSummary_description' in x)
        if description_p:
            data['ArticleSummary']['description'] = description_p.text.strip()
        list_badge_ul = article_summary_div.find('ul', class_=lambda x: x and 'ArticleSummary_list-badge' in x)
        if list_badge_ul:
            data['ArticleSummary']['list-badge'] = []
            for item in list_badge_ul.find_all('li', class_=lambda x: x and 'ArticleSummary_item-badge' in x):
                data['ArticleSummary']['list-badge'].append(item.text.strip())

    # ArticleBaseInfo_list 추출 (이전 코드와 동일)
    article_base_info_div = soup.find('div', class_=lambda x: x and 'ArticleBaseInfo_article' in x)
    if article_base_info_div:
        data['ArticleBaseInfo_list'] = []
        list_price_ul = article_base_info_div.find('ul', class_=lambda x: x and 'ArticlePriceInfo_list-price' in x)
        if list_price_ul:
            for item in list_price_ul.find_all('li', class_=lambda x: x and 'DataList_item' in x):
                term = item.find('div', class_=lambda x: x and 'DataList_term' in x).text.strip()
                definition = item.find('div', class_=lambda x: x and 'DataList_definition' in x).text.strip()
                data['ArticleBaseInfo_list'].append({
                    'term': term,
                    'definition': definition
                })
        list_detail_ul = article_base_info_div.find('ul', class_=lambda x: x and 'ArticleBaseInfo_list-detail' in x)
        if list_detail_ul:
            for item in list_detail_ul.find_all('li', class_=lambda x: x and 'DataList_item' in x):
                term = item.find('div', class_=lambda x: x and 'DataList_term' in x).text.strip()
                definition = item.find('div', class_=lambda x: x and 'DataList_definition' in x).text.strip()
                data['ArticleBaseInfo_list'].append({
                    'term': term,
                    'definition': definition
                })

    # ArticleDetailInfo 추출 (이전 코드와 동일)
    article_detail_info_div = soup.find('div', class_=lambda x: x and 'ArticleDetailInfo_vertical-definition' in x)
    if article_detail_info_div:
        data['ArticleDetailInfo'] = article_detail_info_div.text.strip()

    # DataSource 추출 (이전 코드와 동일)
    data_source_div = soup.find('div', class_=lambda x: x and 'DataSource_article' in x)
    if data_source_div:
        data['DataSource'] = []
        for item in data_source_div.find_all('li', class_=lambda x: x and 'DataSource_item' in x):
            data['DataSource'].append(item.text.strip())

    # ArticleAgent 추출
    article_agent_div = soup.find('div', class_=lambda x: x and 'ArticleAgent_area-agent' in x)
    if article_agent_div:
        data['ArticleAgent'] = {}
        data_list_items = article_agent_div.find_all('li', class_=lambda x: x and 'DataList_item' in x)

        for item in data_list_items:
            term_div = item.find('div', class_=lambda x: x and 'DataList_term' in x)
            definition_div = item.find('div', class_=lambda x: x and 'DataList_definition' in x)

            if term_div and definition_div:
                term = term_div.text.strip()
                definition = definition_div.text.strip()

                # 중개사 이미지 URL 추출
                if term == "중개소":
                    img_tag = term_div.find('img', class_=lambda x: x and 'ArticleAgent_image' in x)
                    if img_tag:
                        data['ArticleAgent']['image_url'] = img_tag['src']

                # 전화번호 링크 추출
                if term == "전화":
                    phone_links = definition_div.find_all('a', class_=lambda x: x and 'ArticleAgent_link-telephone' in x)
                    data['ArticleAgent']['phone_numbers'] = [link['href'].replace('tel:', '') for link in phone_links]

                # 나머지 정보 추가
                else:
                    data['ArticleAgent'][term] = definition

    return data