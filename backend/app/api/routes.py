from fastapi import APIRouter
from app.api.endpoints import resume, chat

router = APIRouter()

router.include_router(resume.router, prefix="/resume", tags=["resume"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
# router.include_router(suggestions.router, prefix="/suggestions", tags=["suggestions"])
