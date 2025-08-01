from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_calls():
    return {"message": "Get all calls"}

@router.get("/{call_id}")
async def get_call(call_id: int):
    return {"message": f"Get call {call_id}"}

@router.post("/")
async def create_call():
    return {"message": "Create new call"}