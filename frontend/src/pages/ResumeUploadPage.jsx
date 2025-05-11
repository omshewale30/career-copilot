"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ResumeUpload from "../components/ResumeUpload"
import ProfileIcon from "../components/ProfileIcon"
import Spinner from "../components/Spinner"

const ResumeUploadPage = () => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const isGuest = localStorage.getItem("isGuest") === "true"
        const hasResume = localStorage.getItem("hasResume") === "true"
        
        // If user already has a resume, redirect to chat
        if (hasResume) {
            navigate('/chat')
        }
        
        setLoading(false)
    }, [navigate])

    const handleResumeUpload = () => {
        localStorage.setItem("hasResume", "true")
        navigate('/chat')
    }

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
                    <ResumeUpload onUploadSuccess={handleResumeUpload} />
                </main>

                <footer className="mt-8 text-center text-sm text-muted">
                    <p>© {new Date().getFullYear()} AI Career Copilot. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}

export default ResumeUploadPage