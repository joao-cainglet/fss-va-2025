from fastapi import APIRouter

router = APIRouter()

@router.get("/regulatory-data")
async def get_regulatory_data(query: str):
    """
    Endpoint to handle user queries related to regulatory data.
    """
    return {"message": f"Dummy response for regulatory data query: {query}"}
