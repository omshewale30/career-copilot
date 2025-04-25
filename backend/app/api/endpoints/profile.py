from backend.app.auth.user_auth import getuser
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from app.db.db import supabase




router = APIRouter()

@router.post("/")
def get_user_profile(request: Request):
    """
    Retrieve the current user's profile information using the jwt token.

    """
    try:
        # Call the signup function from the auth module
        user = getuser(request)
        user_id  = user.id
        # Get the user profile from the database
        res = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))