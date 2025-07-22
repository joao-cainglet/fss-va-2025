from fastapi import APIRouter

router = APIRouter()

@router.get("/internal-data")
async def get_internal_data(query: str):
    """
    Endpoint to handle user queries related to internal data.
    """
    return {"message": f"Dummy response for internal data query: {query}"}
