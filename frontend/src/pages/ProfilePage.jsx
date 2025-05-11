"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, LogOut } from "lucide-react"
import {getProfile} from "../api/profile.js";
import {logout} from "../api/logout.js";
import Spinner from "../components/Spinner.jsx";



const ProfilePage = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        has_resume: false,
        created_at: ""
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile()
                setUserData({
                    id: profileData.id,
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    email: profileData.email,
                    has_resume: profileData.has_resume,
                    created_at: profileData.created_at
                    }
                )

            } catch (error) {
                console.error("Failed to fetch profile data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

  // Mock user data - in a real app, this would come from your auth context or API


  const handleLogout = async () => {
    // Implement your logout logic here
    // For example:
    // authService.logout();
      try {
          const response = await logout()
          console.log(response)
      }
        catch (error) {
            console.error("Logout error:", error)
            alert("Error logging out. Please try again.")
        } finally {
          localStorage.clear();
      }
    // Redirect to login or home page
    navigate("/auth", { replace: true })
  }
  if (loading) {
  return (
      <Spinner/>
  )
}



  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-2 p-2 rounded-full hover:bg-gray-100" aria-label="Go back">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground">
              First Name
            </label>
            <div className="p-3 bg-background border border-input rounded-md text-foreground">{userData.first_name}</div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground">
              Last Name
            </label>
            <div className="p-3 bg-background border border-input rounded-md text-foreground">{userData.last_name}</div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email
            </label>
            <div className="p-3 bg-background border border-input rounded-md text-foreground">{userData.email}</div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/resume-upload')}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Update Resume
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Resume</label>
            <div className="flex items-center">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center ${userData.has_resume ? "bg-green-500" : "bg-red-500"}`}
              >
                <span className="text-white text-xs">{userData.has_resume ? "✓" : "✗"}</span>
              </div>
              <span className="ml-2 text-sm text-foreground">
                {userData.has_resume ? "Resume uploaded" : "No resume uploaded"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 px-4 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
