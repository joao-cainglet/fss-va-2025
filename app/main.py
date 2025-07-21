from fastapi import FastAPI
from app.api.endpoints import regulatory_data, internal_data, speech_data

app = FastAPI()

app.include_router(regulatory_data.router, prefix="/api")
app.include_router(internal_data.router, prefix="/api")
app.include_router(speech_data.router, prefix="/api")