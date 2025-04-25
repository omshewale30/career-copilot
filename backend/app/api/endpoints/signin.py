from backend.app.auth.user_auth import sign_in
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel


class User(BaseModel):
    email: str
    password: str

router = APIRouter()

@router.post("/signin")
def user_sign_in(user: User):
    """
    Sign in a user.
    """
    try:
        # Call the sign_in function from the auth module
        user,access_token, has_resume = sign_in(user.email, user.password)
        return {"user": user, "access_token": access_token, "has_resume": has_resume}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))