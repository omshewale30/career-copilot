"use client"

import { useState } from "react"
import ResumeUpload from "../components/ResumeUpload"
import ChatWindow from "../components/ChatWindow"
import ProfileIcon from "../components/ProfileIcon.jsx" // Assuming you have a ProfileIcon component

const Home = () => {

    const isGuest= localStorage.getItem("isGuest") === "true"
    const hasResume = localStorage.getItem("hasResume") === "true"
    const [resumeUploaded, setResumeUploaded] = useState(hasResume)
    const [messages, setMessages] = useState([
        {
            sender: "agent",
            text: "Hello! I'm your AI career assistant. Please upload your resume to get started.",
        },
    ])

    const handleResumeUpload = () => {
        setResumeUploaded(true)
        localStorage.setItem("hasResume", true)
        setMessages([
            ...messages,
            {
                sender: "agent",
                text: "Thanks for uploading your resume! How can I help you with your career today? I can help with cover letters, identifying skill gaps, or providing career guidance.",
            },
        ])
    }

    return (
        <div className="container mx-auto max-w-4xl p-4 relative">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Career Copilot</h1>
                <p className="text-gray-600">Your personal assistant for career growth and job applications</p>
                <div className="absolute top-4 right-4">
                    <ProfileIcon />
                </div>
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
