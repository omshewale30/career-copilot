//API Configuration
const isDevelopment = import.meta.env.MODE === 'development';

// API URLs
const API_URLS = {
  development: "http://localhost:8000/",
  production: "https://career-copilot-backend.onrender.com/"
};


// Export the appropriate configuration based on environment
export const API_URL = isDevelopment ? API_URLS.development : API_URLS.production;


// Helper function to get full API endpoint
export const getApiEndpoint = (endpoint) => `${API_URL}${endpoint}` 