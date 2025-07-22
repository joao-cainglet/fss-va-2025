from typing import Dict

from app.services.sessions import stream_and_save
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter()


class RegulatoryQuery(BaseModel):
    query: str


@router.post("/regulatory-data/{session_id}")
async def regulatory_data(session_id: str, payload: Dict = Body(...)):
    """
    Receives a user query and streams back the LLM response.
    """
    user_query = payload.get("query")
    if not user_query:
        raise HTTPException(status_code=400, detail="Query is required")

    return StreamingResponse(
        stream_and_save(session_id, user_query), media_type="text/event-stream"
    )
