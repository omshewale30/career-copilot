from fastapi import APIRouter, UploadFile, File
from app.tools.resume_parser import extract_text_from_pdf
from backend.app.core.cache import resume_store

router = APIRouter()
@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
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
    resume_store["default_user"] = extracted_text
    if not resume_store["default_user"]:
        return {"error": "Failed to store resume text."}

    # Optionally, delete the temporary file after processing
    # os.remove(file.filename)
    print("Here is users resume: ", resume_store["default_user"][:10])

    return {"message": "Resume uploaded successfully.", "extracted_text": extracted_text[:10]}