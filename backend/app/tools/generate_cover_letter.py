from langchain.tools import tool
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from backend.app.core.cache import resume_store
@tool
def generate_cover_letter(job_description):
    """
    Generate a cover letter based on the job description.
    :param job_description: str: Job description.
    :return: str: Generated cover letter.
    """
    # Placeholder for actual cover letter generation logic
    load_dotenv(override=True)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    MODEL = "gpt-4o-mini"
    llm = ChatOpenAI(model=MODEL)

    resume = resume_store.get("default_user", "No resume found.")
    cover_letter_prompt = f"""
    You are an expert career assistant trained in professional writing. Given the user's resume and a job description, your task is to generate a tailored, compelling, and concise cover letter.
    
    Instructions:
    
    Match the applicant’s skills and experiences to the job requirements.
    
    Follow a standard cover letter structure:
    
    Introduction with position applied for and enthusiasm
    
    One or two body paragraphs with tailored highlights from resume
    
    Closing paragraph with call to action and gratitude
    
    Use a professional yet personable tone.
    
    Keep the length within 300–400 words.
    
    The output should be in plain text, no markdown or special formatting.
    
    Only include the cover letter, no additional text or explanations.
    RESUME: {resume}
    JOB DESCRIPTION: {job_description}
    """
    # Generate the cover letter using the LLM

    cover_letter = llm.invoke(cover_letter_prompt)

    return cover_letter.content
