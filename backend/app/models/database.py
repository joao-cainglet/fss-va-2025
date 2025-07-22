# database.py
import os

import motor.motor_asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the connection string from environment variables
DB_URL = os.getenv("DB_CONNECTION_STRING")

# Create a new client and connect to the server
client = motor.motor_asyncio.AsyncIOMotorClient(DB_URL)

# Get a reference to your database
db = client.myNewDatabase
