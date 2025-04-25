// API wrapper for chat submission
/**
 * Submits a chat message to the backend
 * @param {string} userInput - The user's message text
 * @returns {Promise} - Promise that resolves with the agent's response
 */
export const submitChat = async (userInput) => {
    const response = await fetch("http://localhost:8000/chat/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_input: userInput,
            user_id: "cur_user",
        }),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to send message")
    }

    return await response.json()
}
