import asyncio
from typing import AsyncGenerator, Dict, List

import pymongo
from app.models.database import db
from app.models.models import Message, Session
from bson import ObjectId


class MockAIMessageChunk:
    def __init__(self, content: str):
        self.content = content

    def __repr__(self):
        return f"AIMessageChunk(content='{self.content}')"


async def fake_langchain_llm_streamer(
    prompt: str,
) -> AsyncGenerator[MockAIMessageChunk, None]:
    """Simulates a LangChain LLM streaming response objects."""
    response_chunks = [
        "Hello! ",
        "This response ",
        "is now coming ",
        "from objects ",
        "similar to ",
        "LangChain's ",
        "AIMessageChunk.",
    ]
    for chunk_content in response_chunks:
        yield MockAIMessageChunk(content=chunk_content)
        await asyncio.sleep(0.05)


async def stream_and_save(
    session_id: str, user_prompt: str
) -> AsyncGenerator[str, None]:
    """
    Streams response, handles errors, and saves the full turn to the DB.
    """
    session_collection = db.get_collection("sessions")

    try:
        session = await session_collection.find_one({"_id": ObjectId(session_id)})
        if not session:
            print(f"Error: Session {session_id} not found.")
            return
    except Exception as e:
        print(f"Database error checking session: {e}")
        return

    full_response_chunks = []

    try:
        async for chunk_obj in fake_langchain_llm_streamer(user_prompt):
            content_to_stream = chunk_obj.content
            full_response_chunks.append(content_to_stream)
            yield content_to_stream
    except Exception as e:
        print(f"An error occurred during LLM streaming: {e}")
        yield "Sorry, I encountered an error and couldn't complete your request."
        return

    full_response = "".join(full_response_chunks)
    user_message = Message(role="user", content=user_prompt)
    assistant_message = Message(role="assistant", content=full_response)

    try:
        await session_collection.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$push": {
                    "messages": {
                        "$each": [user_message.dict(), assistant_message.dict()]
                    }
                }
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
    session_collection = db.get_collection("sessions")

    try:
        # Create new session document
        new_session = Session(
            userid=ObjectId(userid), title=title, intent=intent, messages=[]
        )

        # Insert into database
        result = await session_collection.insert_one(new_session.dict(by_alias=True))

        if result.inserted_id:
            # Fetch and return the created session
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
