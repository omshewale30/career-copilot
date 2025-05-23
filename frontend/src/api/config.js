//API Configuration
const isDevelopment = import.meta.env.MODE === 'development';
console.log("This is the isDevelopment: ", isDevelopment);
console.log("Current mode: ", import.meta.env.MODE);


// API URLs
const API_URLS = {
  development: "http://localhost:8000/",
  production: "https://career-copilot-backend-ze2k7.kinsta.app/"
};

// Stripe Keys
const STRIPE_KEYS = {
  development: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_DEV,
  production: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_PROD
};

// Export the appropriate configuration based on environment
export const API_URL = isDevelopment ? API_URLS.development : API_URLS.production;
export const STRIPE_PUBLISHABLE_KEY = isDevelopment ? STRIPE_KEYS.development : STRIPE_KEYS.production;

// Helper function to get full API endpoint
export const getApiEndpoint = (endpoint) => `${API_URL}${endpoint}` 