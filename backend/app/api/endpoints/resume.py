from fastapi import APIRouter, UploadFile, File
from app.tools.resume_parser import extract_text_from_pdf
from backend.app.core.cache import resume_store
from app.auth.user_auth import getuser
from app.db.db import supabase
from fastapi import Request, HTTPException

router = APIRouter()
@router.post("/upload")
async def upload_resume( request: Request ,file: UploadFile = File(...)):
    """
    Upload a resume and extract text from it.
    """
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files are allowed."}

    # Save the uploaded file temporarily
    content = await file.read()

    # Extract text from the PDF
    extracted_text = extract_text_from_pdf(content)
    if not extracted_text:
        return {"error": "Failed to extract text from the PDF."}



    user = getuser(request)
    resume_store["cur_user"] = extracted_text

    if user :
        # User is logged in, update the has_resume field in the database
        print("User is logged in")
        user_id = user.id
        resume_response = supabase.table("resumes").insert(
            {"user_id": user_id, "content": extracted_text}
        ).execute()

        profile_res = supabase.table("profiles").update({"has_resume": True}).eq("id", user_id).execute()


    if not resume_store["cur_user"]:
        return {"error": "Failed to store resume text."}


    return {"message": "Resume uploaded successfully.", "extracted_text": extracted_text[:10]}