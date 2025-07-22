from typing import Optional

from app.core.middleware import get_current_user
from app.services.users import create_or_update_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()


class UserLoginRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: Optional[str]
    last_login: str


@router.post("/login", response_model=UserResponse)
async def login(user_data=Depends(get_current_user)):
    """
    Login endpoint that creates or updates user and returns user details

    Args:
        user_data: UserLoginRequest containing email and name information

    Returns:
        UserResponse: User details including ID and last login time

    Raises:
        HTTPException: If user creation/update fails
    """
    user = await create_or_update_user(
        email=user_data["email"],
        first_name=user_data["first_name"],
        last_name=user_data["last_name"],
    )

    if not user:
        raise HTTPException(status_code=500, detail="Failed to process login request")

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "last_login": user["last_login"].isoformat(),
    }
