from typing import Union

from fastapi import Depends, FastAPI,  HTTPException, Header
from pydantic import BaseModel
from dotenv import load_dotenv
import pandas as pd
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import os
from dependecies.JWTBearer import JWTBearer
from supabase import create_client, Client
from jose import jwt, JWTError



app = FastAPI()


# load env
load_dotenv()

SUPABASE_URL: str = os.environ.get("SUPABASE_URL")
SUPABASE_KEY: str = os.environ.get("SUPABASE_URL")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
async def get_current_user(authorization: str = Header(...)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = authorization.split(" ")[1]
        # Verify the token using Supabase's public key or get_user()
        # For simplicity, this example uses get_user()
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise credentials_exception
        return user_response.user
    except (JWTError, IndexError):
        raise credentials_exception

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change this later only for dev purposes
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}

@app.get("/recs/{movie_id}", dependencies=[Depends(JWTBearer())])
def get_movie_recs(movie_id: int) : 
    
    BASE_DIR = Path(__file__).resolve().parent
    json_path = BASE_DIR.parent / "Data" / "movie_similarities.json"
   
    movies = pd.read_json(json_path, orient='index')
   
    try:
        recs = movies.loc[movie_id]
    except(KeyError):
        print(type(movie_id))
        raise HTTPException(status_code=404, detail='Item not found')
    
    print(recs)
    return {
        "movie_id": movie_id,
        "recs": recs.tolist()
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)