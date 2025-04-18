"use client"

import { useState } from "react"
import ResumeUpload from "../components/ResumeUpload"
import ChatWindow from "../components/ChatWindow"

const Home = () => {
    const [resumeUploaded, setResumeUploaded] = useState(false)
    const [messages, setMessages] = useState([
        {
            sender: "agent",
            text: "Hello! I'm your AI career assistant. Please upload your resume to get started.",
        },
    ])

    const handleResumeUpload = () => {
        setResumeUploaded(true)
        setMessages([
            ...messages,
            {
                sender: "agent",
                text: "Thanks for uploading your resume! How can I help you with your career today? I can help with cover letters, identifying skill gaps, or providing career guidance.",
            },
        ])
    }

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Career Copilot</h1>
                <p className="text-gray-600">Your personal assistant for career growth and job applications</p>
            </header>

            <main className="bg-white rounded-lg shadow-md p-6">
                {!resumeUploaded ? (
                    <ResumeUpload onUploadSuccess={handleResumeUpload} />
                ) : (
                    <ChatWindow initialMessages={messages} setMessages={setMessages} />
                )}
            </main>

            <footer className="mt-8 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} AI Career Copilot. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home
