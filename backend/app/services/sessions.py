import asyncio
from datetime import datetime, timezone
from typing import AsyncGenerator, Dict, List, Optional

import pymongo
from app.models.database import db
from app.models.models import Message, Session
from app.services.azure_openai import client, deployment_name
from bson import ObjectId
from langchain.schema.messages import AIMessage, HumanMessage, SystemMessage

session_collection = db.get_collection("sessions")


async def stream_and_save(
    session_id: str, user_prompt: str
) -> AsyncGenerator[str, None]:
    """
    Gets history, streams LLM response using the direct openai client,
    and saves the full turn to the DB.
    """
    session = await session_collection.find_one({"_id": ObjectId(session_id)})

    if not session:
        print(f"Error: Session {session_id} not found.")
        yield "Error: Could not find session."
        return

    # 1. Build history in the format required by the openai client
    # (a list of dictionaries, not LangChain objects)
    history = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in session.get("messages", [])
    ]
    history.append({"role": "user", "content": user_prompt})

    full_response_chunks = []
    try:
        # 2. Call the client's streaming method
        response_stream = await client.chat.completions.create(
            model=deployment_name,
            messages=history,
            stream=True,
        )

        async for chunk in response_stream:
            if chunk.choices:
                content_to_stream = chunk.choices[0].delta.content
                if content_to_stream is not None:
                    full_response_chunks.append(content_to_stream)
                    yield content_to_stream

    except Exception as e:
        print(f"An error occurred during LLM streaming: {e}")
        yield "Sorry, an error occurred while generating the response."
        return

    # 4. Assemble and save (this part remains the same)
    full_response = "".join(full_response_chunks)
    user_message = Message(role="user", content=user_prompt)
    assistant_message = Message(role="assistant", content=full_response)

    try:
        await session_collection.update_one(
            {"_id": ObjectId(session_id)},
            {
                # Operator 1: Add the new messages to the array
                "$push": {
                    "messages": {
                        "$each": [user_message.dict(), assistant_message.dict()]
                    }
                },
                # Operator 2: Set the value of the 'updated_at' field
                "$set": {"created_at": datetime.now(timezone.utc)},
            },
        )
    except pymongo.errors.PyMongoError as e:
        print(f"Failed to save conversation to DB for session {session_id}: {e}")


async def create_session(userid: str, title: str, intent: str) -> Dict:
    """
    Creates a new chat session for a user.

    Args:
        userid (str): The ID of the user creating the session
        title (str): The title of the chat session

    Returns:
        Dict: The created session document or None if creation fails
    """

    try:
        new_session = Session(
            userid=ObjectId(userid), title=title, intent=intent, messages=[]
        )

        result = await session_collection.insert_one(new_session.dict(by_alias=True))

        if result.inserted_id:
            created_session = await session_collection.find_one(
                {"_id": result.inserted_id}
            )
            return created_session

    except pymongo.errors.PyMongoError as e:
        print(f"Failed to create new session: {e}")
        return None
    except ValueError as e:
        print(f"Invalid userid format: {e}")
        return None


async def get_session_by_id(session_id: str) -> Dict:
    """
    Retrieves a chat session by its ID.

    Args:
        session_id (str): The ID of the session to retrieve

    Returns:
        Dict: The session document or None if not found
    """

    try:
        session = await session_collection.find_one({"_id": ObjectId(session_id)})
        return session

    except pymongo.errors.PyMongoError as e:
        print(f"Failed to fetch session: {e}")
        return None
    except ValueError as e:
        print(f"Invalid session_id format: {e}")
        return None


async def get_sessions_by_userid(userid: str) -> List[Dict]:
    """
    Retrieves all chat sessions for a specific user.

    Args:
        userid (str): The ID of the user whose sessions to retrieve

    Returns:
        List[Dict]: List of session documents or empty list if none found
    """

    try:
        cursor = session_collection.find({"userid": ObjectId(userid)})
        cursor = session_collection.find({"userid": ObjectId(userid)}).sort(
            "created_at", pymongo.DESCENDING
        )
        sessions = await cursor.to_list(length=None)
        return sessions

    except pymongo.errors.PyMongoError as e:
        print(f"Failed to fetch sessions for user {userid}: {e}")
        return []
    except ValueError as e:
        print(f"Invalid userid format: {e}")
        return []


async def rename_session(session_id: str, new_title: str) -> Optional[Dict]:
    """
    Renames a specific chat session.

    Args:
        session_id (str): The ID of the session to rename.
        new_title (str): The new title for the session.

    Returns:
        Optional[Dict]: The updated session document, or None if not found.
    """
    try:
        if not ObjectId.is_valid(session_id):
            return None

        result = await session_collection.find_one_and_update(
            {"_id": ObjectId(session_id)},
            {"$set": {"title": new_title}},
            return_document=pymongo.ReturnDocument.AFTER,
        )
        return result

    except pymongo.errors.PyMongoError as e:
        print(f"Error renaming session {session_id}: {e}")
        return None


async def delete_session(session_id: str) -> bool:
    """
    Deletes a specific chat session.

    Args:
        session_id (str): The ID of the session to delete.

    Returns:
        bool: True if a session was deleted, False otherwise.
    """
    try:
        if not ObjectId.is_valid(session_id):
            return False

        result = await session_collection.delete_one({"_id": ObjectId(session_id)})

        # The delete_one method returns a result object with a deleted_count attribute.
        # We return True if the count is 1, meaning a document was found and deleted.
        return result.deleted_count > 0

    except pymongo.errors.PyMongoError as e:
        print(f"Error deleting session {session_id}: {e}")
        return False
