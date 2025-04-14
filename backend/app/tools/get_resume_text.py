
from backend.app.core.cache import resume_store, jd_store
from langchain.tools import tool

@tool
def get_resume_text():
    """
    Get the resume text from the resume store.
    :return: str: Resume text.
    """

    resume = resume_store.get("default_user", "No resume found.")

    if resume == "No resume found.":
        return "Please upload a resume and job description first."


    return resume

    

