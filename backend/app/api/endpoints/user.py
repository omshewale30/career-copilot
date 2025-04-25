from backend.app.auth.user_auth import getuser
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel



router = APIRouter()

@router.post("/")
def cur_user():
    """
    Sign up a new user.
    """
    try:
        # Call the signup function from the auth module
        user = getuser()
        return {"user": user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))