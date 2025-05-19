from fastapi import APIRouter
from app.api.endpoints import resume, chat
from app.api.endpoints import signin
from app.api.endpoints import signup
from app.api.endpoints import user
from app.api.endpoints import profile
from app.api.endpoints import logout
from app.api.endpoints import resume_update
from app.api.endpoints import payments
from app.api.endpoints import subscription
router = APIRouter()

router.include_router(resume.router, prefix="/resume", tags=["resume"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(signin.router, prefix="/auth", tags=["signin"])
router.include_router(signup.router, prefix="/auth", tags=["signup"])
router.include_router(user.router, prefix="/user", tags=["user"])
router.include_router(profile.router, prefix="/profile", tags=["profile"])
router.include_router(logout.router, prefix="/logout", tags=["logout"])
router.include_router(resume_update.router, prefix="/resume", tags=["update"])
router.include_router(payments.router, prefix="/payments", tags=["payments"])
router.include_router(subscription.router, prefix="/subscription", tags=["subscription"])
# router.include_router(suggestions.router, prefix="/suggestions", tags=["suggestions"])
