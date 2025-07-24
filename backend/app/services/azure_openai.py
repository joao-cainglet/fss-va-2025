import asyncio
import os

import httpx
from dotenv import load_dotenv
from openai import AsyncAzureOpenAI

load_dotenv()

endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
deployment = os.getenv("DEPLOYMENT_NAME")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")
api_version = os.getenv("OPENAI_API_VERSION")


client = AsyncAzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key=subscription_key,
    http_client=httpx.AsyncClient(verify=False),  # Disable SSL verification
)
deployment_name = os.getenv("DEPLOYMENT_NAME")
