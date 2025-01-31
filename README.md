# BackEnd

### Crawling
- 네이버 부동산 서비스의 웹요청을 mocking하여 데이터를 수집한다.
- 실행순서는 다음과 같다.
```
1. crawl_article_list.py: 네이버 부동산 지도화면에서 매물들이 뭉쳐있는 동그라미들 속 매물 개요를 수집
2. crawl_article_details.py: 매물 개요에 포함된 atclNo에 따른 매물 상세페이지 html 수집 후 parsing
3. refine_article_columns.py: parsing된 컬럼을 유의미하게 refine
```


# Front
### Application
- 여기에 설명해주세요.