from datetime import datetime
from typing import List, Literal, Optional

from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field, GetJsonSchemaHandler
from pydantic_core.core_schema import CoreSchema


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, core_schema: CoreSchema, handler: GetJsonSchemaHandler
    ) -> dict:
        """
        Generates the JSON schema for this type.
        In this case, it informs that the ObjectId should be represented as a string.
        """
        # Pydantic v2 uses this method to customize the JSON schema
        return {"type": "string"}


class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    last_login: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# --- Model for a single message ---
class Message(BaseModel):
    """A single message in a chat session, with a role and content."""

    role: Literal["user", "assistant", "system"]
    content: str


class Session(BaseModel):
    """The main document that holds the entire conversation history."""

    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userid: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    title: str
    intent: str
    messages: List[Message] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
