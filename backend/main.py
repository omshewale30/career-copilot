from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Request
from app.api.routes import router as api_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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


# Define allowed origins based on environment
origins = ["*"]

# Add CORS middleware with environment-specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

#app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def root():
    return {"message": "Career Copilot API"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)



