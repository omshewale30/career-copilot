"use client"

import {useState, useEffect} from "react"
import ResumeUpload from "../components/ResumeUpload"
import ChatWindow from "../components/ChatWindow"
import ProfileIcon from "../components/ProfileIcon.jsx"
import Spinner from "../components/Spinner.jsx"

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [resumeUploaded, setResumeUploaded] = useState(false)
    const [messages, setMessages] = useState([
        {
            sender: "agent",
            text: "Hello! I'm your AI career assistant. Please upload your resume to get started.",
        },
    ])

    useEffect(() => {
        const isGuest = localStorage.getItem("isGuest") === "true"
        const hasResume = localStorage.getItem("hasResume") === "true"
        setResumeUploaded(hasResume)
        setLoading(false)
    }, [])

    const handleResumeUpload = () => {
        setResumeUploaded(true)
        localStorage.setItem("hasResume", "true")
        setMessages([
            ...messages,
            {
                sender: "agent",
                text: "Thanks for uploading your resume! How can I help you with your career today? I can help with cover letters, identifying skill gaps, or providing career guidance.",
            },
        ])
    }

    if (loading) {
        return <Spinner/>
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl p-4 relative">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">AI Career Copilot</h1>
                    <p className="text-muted">Your personal assistant for career growth and job applications</p>
                    <div className="absolute top-4 right-4">
                        <ProfileIcon/>
                    </div>
                </header>

                <main className="bg-card rounded-lg shadow-xl p-6 border border-border">
                    {!resumeUploaded ? (
                        <ResumeUpload onUploadSuccess={handleResumeUpload}/>
                    ) : (
                        <ChatWindow initialMessages={messages} setMessages={setMessages}/>
                    )}
                </main>

                <footer className="mt-8 text-center text-sm text-muted">
                    <p>© {new Date().getFullYear()} AI Career Copilot. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}

export default Home
