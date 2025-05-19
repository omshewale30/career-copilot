import json
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse, RedirectResponse
# from settings import settings
import stripe, datetime, os
from app.db.db import supabase
from app.auth.user_auth import getuser
from fastapi import Request
from pydantic import BaseModel

router = APIRouter()

endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
@router.post("/webhook")
async def webhook(request:Request):
    stripe.api_key = os.getenv("STRIPE_TEST_KEY")

    payload = await request.body()
    event = None
    try:
        event = json.loads(payload)
    except json.decoder.JSONDecodeError as e:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
    
    if endpoint_secret:
        sig_header = request.headers.get("stripe-signature")
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook error while validating signature.' + str(e))
            return JSONResponse(status_code=400, content={"error": str(e)})
        
    data = event.data
    event_type = event.type


    try:
        if event_type == "checkout.session.completed":
            session = stripe.checkout.Session.retrieve(data.object.id)
            print("This is the session:{}".format(session))
            line_items = stripe.checkout.Session.list_line_items(data.object.id)
            price_id = line_items.data[0].price.id
            # Get price_id from the session's subscription data
        
            customer_id = session.customer
            customer = stripe.Customer.retrieve(customer_id)

            #Create user if not exists
            if price_id == "price_1ROrByAoomA59kINfDbWEENS":
                tier = "starter"
            elif price_id == "price_1ROrCRAoomA59kIN70kFdyV6":
                tier = "pro"
            else:
                print(f"Unknown price_id: {price_id}")
                return JSONResponse(status_code=400, content={"error": "Unknown price_id"})

            user = supabase.table("profiles").select("*").eq("stripe_customer_id", customer_id).execute()
            if user.data:
                print("User {} already exists".format(customer.email))
                supabase.table("profiles").update({"tier": tier}).eq("id", user.data[0]["id"]).execute()
                print("User {} updated to {}".format(customer.email, tier))
            else:
                supabase.table("profiles").update({'stripe_customer_id': customer_id, 'tier': tier}).eq("email", customer.email).execute()
            print("User {} subscribed to {}".format(customer.email, tier))

        elif event_type == "customer.subscription.canceled": #User cancelled subscription
            subscription =  stripe.Subscription.retrieve(data.object.id) #Get subscription details
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
