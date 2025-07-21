from app.api.router import router as api_router
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}


app.include_router(api_router)
