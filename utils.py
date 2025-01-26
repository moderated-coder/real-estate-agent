import google.generativeai as genai

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

