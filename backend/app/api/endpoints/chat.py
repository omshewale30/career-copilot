from fastapi import APIRouter, HTTPException
from app.core.cache import resume_store
from app.agent.base_agent import get_agent_response
from pydantic import BaseModel

router = APIRouter()

class ChatInput(BaseModel):
    user_input: str
    user_id: str = "cur_user"


@router.post("/submit")
async def call_agent(data: ChatInput):
    """
    Call the agent with the user input.
    :param ChatInput data: User input and user ID.
    :return:
    """
    user_id = data.user_id
    user_input = data.user_input
    resume = resume_store.get(user_id, "No resume found.")

    if resume == "No resume found.":
        return {"error": "No resume found."}
    # Call the agent with the user input and resume
    try:
        # Run through LangChain agent with tools
        response = await get_agent_response(user_input)
        return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))