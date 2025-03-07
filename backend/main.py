import uvicorn
from fastapi import FastAPI

from service.naver_crawler_service import NaverCrawlerService

app = FastAPI()
naver_crawler_service = NaverCrawlerService()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/get_random_dongname")
async def get_random_dongname():
    return naver_crawler_service.get_random_dongname()


@app.get("/get_unit_code")
async def get_unit_code(dongname: str):
    return naver_crawler_service.get_unit_code_from_dongname(dongname=dongname)


@app.get("/get_article_list")
async def get_article_list(unit_code: str):
    return naver_crawler_service.get_article_list_from_unit_code(unit_code)


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
