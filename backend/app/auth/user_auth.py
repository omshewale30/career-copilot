import os
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi import Request, HTTPException
from app.core.cache import resume_store

load_dotenv(override=True)
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def sign_up(f_name, l_name, email, password, redirect_url = "https://career-copilot-nu.vercel.app/"):
    """
    Sign up a new user with email and password.

    Args:
        f_name (str): The user's first name.
        l_name (str): The user's last name.
        email (str): The user's email address.
        password (str): The user's password.
        redirect_url (str): URL to redirect to after sign up.

    Returns:
        tuple: (user_info, access_token, profile)
    """
    try:
        # Sign up the user
        data = supabase.auth.sign_up({
            'email': email,
            'password': password,
        })

        if not data or not data.user:
            raise Exception("Failed to create user account")

        # insert user into profiles table
        user_id = data.user.id
        profile_data = {
            "id": user_id,
            "has_resume": False,
            "first_name": f_name,
            "last_name": l_name,
            "email": email,
            "stripe_customer_id": None,
            "has_access": False
        }

        res = supabase.table("profiles").insert(profile_data).execute()

        if not res.data:
            raise Exception("Failed to create user profile")

        # Return user info and profile, but indicate that email verification is required
        return {
            "id": data.user.id,
            "email": data.user.email,
            "created_at": data.user.created_at,
            "email_verification_required": True
        }, None, res.data[0]

    except Exception as e:
        raise Exception(f"Signup failed: {str(e)}")

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
        res = supabase.table("profiles").select("has_resume, tier").eq("id", user_id).execute()
        has_resume = res.data[0]["has_resume"] if res.data else None
        tier = res.data[0]["tier"] if res.data else None
        # Check if the user has a resume
        if has_resume:
            resume = supabase.table("resumes").select("content").eq("user_id", user_id).execute()
            if resume.data:
                # Store the resume in the cache
                resume_store["cur_user"] = resume.data[0]["content"]
            else:
                # If no resume is found, set it to None
                resume_store["cur_user"] = None

    return data.user, data.session.access_token, has_resume, tier

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

    return data.user
