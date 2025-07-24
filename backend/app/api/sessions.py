from datetime import datetime
from typing import List, Optional

from app.core.middleware import get_current_user
from app.models.models import Message
from app.services.sessions import (
    create_session,
    delete_session,
    get_session_by_id,
    get_sessions_by_userid,
    rename_session,
)
from app.services.users import get_user_by_email
from fastapi import APIRouter, Depends, HTTPException, status
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


@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str, current_user: dict = Depends(get_current_user)):
    """
    Retrieves a chat session by its ID.

    Args:
        session_id: The ID of the session to retrieve
        current_user: User information from authentication middleware

    Returns:
        SessionResponse: Details of the requested session

    Raises:
        HTTPException: If session is not found or user is not authorized
    """
    session = await get_session_by_id(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check if the session belongs to the current user
    user = await get_user_by_email(current_user["email"])
    if str(session["userid"]) != str(user.id):
        raise HTTPException(
            status_code=403, detail="Not authorized to access this session"
        )

    return {
        "id": str(session["_id"]),
        "title": session["title"],
        "userid": str(session["userid"]),
        "intent": session["intent"],
        "created_at": session["created_at"],
        "messages": session.get("messages", []),
    }


@router.get("/sessions", response_model=List[SessionResponse])
async def get_user_sessions(current_user: dict = Depends(get_current_user)):
    """
    Retrieves all chat sessions for the authenticated user.

    Args:
        current_user: User information from authentication middleware

    Returns:
        List[SessionResponse]: List of all sessions for the user

    Raises:
        HTTPException: If user is not found or session fetch fails
    """
    user = await get_user_by_email(current_user["email"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    sessions = await get_sessions_by_userid(str(user.id))

    return [
        {
            "id": str(session["_id"]),
            "title": session["title"],
            "userid": str(session["userid"]),
            "intent": session["intent"],
            "created_at": session["created_at"],
        }
        for session in sessions
    ]


@router.patch("/sessions/{session_id}/rename")
async def rename_session_endpoint(session_id: str, payload: dict):
    """API endpoint to rename a chat session.

    This endpoint handles the partial update of a session resource,
    specifically changing its title.

    Args:
        session_id (str): The unique ID of the session, passed in the URL path.
        payload (dict): The request body containing the new title.
                        Expected format: {"title": "New Session Title"}

    Raises:
        HTTPException: 400 status if the 'title' key is missing from the payload.
        HTTPException: 404 status if the session ID does not exist.

    Returns:
        dict: A confirmation message and the updated session data.
    """
    new_title = payload.get("title")
    if not new_title:
        raise HTTPException(status_code=400, detail="New title is required")

    updated_session = await rename_session(session_id, new_title)
    if not updated_session:
        raise HTTPException(
            status_code=404, detail="Session not found or failed to update"
        )

    return {"message": "Session renamed successfully"}


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session_endpoint(session_id: str):
    """API endpoint to delete a chat session.

    Permanently removes a session document from the database. On successful
    deletion, it returns a 204 No Content status with an empty body.

    Args:
        session_id (str): The unique ID of the session to delete, passed
        in the URL path.

    Raises:
        HTTPException: 404 status if the session ID does not exist.
    """
    success = await delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")

    return
