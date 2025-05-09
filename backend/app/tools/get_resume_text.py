from app.core.cache import resume_store, jd_store
from langchain.tools import StructuredTool
from typing import Optional

def get_resume_text() -> str:
    """
    Get the resume text from the resume store.
    Returns:
        str: The user's resume text or a message if no resume is found.
    """
    resume = resume_store.get("cur_user", "No resume found.")
    
    if resume == "No resume found.":
        return "Please upload a resume and job description first."
    
    return resume

# Create a structured tool with a clear description
resume_tool = StructuredTool.from_function(
    func=get_resume_text,
    name="GetResumeText",
    description="""Use this tool to access the user's resume. The resume is automatically loaded when the user signs in.
    This tool takes no arguments and returns the user's resume text.
    Always use this tool when you need to access or analyze the user's resume."""
)

    

