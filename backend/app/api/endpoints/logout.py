
from fastapi import APIRouter, HTTPException

from app.db.db import supabase


router = APIRouter()

@router.post("/")
def logout():
    """
    Logout a user.
    """
    try:
        response = supabase.auth.sign_out()
        return {"message": "User logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))