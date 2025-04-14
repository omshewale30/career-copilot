from langchain_community.document_loaders import PyPDFLoader
import tempfile


def extract_text_from_pdf(bytes_data):
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




    print(full_text)
    return full_text

