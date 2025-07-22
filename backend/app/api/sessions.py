from datetime import datetime
from typing import List, Optional

from app.core.middleware import get_current_user
from app.models.models import Message
from app.services.sessions import create_session
from app.services.users import get_user_by_email
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()


class SessionCreate(BaseModel):
    """Request body for creating a new session"""

    title: str = "New Chat Session"
    intent: str


class SessionResponse(BaseModel):
    """Response model for session operations"""

    id: str
    title: str = "New Chat Session"
    userid: str
    created_at: datetime
    messages: List[Message] = []
    intent: str


@router.post("/sessions", response_model=SessionResponse)
async def create_new_session(
    session_data: SessionCreate, current_user: dict = Depends(get_current_user)
):
    """
    Creates a new chat session for the authenticated user.

    Args:
        session_data: Contains the title for the new session
        current_user: User information from authentication middleware

    Returns:
        SessionResponse: Details of the created session

    Raises:
        HTTPException: If session creation fails
    """
    user = await get_user_by_email(current_user["email"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session = await create_session(
        userid=str(user.id),
        title=session_data.title,
        intent=session_data.intent,
    )

    if not session:
        raise HTTPException(status_code=500, detail="Failed to create new session")

    return {
        "id": str(session["_id"]),
        "title": session["title"],
        "userid": str(session["userid"]),
        "intent": session["intent"],
        "created_at": session["created_at"],
        "messages": session.get("messages", []),
    }
