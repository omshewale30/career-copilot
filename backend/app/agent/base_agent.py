from langchain.agents import AgentExecutor, create_tool_calling_agent
import os
from dotenv import load_dotenv
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate
from langchain.tools import Tool
# noinspection PyUnresolvedReferences
from app.tools.get_resume_text import get_resume_text, resume_tool
from app.tools.generate_cover_letter import generate_cover_letter
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel
from app.tools.resume_variant_generator import generate_resume_variant

from langchain_community.tools import DuckDuckGoSearchResults
# from app.tools.text_to_pdf import text_to_pdf

# Load environment variables from .env file
load_dotenv(override=True)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-4o-mini"


class CoverLetterResponse(BaseModel):
    cover_letter: str


# Define the tools you want the agent to use
tools = [
    #Tool(name="TextToPDF", func=text_to_pdf, description=" Does not take any input. Converts cover letter text stored in cache into PDF, saves it, and returns the file path.", return_direct=True),
    resume_tool,  # Use the structured resume tool
    Tool(name="GenerateCoverLetter", func=generate_cover_letter,
            description='''Use this tool to generate a cover letter when the user asks for a cover letter. The resume for the user is already stored in the cache, 
                        user does not need to provide the resume. The input to this tool is job description which the user will provide. The output will be a plain text cover letter.''',
         return_direct=True),
    DuckDuckGoSearchResults(),
    Tool(name="GenerateResumeVariant", func=generate_resume_variant,
         description='''Use this tool to generate a resume improvement suggestions when the user asks for resume improvement suggestions or how to improve their resume. The input to this tool is resume in json format and job description. The output will be a json object with the following fields:
                        - job_keywords: the keywords extracted from the job description
                        - optimization_suggestions: the optimization suggestions for the resume based on the job description''',
         return_direct=True)
]

llm = ChatOpenAI(model=MODEL)
MEMORY_KEY = "chat_history"

# Define the memory that will be used to persist conversation history
memory = ConversationBufferMemory(memory_key=MEMORY_KEY, return_messages=True)

# Define the prompt template to be used by the agent
prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content="""You are a career copilot agent. Your job is to assist users in writing cover letters based on their resumes and job descriptions, offer career advice. 

IMPORTANT INSTRUCTIONS:
1. The user's resume is automatically loaded when they sign in and stored in the cache.
2. To access the user's resume, you MUST use the GetResumeText tool - it takes no arguments and returns the resume text.
3. Do not ask the user to provide their resume - it's already available through the GetResumeText tool.
4. When you need to analyze or reference the resume, always use the GetResumeText tool first.

You will use the tools provided to gather information and assist the user. You will also keep track of the conversation history."""),
        MessagesPlaceholder(variable_name="chat_history"),
        HumanMessagePromptTemplate.from_template("{query}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

# Create the agent using the tools, llm, prompt, and memory
agent = create_tool_calling_agent(
    llm=llm,
    tools=tools,
    prompt=prompt,
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, memory=memory)


# Sample function to interact with the agent, update the memory, and get a response
async def get_agent_response(user_input):
    # Update the memory with the user input
    memory.chat_memory.add_user_message(user_input)

    # Get the agent's response using the updated memory
    raw_response = agent_executor.invoke({
        "query": user_input,
    })

    # Update the memory with the agent's response
    memory.chat_memory.add_ai_message(raw_response['output'])

    # Return the agent's response
    return raw_response['output']

if __name__ == "__main__":
    # Example usage
    user_input = (" please make a cover letter stored in the cache into pdf")
    response = get_agent_response(user_input)
    print(response)

