import uvicorn
from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
from service.gu_service import GuService
from scripts.load_unit_codes import load_unit_codes
from utils.scheduler import scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_unit_codes()
    app.state.crawler_service = GuService

    scheduler.schedule_job(60*48, gu_service.crawl) # 48 hour
    scheduler.start()

    yield

    scheduler.stop()

app = FastAPI(lifespan=lifespan)
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
