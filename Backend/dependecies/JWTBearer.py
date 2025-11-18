from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
import os 
from dotenv import load_dotenv

load_dotenv()
JWT_SECRET = os.environ.get("JWT_KEY")

if not JWT_SECRET:
    raise ValueError("JWT_KEY not found in environment variables!")

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=401, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=401, detail="Invalid credentials.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials.")

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            payload = jwt.decode(
                jwtoken, 
                JWT_SECRET, 
                algorithms=["HS256"],
                audience="authenticated",
                options={
                    "verify_aud": True,
                    "verify_signature": True,
                    "verify_exp": True
                }
            )
            return True
        except JWTError as e:
            print(f"JWT Error: {e}"  )  # For debugging
            return False