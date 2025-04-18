from contextlib import asynccontextmanager

from fastapi import FastAPI
from app.api.routes import router as api_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting lifespan")
    yield
    print("Stopping lifespan")



app = FastAPI(
    title="Career Copilot API",
    description="API for Career Copilot",
    version="0.1.0",
    lifespan= lifespan
)
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


