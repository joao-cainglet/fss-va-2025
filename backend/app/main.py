import pymongo
from app.api import auth, internal_data, regulatory_data, sessions, speech_data
from app.models.database import db
from fastapi import FastAPI

app = FastAPI()


async def create_indexes():
    """
    Create indexes on the collections to improve query performance.
    This function is called on application startup.
    """
    # Get collection objects
    user_collection = db.get_collection("users")
    session_collection = db.get_collection("sessions")

    # Create a unique index on the 'email' field in the 'users' collection
    # This prevents duplicate user emails
    await user_collection.create_index([("email", pymongo.ASCENDING)], unique=True)
    print("Created index for users collection.")

    # Create an index on the 'userid' field in the 'sessions' collection
    # This will speed up queries to find all sessions for a specific user
    await session_collection.create_index([("userid", pymongo.ASCENDING)])
    print("Created index for sessions collection.")


@app.on_event("startup")
async def startup_event():
    """
    On startup, connect to the database and create indexes.
    """
    print("FastAPI application starting up...")
    await create_indexes()


app.include_router(regulatory_data.router, prefix="/api")
app.include_router(internal_data.router, prefix="/api")
app.include_router(speech_data.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
