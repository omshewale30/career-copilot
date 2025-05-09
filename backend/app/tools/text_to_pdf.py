from langchain.tools import tool
from app.core.cache import latest_cv
from fpdf import FPDF
import uuid
import os


@tool
def text_to_pdf():
    """
    convert text to pdf
    :return: path to the generated PDF file
    """
    text_content = latest_cv["default_user"]

    # Create a PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text_content)
    file_name = f"{uuid.uuid4()}.pdf"
    pdf_path = os.path.join("/backend/app/static", file_name)
    pdf.output(pdf_path)
    print("PDF generated at:", pdf_path)

    return pdf_path


