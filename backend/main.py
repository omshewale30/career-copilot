from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from app.api.routes import router as api_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting lifespan")
    yield
    print("Stopping lifespan")

app = FastAPI(
    title="Career Copilot API",
    description="API for Career Copilot",
    version="0.1.0",
    lifespan=lifespan
)

# Define allowed origins
origins = [
    "http://localhost:5173",
    "https://career-copilot-nu.vercel.app",
    "https://career-copilot-frontend-ze2k7.kinsta.app",
    "https://career-copilot-backend-ze2k7.kinsta.app"
]

# Add CORS middleware with specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

app.include_router(api_router)

#app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def root():
    return {"message": "Career Copilot API"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)



