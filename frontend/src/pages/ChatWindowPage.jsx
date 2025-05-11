"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ChatWindow from "../components/ChatWindow"
import ProfileIcon from "../components/ProfileIcon"
import Spinner from "../components/Spinner"

const ChatWindowPage = () => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [messages, setMessages] = useState(() => {
        // Try to get messages from localStorage, if not found use default message
        const savedMessages = localStorage.getItem("chatMessages")
        if (savedMessages) {
            return JSON.parse(savedMessages)
        }
        return [{
            sender: "agent",
            text: "Hello! I'm your AI career assistant. How can I help you with your career today? I can help with cover letters, identifying skill gaps, or providing career guidance.",
        }]
    })

    useEffect(() => {
        const hasResume = localStorage.getItem("hasResume") === "true"
        
        // If user doesn't have a resume, redirect to resume upload
        if (!hasResume) {
            navigate('/resume-upload')
        }
        
        setLoading(false)
    }, [navigate])

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages))
    }, [messages])

    if (loading) {
        return <Spinner />
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl p-4 relative">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">AI Career Copilot</h1>
                    <p className="text-muted">Your personal assistant for career growth and job applications</p>
                    <div className="absolute top-4 right-4">
                        <ProfileIcon />
                    </div>
                </header>

                <main className="bg-card rounded-lg shadow-xl p-6 border border-border">
                    <ChatWindow initialMessages={messages} setMessages={setMessages} />
                </main>

                <footer className="mt-8 text-center text-sm text-muted">
                    <p>© {new Date().getFullYear()} AI Career Copilot. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}

export default ChatWindowPage