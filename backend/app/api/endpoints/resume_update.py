from fastapi import APIRouter, UploadFile, File
from app.tools.resume_parser import extract_json_from_pdf
from app.core.cache import resume_store
from app.auth.user_auth import getuser
from app.db.db import supabase
from fastapi import Request, HTTPException

router = APIRouter()
@router.post("/update")
async def update_resume( request: Request ,file: UploadFile = File(...)):
    """
    Takes in a new resume, extracts the json and updates the resume in the database
    """
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files are allowed."}

    # Save the uploaded file temporarily
    content = await file.read()

    # Extract json from the PDF
    extracted_json = extract_json_from_pdf(content)
    if not extracted_json:
        return {"error": "Failed to extract json from the PDF."}
    

    user = getuser(request)
    resume_store["cur_user"] = extracted_json

    if user :
        # User is logged in, update the has_resume field in the database
        print("User is logged in")
        user_id = user.id
        resume_update_response = supabase.table("resumes").update(
            {"content": extracted_json}
        ).eq("user_id", user_id).execute()

        profile_res = supabase.table("profiles").update({"has_resume": True}).eq("id", user_id).execute()


    if not resume_store["cur_user"]:
        return {"error": "Failed to store resume text."}


    return {"message": "Resume uploaded successfully.", "extracted_json": extracted_json}