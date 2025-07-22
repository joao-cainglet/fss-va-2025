from typing import Dict

from app.services.sessions import create_session
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# from jose import JWTError, jwt


router = APIRouter()


class RegulatoryQuery(BaseModel):
    query: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Dummy Data ---
DUMMY_SECRET_TOKEN = "dummy-secret-token-for-dev"
DUMMY_USER = {
    "userid": "dev_user_01",
    "first_name": "dev-user",
    "email": "dev-user@example.com",
    "last_name": "",
}

# --- Configuration for your Azure AD App ---
TENANT_ID = "your-azure-ad-tenant-id"
AUDIENCE = "your-app-client-id"
ISSUER = f"https://login.microsoftonline.com/{TENANT_ID}/v2.0"
JWKS_URL = f"https://login.microsoftonline.com/{TENANT_ID}/discovery/v2.0/keys"


# async def get_current_user_from_msal(token: str = Depends(oauth2_scheme)):
#     """
#     Decodes and validates an MSAL access token.
#     """
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )

#     try:
#         # This is a simplified representation of fetching keys and decoding
#         # In a real app, you would fetch and cache the keys from JWKS_URL

#         # 1. Decode the token (library handles signature check with public keys)
#         claims = jwt.decode(
#             token,
#             # In a real implementation, you'd provide the actual keys here
#             key="...microsoft_public_keys...",
#             algorithms=["RS256"],
#             audience=AUDIENCE,
#             issuer=ISSUER
#         )

#         # 2. Extract user info from the token's claims
#         user_id = claims.get("oid") # Object ID is the unique user identifier
#         email = claims.get("preferred_username")
#         first_name = claims.get("name")

#         if user_id is None or email is None:
#             raise credentials_exception

#         # 3. Return the validated user data
#         return {"userid": user_id, "email": email, "name": first_name}


#     except JWTError:
#         raise credentials_exception
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    This is our dependency function.
    It will be called for every request to a protected endpoint.
    """
    if token != DUMMY_SECRET_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # In a real app, you would decode the token and get the user from the database.
    # Here, we just return our dummy user.
    return DUMMY_USER
