from fastapi import APIRouter, Request, HTTPException
from app.db.db import supabase
from app.auth.user_auth import getuser
from pydantic import BaseModel

router = APIRouter()

class TierUpdate(BaseModel):
    tier: str

@router.post("/set-tier")
async def set_tier(tier_update: TierUpdate, request: Request):
    user = getuser(request)
    print("this is the user", user)

    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    
    res = supabase.table("profiles").update({"tier": tier_update.tier}).eq("id", user.id).execute()


    return {"message": "Tier set successfully"}



