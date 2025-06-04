from typing import Dict, Any,Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI
from fastapi import Body, APIRouter
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
    allow_origins=["https://real-estate-front-wwqr.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    dong: Optional[str] = Query(None, description="동 이름 (선택 사항)"),
    deposit_min: int = Query(..., description="최소 보증금"),
    deposit_max: int = Query(..., description="최대 보증금"),
    rent_min: int = Query(..., description="최소 월세"),
    rent_max: int = Query(..., description="최대 월세"),
    cursor: str = Query(..., description="페이지 번호"),
):
    return gu_service.get_articles(
        gu=gu,
        dong=dong,
        deposit_min=deposit_min,
        deposit_max=deposit_max,
        rent_min=rent_min,
        rent_max=rent_max,
        cursor=cursor,
    )
@app.post("/save/estate")
async def save_estate(estate_id: Dict[str, Any] = Body(..., description="저장할 부동산 데이터 id")):
    return gu_service.save_estate(estate_id)

@app.post("/folder/create")
async def create_folder(user_id: str = Body(..., description="사용자 ID"), folder_name: str = Body(..., description="생성할 폴더 이름")):
    return gu_service.create_folder(user_id, folder_name)

@app.get("/folder/list")
async def get_folder_list(user_id: str = Query(..., description="사용자 ID")):
    return gu_service.get_folder_list(user_id)

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
