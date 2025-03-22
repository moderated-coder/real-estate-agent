import uvicorn
from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
from service.naver_crawler_service import NaverCrawlerService
from service.gu_service import GuService
from scripts.load_unit_codes import load_unit_codes
from utils.scheduler import scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_unit_codes()
    app.state.crawler_service = naver_crawler_service
    scheduler.schedule_job(60, naver_crawler_service.crawl_outdated_unit_codes) # 1 hour
    scheduler.start()

    yield

    scheduler.stop()

app = FastAPI(lifespan=lifespan)
naver_crawler_service = NaverCrawlerService()
gu_service = GuService()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/crawl_by_guname")
async def crawl_by_guname(guname: str):
    return gu_service.crawl(guname)


@app.get("/test_get_dongname_list")
async def test_get_dongname_list(guname: str):
    return gu_service._get_dongname_unit_code_list(guname)

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
