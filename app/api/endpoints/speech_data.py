from fastapi import APIRouter

router = APIRouter()

@router.get("/speech-data")
async def get_speech_data(query: str):
    """
    Endpoint to handle user queries related to speech data.
    """
    return {"message": f"Dummy response for speech data query: {query}"}
