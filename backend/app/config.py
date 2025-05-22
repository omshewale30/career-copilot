import os
from functools import lru_cache

class Settings:
    # Environment
    ENV = os.getenv("ENV", "development")
    IS_DEVELOPMENT = ENV == "development"

    # API URLs
    API_URLS = {
        "development": "http://localhost:8000",
        "production": "https://career-copilot-backend-ze2k7.kinsta.app"
    }
    API_URL = API_URLS["development" if IS_DEVELOPMENT else "production"]

    # Stripe Keys
    STRIPE_KEYS = {
        "development": os.getenv("STRIPE_TEST_KEY"),
        "production": os.getenv("STRIPE_LIVE_KEY")
    }
    STRIPE_KEY = STRIPE_KEYS["development" if IS_DEVELOPMENT else "production"]
    
    # Webhook Secrets
    WEBHOOK_SECRETS = {
        "development": os.getenv("STRIPE_WEBHOOK_SECRET_TEST"),
        "production": os.getenv("STRIPE_WEBHOOK_SECRET_LIVE")
    }
    WEBHOOK_SECRET = WEBHOOK_SECRETS["development" if IS_DEVELOPMENT else "production"]

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings() 