from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI backend!"}


@router.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id, "name": "Item Name"}
