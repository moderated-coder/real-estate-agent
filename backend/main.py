from typing import Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
from service.gu_service import GuService
from service.article_read_service import ArticleReadService
from scripts.load_unit_codes import load_unit_codes
from utils.scheduler import scheduler
from fastapi import Query

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_unit_codes()
    app.state.crawler_service = GuService

    scheduler.schedule_job(60*48, gu_service.crawl, "영등포구") # 48 hour
    scheduler.start()

    yield

    scheduler.stop()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST 등 허용할 메서드
    allow_headers=["*"],  # Authorization, Content-Type 등
)
gu_service = GuService()
article_read_service = ArticleReadService()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/crawl_by_guname")
async def crawl_by_guname(guname: str = "영등포구"):
    return gu_service.crawl(guname)


@app.post("/get_article")
async def get_article(filter_condition_list: Dict[str, Any]):
    return article_read_service.get_article(conditions=filter_condition_list)


@app.get("/test_get_dongname_list")
async def test_get_dongname_list(guname: str):
    return gu_service._get_dongname_unit_code_list(guname)





@app.get("/get_articles")
async def get_articles(
    gu: str = Query(..., description="정렬 기준 (예: deposit_fee_asc)"),
    deposit_min: int = Query(..., description="최소 보증금"),
    deposit_max: int = Query(..., description="최대 보증금"),
    rent_min: int = Query(..., description="최소 월세"),
    rent_max: int = Query(..., description="최대 월세"),
    cursor: str = Query(..., description="페이지 번호"),
):
    return gu_service.get_articles(
        gu=gu,
        deposit_min=deposit_min,
        deposit_max=deposit_max,
        rent_min=rent_min,
        rent_max=rent_max,
        cursor=cursor,
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
