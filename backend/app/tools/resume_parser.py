from langchain_community.document_loaders import PyPDFLoader
import tempfile
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser

from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv(override=True)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-4o-mini"
llm = ChatOpenAI(model=MODEL)



RESUME_FUNCTION_SCHEMA = {
    "name": "parse_resume",
    "description": "Structure a resume into JSON following the specified format.",
    "parameters": {
        "type": "object",
        "properties": {
            "contact": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "email": {"type": "string"},
                    "phone": {"type": "string"},
                    "location": {"type": "string"},
                },
                "required": ["name", "email", "phone", "location"],
            },
            "summary": {"type": "string"},
            "work_experience": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "company": {"type": "string"},
                        "title": {"type": "string"},
                        "start": {"type": "string"},
                        "end": {"type": "string"},
                        "location": {"type": "string"},
                        "bullets": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                    },
                    "required": ["company", "title", "start", "end", "location", "bullets"],
                },
            },
            "education": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "degree": {"type": "string"},
                        "school": {"type": "string"},
                        "start": {"type": "string"},
                        "end": {"type": "string"},
                        "gpa": {"type": "string"},
                    },
                    "required": ["degree", "school", "start", "end"],
                },
            },
            "projects": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "description": {"type": "string"},
                        "tech": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                    },
                    "required": ["name", "description", "tech"],
                },
            },
            "skills": {
                "type": "array",
                "items": {"type": "string"},
            },
            "certificates": {
                "type": "array",
                "items": {"type": "string"},
            },
        },
        "required": ["contact", "work_experience", "education", "projects", "skills"],
    },
}

def resume_txt_to_json(resume_txt): # this function is used to parse the resume text into a json object
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a strict résumé parser."),
        ("human", "Parse this résumé into JSON: {resume_txt}")
    ])
    chain = (
        prompt
        | llm.bind(functions=[RESUME_FUNCTION_SCHEMA], function_call={"name": "parse_resume"})
        | JsonOutputFunctionsParser()
    )
    result = chain.invoke({"resume_txt": resume_txt})
    return result


def extract_json_from_pdf(bytes_data): # this function is used to extract the json object from the pdf file
    '''
    Extract text from a PDF file using PyPDFLoader.
    :param bytes_data:
    :return: returns the text content of the PDF.
    '''
    # Create a temporary file to save the PDF bytes
    with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as temp_file:
        temp_file.write(bytes_data)
        temp_file.flush()

        loader = PyPDFLoader(temp_file.name)
        pages = loader.load()
        full_text = ".\n".join([page.page_content for page in pages])
        json_object = resume_txt_to_json(full_text)

    return json_object

