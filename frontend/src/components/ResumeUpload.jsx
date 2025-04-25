"use client"

import { useState } from "react"
import { uploadResume } from "../api/resume"

const ResumeUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile)
            setError("")
        } else {
            setFile(null)
            setError("Please select a valid PDF file")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            setError("Please select a resume file")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await uploadResume(file,)
            console.log(res)
            onUploadSuccess()
        } catch (err) {
            setError("Failed to upload resume. Please try again.")
            console.error("Resume upload error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">Upload Your Resume</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
                        <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400 mb-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <span className="text-gray-600 font-medium">
                {file ? file.name : "Click to select your resume (PDF)"}
              </span>
                            <span className="text-sm text-gray-500 mt-1">{!file && "or drag and drop here"}</span>
                        </label>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className={`w-full py-2 px-4 rounded-md font-medium text-white 
              ${
                            !file || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        } transition-colors`}
                    >
                        {loading ? "Uploading..." : "Upload Resume"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Your resume will be analyzed to provide personalized career guidance.</p>
                    <p className="mt-1">We support PDF files up to 5MB in size.</p>
                </div>
            </div>
        </div>
    )
}

export default ResumeUpload
