# 0.  deps
import hashlib, uuid, datetime, json, tempfile, os, subprocess
import sys
from pathlib import Path

# Add the project root directory to Python path
project_root = str(Path(__file__).parent.parent.parent.parent)
sys.path.append(project_root)

from langchain import PromptTemplate, LLMChain
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser
import os
from dotenv import load_dotenv
from app.core.cache import resume_store

# 0.  deps
import hashlib, uuid, datetime, json, tempfile, os, subprocess
from langchain import PromptTemplate, LLMChain
from openai import OpenAI

load_dotenv(override=True)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=2000,
)

EXTRACT_SCHEMA = {
  "name": "extract_job_keywords",
  "description": "Pull the 30–40 most important skills / technologies / soft-skills from a job description.",
  "parameters": {
    "type": "object",
    "properties": {
      "keywords": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["keywords"]
  }
}
extract_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an ATS expert."),
    ("human", "{jd_text}")
])

keyword_chain = (
    extract_prompt
    | llm.bind(functions = [EXTRACT_SCHEMA], function_call = {"name": "extract_job_keywords"})
    | JsonOutputFunctionsParser()
)



jd_text = '''About the job
Description

Software Developer Intern

Company Overview

HealthStream is the leader in healthcare workforce solutions. We help organizations work better by helping their people work smarter.

HealthStream provides the leading learning, clinical development, credentialing, and scheduling applications delivered on healthcare's #1 platform. We streamline everyday tasks while improving performance, engagement, and safety – fostering a workplace where people flourish, and care thrives.

Why Join Us

At HealthStream, you'll have the opportunity to make a meaningful impact on the future of healthcare by collaborating with a team of talented professionals dedicated to innovation and excellence. We offer competitive compensation, comprehensive benefits, and a supportive work environment where creativity and collaboration thrive.

Our shared vision is to enhance the quality of healthcare by empowering the people who deliver care – a commitment we have upheld for over 30 years through providing innovative solutions and driving constant growth. Join us in revolutionizing the healthcare industry and shaping the future of patient care. As a HealthStreamer, you will be at the forefront of healthcare technology innovation, making a recurring impact on the industry.

We're proud of our values-forward culture that offers our people:

 Mission-oriented work 
 Diverse and inclusive culture 
 Mental and Physical Health Support 
 Work-from-home flexibility 
 Wellness workshops 
 Buddy Program for new HealthStreamers 
 Collaborative work environment 
 Career growth opportunities 
 Continuous learning opportunities 
 Inspiring workspaces to collaborate and connect with other HealthStreamers 

At HealthStream, our thriving culture encourages collaboration and values contributions, allowing our team members to continuously solve big problems and grow. We are committed to driving innovation in healthcare and ensuring that patients receive competent care from qualified professionals. As a HealthStream team member, you will help bring this vision to life. If you want to work for a company committed to its values and vision, HealthStream is the place for you!

HealthStream is an equal opportunity employer. HealthStream prohibits employment practices that discriminate against individual employees or groups of employees on the basis of age, color, disability, national origin, race, religion, sex, sexual orientation, pregnancy, veteran or military status, genetic information or any other category deemed protected by state and/or federal law.

Position Information

Position Overview

This internship offers the opportunity to work directly alongside development teams in maintaining and enhancing systems across the full stack with a focus on API development leveraging .NET framework, gaining hands-on experience in a professional development environment. Interns will collaborate with developers, QA engineers, client support teams, and product managers while participating in team meetings and one-on-one feedback sessions. This role provides valuable exposure to API development and enterprise-grade applications, helping interns build technical skills and industry knowledge in a supportive and growth-focused setting.

Key Responsibilities

 Read and understand technical documentation related to development processes 
 Collaborate effectively within a development team 
 Participate in daily/weekly team meetings 
 Report to team lead on progress 
 Complete code within a timely manner 
 Check code into source control 
 Participate in code reviews 
 Write new documentation as needed or as requested by development team members 

Qualifications

Qualifications

 Currently enrolled in computer science or related field 
 Experience in API development 
 Proficiency in GIT 

Requirements

 Knowledge of object-oriented programming principles 
 Understanding web requests and web protocols 
 Familiarity with testing patterns and best practices 
 Must have a high attention to detail 
 Must have the ability to stay focused on a problem until it is solved 


'''
#kw_dict = keyword_chain.invoke({"jd_text": jd_text})
# kws = kw_dict["keywords"]
# print(kws)





def optimize_resume_bullets(resume_json, job_keywords):
    """
    Optimize resume bullets based on job keywords.
    Returns a dictionary of suggested changes to make the resume more relevant.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert ATS resume optimizer. Your task is to analyze the resume and suggest specific improvements to make it more relevant to the job description.
        
        For each bullet point:
        1. Keep the core accomplishment
        2. Incorporate 1-2 relevant high-weight keywords naturally
        3. Keep it concise (≤ 25 words)
        4. Maintain quantifiable metrics where present
        5. Focus on technical skills and achievements
        
        Return a structured analysis with:
        - Original bullet
        - Optimized version
        - Explanation of changes
        - Keywords incorporated"""),
        ("human", """Resume JSON: {resume_json}
        
        Job Keywords: {job_keywords}
        
        Analyze and optimize the resume bullets, focusing on work experience and projects sections.""")
    ])
    
    chain = (
        prompt
        | llm.bind(functions=[{
            "name": "optimize_resume",
            "description": "Analyze and suggest improvements for resume bullets",
            "parameters": {
                "type": "object",
                "properties": {
                    "suggestions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "section": {"type": "string"},
                                "original": {"type": "string"},
                                "optimized": {"type": "string"},
                                "explanation": {"type": "string"},
                                "keywords_used": {
                                    "type": "array",
                                    "items": {"type": "string"}
                                }
                            },
                            "required": ["section", "original", "optimized", "explanation", "keywords_used"]
                        }
                    }
                },
                "required": ["suggestions"]
            }
        }], function_call={"name": "optimize_resume"})
        | JsonOutputFunctionsParser()
    )
    
    result = chain.invoke({
        "resume_json": json.dumps(resume_json),
        "job_keywords": json.dumps(job_keywords)
    })
    
    return result

def generate_resume_variant(job_description):
    """
    Generate an optimized version of the resume based on the job description.
    """
    # Extract keywords from job description
    kw_dict = keyword_chain.invoke({"jd_text": job_description})
    keywords = kw_dict["keywords"]
    
    # Parse resume into JSON
    resume_json = resume_store["cur_user"]
    
    # Generate optimization suggestions
    optimization_suggestions = optimize_resume_bullets(resume_json, keywords)
    
    # Convert the response to a JSON string
    response = {
        "job_keywords": keywords[0:10],
        "optimization_suggestions": optimization_suggestions["suggestions"][0:10]
    }
    
    return json.dumps(response)

