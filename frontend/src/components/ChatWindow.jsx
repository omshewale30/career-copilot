"use client"

import { useState, useRef, useEffect } from "react"
import { submitChat } from "../api/chat"
import MessageBubble from "./MessageBubble"

const OptimizationSuggestions = ({ suggestions, keywords }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Optimization Suggestions</h3>
                <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                            <div className="mb-2">
                                <span className="font-medium text-gray-700">Section: {suggestion.section}</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-gray-600">Original:</p>
                                    <p className="text-gray-800">{suggestion.original}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Optimized:</p>
                                    <p className="text-green-700 font-medium">{suggestion.optimized}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Explanation:</p>
                                    <p className="text-gray-800">{suggestion.explanation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Keywords Used:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {suggestion.keywords_used.map((keyword, idx) => (
                                            <span key={idx} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ChatWindow = ({ initialMessages, setMessages }) => {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const textareaRef = useRef(null)
    const [localMessages, setLocalMessages] = useState(initialMessages || [])

    // Sync local messages with parent state
    useEffect(() => {
        setMessages(localMessages)
    }, [localMessages, setMessages])

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom()
    }, [localMessages])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [input])

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

            // Try to parse the response as JSON if it's a string
            let parsedResponse = response.response
            if (typeof response.response === 'string') {
                try {
                    parsedResponse = JSON.parse(response.response)
                } catch (e) {
                    // If parsing fails, use the original response
                    parsedResponse = response.response
                }
            }

            // Add agent response to chat
            if (parsedResponse.optimization_suggestions) {
                // Handle optimization suggestions
                setLocalMessages((prev) => [
                    ...prev,
                    {
                        sender: "agent",
                        text: "Here are your resume optimization suggestions:",
                        component: (
                            <OptimizationSuggestions
                                suggestions={parsedResponse.optimization_suggestions}
                                keywords={parsedResponse.job_keywords}
                            />
                        ),
                    },
                ])
            } else {
                // Handle regular text response
                setLocalMessages((prev) => [...prev, { sender: "agent", text: parsedResponse }])
            }
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
        <div className="flex flex-col h-screen">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {localMessages.map((message, index) => (
                    <MessageBubble
                        key={index}
                        message={message}
                        previousSender={index > 0 ? localMessages[index - 1].sender : null}
                    />
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

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border border-gray-300 bg-background rounded-lg text-gray-100">
                <div className="flex space-x-2 items-end p-1">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSubmit(e)
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
                        disabled={loading}
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`h-10 w-10 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow transition ${
                            !input.trim() || loading
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-blue-600 hover:bg-gray-100 hover:text-blue-700"
                        }`}
                        aria-label="Send"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatWindow
