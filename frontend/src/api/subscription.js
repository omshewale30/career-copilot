/* This middle is used to set user tier to the appropriate tier in the database*/
import { API_URL } from "./config";

export const setUserTier = async (tier) => {
    const response = await fetch(`${API_URL}subscription/set-tier`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ tier: tier }),
    }); 
    return response.json();
};

export const checkSubscription = async () => {
    const response = await fetch(`${API_URL}payments/check-subscription`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
    }); 
    return response.json();
};
