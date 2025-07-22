from datetime import datetime
from typing import Dict, Optional

import pymongo
from app.models.database import db
from app.models.models import User
from bson import ObjectId


async def create_or_update_user(
    email: str, first_name: str, last_name: Optional[str] = None
) -> Dict:
    """
    Creates a new user if they don't exist, or updates last_login if they do.

    Args:
        email (str): User's email address
        first_name (str): User's first name
        last_name (str, optional): User's last name

    Returns:
        Dict: The user document or None if operation fails
    """
    user_collection = db.get_collection("users")

    try:
        existing_user = await user_collection.find_one({"email": email})

        if existing_user:
            result = await user_collection.find_one_and_update(
                {"email": email},
                {"$set": {"last_login": datetime.utcnow()}},
                return_document=pymongo.ReturnDocument.AFTER,
            )
            return result

        new_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            last_login=datetime.utcnow(),
        )

        result = await user_collection.insert_one(new_user.dict(by_alias=True))

        if result.inserted_id:
            created_user = await user_collection.find_one({"_id": result.inserted_id})
            return created_user

    except pymongo.errors.PyMongoError as e:
        print(f"Database error during user operation: {e}")
        return None
    except ValueError as e:
        print(f"Validation error: {e}")
        return None

    return None


async def get_user_by_email(email: str) -> Optional[User]:
    """
    Retrieves a user by their email address.

    Args:
        email (str): The email address to search for

    Returns:
        Optional[User]: User object if found, None if not found or on error

    Raises:
        ValueError: If email is empty or invalid
    """
    if not email:
        raise ValueError("Email cannot be empty")

    user_collection = db.get_collection("users")

    try:
        user_dict = await user_collection.find_one({"email": email})

        if not user_dict:
            return None

        # Convert MongoDB document to User model
        return User(**user_dict)

    except pymongo.errors.PyMongoError as e:
        print(f"Database error while fetching user: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error while fetching user: {e}")
        return None
