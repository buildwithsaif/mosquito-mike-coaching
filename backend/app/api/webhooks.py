from fastapi import APIRouter

router = APIRouter()

@router.post("/call-completed")
async def call_completed_webhook():
    return {"message": "Call completed webhook received"}

@router.post("/analysis-ready")
async def analysis_ready_webhook():
    return {"message": "Analysis ready webhook received"}