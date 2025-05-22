import json
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse, RedirectResponse
import stripe, datetime, os
from app.db.db import supabase
from app.auth.user_auth import getuser
from fastapi import Request
from pydantic import BaseModel
from app.config import settings

router = APIRouter()

@router.post("/webhook")
async def webhook(request:Request):
    stripe.api_key = settings.STRIPE_KEY

    payload = await request.body()
    event = None
    try:
        event = json.loads(payload)
    except json.decoder.JSONDecodeError as e:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
    
    if settings.WEBHOOK_SECRET:
        sig_header = request.headers.get("stripe-signature")
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, settings.WEBHOOK_SECRET)
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook error while validating signature.' + str(e))
            return JSONResponse(status_code=400, content={"error": str(e)})
        
    # Get the event data from the event object
    event_type = event["type"]
    data = event["data"]["object"]

    try:
        if event_type == "charge.succeeded" or event_type == "charge.updated":
            customer_email = data['billing_details']['email']

            user = supabase.table("profiles").select("*").eq("email", customer_email).execute()
            if user.data:
                print("User {} already exists".format(customer_email))
                supabase.table("profiles").update({"tier": "pro"}).eq("id", user.data[0]["id"]).execute()
                print("User {} updated to pro tier".format(customer_email))

            print("User {} subscribed to pro tier".format(customer_email))

        elif event_type == "customer.subscription.canceled": #User cancelled subscription
            subscription =  stripe.Subscription.retrieve(data.id) #Get subscription details
            customer_id = subscription.customer #Get customer id
            user = supabase.table("profiles").select("*").eq("stripe_customer_id", customer_id).execute().data[0]#Get user details
            print("User {} cancelled subscription".format(user["id"]))
            if user: #If user exists
                supabase.table("profiles").update({"tier": "free"}).eq("id", user.id).execute() #Update user's tier to free
                print("User {} cancelled subscription".format(user.id))
            else:
                print("User not found")
        else:
            print("Unhandled event type {}".format(event_type))
    except Exception as e:
        print("Error processing webhook: {}".format(e))
        return JSONResponse(status_code=500, content={"error": str(e)})


    return JSONResponse(status_code=200, content={"message": "Webhook received"})

@router.post("/check-subscription")
async def check_subscription(request: Request):
    user = getuser(request)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = supabase.table("profiles").select("tier").eq("id", user.id).execute()
    if not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return JSONResponse(content={"tier": profile.data[0]["tier"]})
