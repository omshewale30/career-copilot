"use client"

import { useState, useRef, useEffect } from "react"
import { submitChat } from "../api/chat"
import MessageBubble from "./MessageBubble"

const ChatWindow = ({ initialMessages, setMessages }) => {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const [localMessages, setLocalMessages] = useState(initialMessages || [])

    // Sync local messages with parent state
    useEffect(() => {
        setMessages(localMessages)
    }, [localMessages, setMessages])

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom()
    }, [localMessages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = { sender: "user", text: input.trim() }

        // Update UI immediately with user message
        setLocalMessages((prev) => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            // Send message to API and handle the response
            console.log("Sending message to API:", userMessage.text)
            const response = await submitChat(userMessage.text)

            // Check for any errors in the backend response
            if (response.error) {
                throw new Error(response.error)
            }

            // Add agent response to chat
            setLocalMessages((prev) => [...prev, { sender: "agent", text: response.response }])
        } catch (error) {
            console.error("Error sending message:", error)
            setLocalMessages((prev) => [
                ...prev,
                {
                    sender: "agent",
                    text: error.message || "Sorry, I encountered an error. Please try again.",
                },
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {localMessages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                ))}

                {loading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
                            <div className="flex space-x-2">
                                <div
                                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                ></div>
                                <div
                                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                ></div>
                                <div
                                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`px-4 py-2 rounded-md font-medium text-white ${
                            !input.trim() || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatWindow
