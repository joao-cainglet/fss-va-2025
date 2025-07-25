import os
import time

import httpx
from app.services.sessions import create_session
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel

router = APIRouter()

load_dotenv()

class RegulatoryQuery(BaseModel):
    query: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

TENANT_ID = os.getenv('TENANT_ID')
AUDIENCE = os.getenv('CLIENT_ID')
ISSUER = f"https://login.microsoftonline.com/{TENANT_ID}/v2.0"
JWKS_URL = f"https://login.microsoftonline.com/{TENANT_ID}/discovery/v2.0/keys"

jwks_cache = {
    "keys": [],
    "expiry": 0
}
async def get_jwks():
    """
    Fetches and caches the JWKS keys from Microsoft.
    Keys are cached for 1 hour to reduce network requests.
    """
    now = time.time()
    if jwks_cache["expiry"] > now:
        return jwks_cache["keys"]

    async with httpx.AsyncClient(verify=False) as client:
        response = await client.get(JWKS_URL)
        response.raise_for_status()
        keys = response.json()["keys"]
        
        jwks_cache["keys"] = keys
        jwks_cache["expiry"] = now + 3600 
        return keys

async def get_signing_key(token: str):
    """
    Finds the correct signing key from the JWKS based on the token's header.
    """
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        return None
    
    kid = unverified_header.get("kid")
    if not kid:
        return None

    keys = await get_jwks()
    for key in keys:
        if key.get("kid") == kid:
            return key
    return None


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Decodes and validates an MSAL access token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    signing_key = await get_signing_key(token)
    if not signing_key:
        raise credentials_exception

    try:
        claims = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=AUDIENCE,
            issuer=ISSUER
        )

        user_id = claims.get("oid")
        email = claims.get("preferred_username")
        first_name = claims.get("name")

        if user_id is None or email is None:
            raise credentials_exception

        return {"userid": user_id, "email": email, "first_name": first_name, "last_name": ""}

    except JWTError as e:
        print(f"Token validation error: {e}")
        raise credentials_exception
