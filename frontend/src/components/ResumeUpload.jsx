"use client"

import { useState } from "react"
import { uploadResume } from "../api/resume"
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import "../index.css"
const ResumeUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            if (selectedFile.type === "application/pdf") {
                if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                    setError("File size must be less than 5MB")
                    setFile(null)
                } else {
                    setFile(selectedFile)
                    setError("")
                }
            } else {
                setFile(null)
                setError("Please select a valid PDF file")
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file || loading) return

        setLoading(true)
        setError("")
        setUploadProgress(0)

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return prev
                    }
                    return prev + 10
                })
            }, 200)

            const res = await uploadResume(file)
            clearInterval(progressInterval)
            setUploadProgress(100)
            
            // Small delay to show 100% progress
            setTimeout(() => {
                onUploadSuccess()
            }, 500)
        } catch (err) {
            setError("Failed to upload resume. Please try again.")
            console.error("Resume upload error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center p-6 bg-background min-h-screen">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume</h2>
                    <p className="text-muted">Upload your resume to get personalized career guidance</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div 
                        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                            loading 
                                ? "border-border cursor-not-allowed opacity-50" 
                                : "border-primary/30 hover:border-primary/50 cursor-pointer bg-card/50"
                        }`}
                    >
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            className="hidden" 
                            id="resume-upload"
                            disabled={loading}
                        />
                        <label 
                            htmlFor="resume-upload" 
                            className={`flex flex-col items-center justify-center space-y-4 ${
                                loading ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                        >
                            {loading ? (
                                <div className="flex flex-col items-center space-y-4">
                                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                    <div className="w-full max-w-xs">
                                        <div className="h-2 bg-card rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-muted mt-2">Uploading... {uploadProgress}%</p>
                                    </div>
                                </div>
                            ) : file ? (
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <FileText className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-foreground font-medium">{file.name}</p>
                                        <p className="text-sm text-muted mt-1">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-foreground font-medium">Click to select your resume</p>
                                        <p className="text-sm text-muted mt-1">or drag and drop here</p>
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-foreground transition-all duration-300 ${
                                !file || loading
                                    ? "bg-card/50 cursor-not-allowed"
                                    : "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/20"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Uploading...</span>
                                </span>
                            ) : (
                                "Upload Resume"
                            )}
                        </button>

                        <div className="text-center text-sm text-muted space-y-1">
                            <p>Supported format: PDF</p>
                            <p>Maximum file size: 5MB</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResumeUpload
