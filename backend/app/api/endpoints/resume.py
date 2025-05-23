from fastapi import APIRouter, UploadFile, File, Response
from app.tools.resume_parser import extract_json_from_pdf
from app.core.cache import resume_store
from app.auth.user_auth import getuser
from app.db.db import supabase
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/upload")
async def upload_resume(request: Request, file: UploadFile = File(...)):
    """
    Upload a resume and extract text from it.
    """
    if not file.filename.endswith(".pdf"):
        return JSONResponse(
            status_code=400,
            content={"error": "Only PDF files are allowed."},
            headers={
                "Access-Control-Allow-Origin": "https://career-copilot-nu.vercel.app",
                "Access-Control-Allow-Credentials": "true",
            }
        )

    # Save the uploaded file temporarily
    content = await file.read()

    # Extract json from the PDF
    extracted_json = extract_json_from_pdf(content)
    if not extracted_json:
        return JSONResponse(
            status_code=400,
            content={"error": "Failed to extract json from the PDF."},
            headers={
                "Access-Control-Allow-Origin": "https://career-copilot-nu.vercel.app",
                "Access-Control-Allow-Credentials": "true",
            }
        )

    user = getuser(request)
    resume_store["cur_user"] = extracted_json

    if user:
        # User is logged in, update the has_resume field in the database
        print("User is logged in")
        user_id = user.id
        resume_response = supabase.table("resumes").insert(
            {"user_id": user_id, "content": extracted_json}
        ).execute()

        profile_res = supabase.table("profiles").update({"has_resume": True}).eq("id", user_id).execute()

    if not resume_store["cur_user"]:
        return JSONResponse(
            status_code=400,
            content={"error": "Failed to store resume text."},
            headers={
                "Access-Control-Allow-Origin": "https://career-copilot-nu.vercel.app",
                "Access-Control-Allow-Credentials": "true",
            }
        )

    return JSONResponse(
        status_code=200,
        content={"message": "Resume uploaded successfully.", "extracted_json": extracted_json},
        headers={
            "Access-Control-Allow-Origin": "https://career-copilot-nu.vercel.app",
            "Access-Control-Allow-Credentials": "true",
        }
    )