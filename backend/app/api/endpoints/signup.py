from requests import session

from app.auth.user_auth import sign_up
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel


class User(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


router = APIRouter()

@router.post("/signup")
def user_sign_up(user:User):
    """
    Sign up a new user.
    """
    try:
        # Call the signup function from the auth module
        user_info, access_token, profile =sign_up(user.first_name, user.last_name, user.email, user.password, "http://localhost:3000")
        return {"user": user_info,"access_token":access_token,  "profile": profile}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))