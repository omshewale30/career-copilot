import os
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi import Request, HTTPException
from app.core.cache import resume_store

load_dotenv(override=True)
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def sign_up(f_name, l_name, email, password, redirect_url):
    """
    Sign up a new user with email and password.

    Args:
        f_name (str): The user's first name.
        l_name (str): The user's last name.
        email (str): The user's email address.
        password (str): The user's password.
        redirect_url (str): URL to redirect to after sign up.

    Returns:
        dict: Response from the Supabase API.

    """
    # Sign up the user
    data = supabase.auth.sign_up({
        'email': email,
        'password': password,
        'options': {
            'email_redirect_to': redirect_url,
        },
    })
    if data.user:
        # insert user into profiles table
        user_id = data.user.id

        res = supabase.table("profiles").insert(
            {"id": user_id,
             "has_resume": False,
                "first_name": f_name,
                "last_name": l_name,
                "email": email,
             }
        ).execute()

    return data.user, data.session.access_token, res.data[0] if res.data else None

def sign_in(email, password):
    """
    Sign in a user with email and password.

    Args:
        email (str): The user's email address.
        password (str): The user's password.

    Returns:
        dict: Response from the Supabase API.
    """
    # Sign in the user
    data = supabase.auth.sign_in_with_password({
        'email': email,
        'password': password,
    })
    if data.user:
        # check if user has resume and return the boolean value
        user_id = data.user.id
        res = supabase.table("profiles").select("has_resume").eq("id", user_id).execute()
        has_resume = res.data[0]["has_resume"] if res.data else None
        # Check if the user has a resume
        if has_resume:
    
            resume = supabase.table("resumes").select("content").eq("user_id", user_id).execute()
            if resume.data:
                # Store the resume in the cache
                resume_store["cur_user"] = resume.data[0]["content"]
            else:
                # If no resume is found, set it to None
                resume_store["cur_user"] = None


    return data.user,data.session.access_token ,res.data[0]["has_resume"] if res.data[0] else None

def getuser(request: Request):
    """
    Get the current user.

    Returns:
        dict: The current user's data.
    """
    # Get the current user
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    jwt = auth_header.split(" ")[1]
    data = supabase.auth.get_user(jwt)
    print(data.user)

    return data.user
