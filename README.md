# BackEnd

### Crawling
- 네이버 부동산 서비스의 웹요청을 mocking하여 데이터를 수집한다.
- 실행순서는 다음과 같다.
```
1. crawl_article_list.py: 네이버 부동산 지도화면에서 매물들이 뭉쳐있는 동그라미들 속 매물 개요를 수집
2. crawl_article_details.py: 매물 개요에 포함된 atclNo에 따른 매물 상세페이지 html 수집 후 parsing
3. refine_article_columns.py: parsing된 컬럼을 유의미하게 refine
```

# Front Demo
- `streamlit run front-demo/streamlit_app.py`
- 보증금, 월세, 전용면적, 공급면적, 매물타입으로 필터링 조건 생성


# Front - Home Search  

사용자가 처음 접하는 화면으로, 검색 기능을 제공합니다.  

## 기능  
- **검색어를 입력하여 검색할 수 있는 기능**  
- **검색 결과에 필터를 적용하는 기능** *(개발 중)*  

<p align="center">
  <img src="https://github.com/user-attachments/assets/425ae2aa-7b8d-46f7-b39e-e63c8c70dd78" alt="Home Search 화면">
</p>

---

# Search  

검색 결과를 표시하는 화면으로, 결과를 카드 형태로 제공합니다.  

## 기능  
- **검색 기능 제공**  
- **검색 결과를 카드 형태로 출력**  
- **썸네일을 클릭하여 검색 상세 페이지로 이동** *(개발 중)*  

<p align="center">
  <img src="https://github.com/user-attachments/assets/06729f44-01cb-4ef9-86c5-d68fedc2fbf9" alt="Search 화면">
</p>

