from langchain.agents import AgentExecutor, create_tool_calling_agent
import os
from dotenv import load_dotenv
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate
from langchain.tools import Tool
# noinspection PyUnresolvedReferences
from backend.app.tools.get_resume_text import get_resume_text
from backend.app.tools.generate_cover_letter import generate_cover_letter
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel
from langchain_community.tools import BraveSearch
from langchain_community.tools import DuckDuckGoSearchResults

# Load environment variables from .env file
load_dotenv(override=True)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-4o-mini"


class CoverLetterResponse(BaseModel):
    cover_letter: str


# Define the tools you want the agent to use
tools = [
    Tool(name="GetResumeText", func=get_resume_text,
         description="Get the resume text for the user from the resume store."),
    Tool(name="GenerateCoverLetter", func=generate_cover_letter,
            description='''Use this tool to generate a cover letter when the user asks for a cover letter. The resume for the user is already stored in the cache, 
                        user does not need to provide the resume. The input to this tool is job description which the user will provide. The output will be a plain text cover letter.''',
         return_direct=True),
    DuckDuckGoSearchResults()
]

llm = ChatOpenAI(model=MODEL)
MEMORY_KEY = "chat_history"

# Define the memory that will be used to persist conversation history
memory = ConversationBufferMemory(memory_key=MEMORY_KEY, return_messages=True)

# Define the prompt template to be used by the agent
prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content="You are a career copilot agent. Your job is to assist users in writing cover letters based on their resumes and job descriptions, offer career advice. You will use the tools provided to gather information and assist the user. You will also keep track of the conversation history."),
        MessagesPlaceholder(variable_name="chat_history"),  # Chat history placeholder
        HumanMessagePromptTemplate.from_template("{query}"),  # Use 'query' instead of 'human_input'
        MessagesPlaceholder(variable_name="agent_scratchpad"),  # Agent's scratchpad for intermediate steps
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

# if __name__ == "__main__":
#     # Example usage
#     user_input = ("Can you help me write a cover letter for this job description?"
#                   """
#                   About the job
# Overview
#
# We are seeking a full-time Software Engineering Intern in our Chandler, AZ location. In this role, you will be responsible for learning and training to develop software for Garmin's communication and navigation products under supervision.
#
# Essential Functions
#
# Learn to develop software using C#, .NET or other selected languages
# Learn to test software using debuggers, emulators, simulators, and logic analyzers
# Learn to perform software releases and software quality assurance activities
# Learn to perform maintenance activities for products already in production in addition to new product software design
#
#
# Basic Qualifications
#
# Completed coursework in Computer Science, Electrical Engineering, Computer Engineering, or a related field
# Excellent academics (cumulative GPA greater than or equal to 3.0 as a general rule)
# Must possess relevant experience and/or training in languages such as C, C++, C# or Java
# Must possess relevant experience and/or training in data structures or object oriented design methodology
# """)
#     response = get_agent_response(user_input)
#     print(response)

