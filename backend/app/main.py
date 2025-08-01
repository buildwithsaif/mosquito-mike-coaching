from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import calls, webhooks

app = FastAPI(
    title="Mosquito Mike Coaching API",
    description="API for managing coaching calls and AI analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calls.router, prefix="/api/calls", tags=["calls"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])

@app.get("/")
async def root():
    return {"message": "Mosquito Mike Coaching API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}