"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, LogOut, Crown, Star, Sparkles, Upload, User, Mail, CreditCard } from "lucide-react"
import { getProfile } from "../api/profile.js"
import { logout } from "../api/logout.js"
import Spinner from "../components/Spinner.jsx"

const getTierIcon = (tier) => {
  switch (tier) {
    case "pro":
      return <Crown className="h-6 w-6 text-yellow-400" />
    case "starter":
      return <Star className="h-6 w-6 text-blue-400" />
    case "free":
      return <Sparkles className="h-6 w-6 text-purple-400" />
    default:
      return <Sparkles className="h-6 w-6 text-gray-400" />
  }
}

const getTierColor = (tier) => {
  switch (tier) {
    case "pro":
      return "from-yellow-900/40 to-yellow-600/30"
    case "starter":
      return "from-blue-900/40 to-blue-700/30"
    case "free":
      return "from-purple-900/40 to-purple-700/30"
    default:
      return "from-gray-800 to-gray-700"
  }
}

const getTierBorder = (tier) => {
  switch (tier) {
    case "pro":
      return "border-yellow-700/50"
    case "starter":
      return "border-blue-700/50"
    case "free":
      return "border-purple-700/50"
    default:
      return "border-gray-700"
  }
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    has_resume: false,
    created_at: "",
  })
  const [loading, setLoading] = useState(true)
  const tier = localStorage.getItem("tier") || "free"
  const fromResumeUpload = localStorage.getItem("fromResumeUpload") === "true"

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
          created_at: profileData.created_at,
        })
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await logout()
      console.log(response)
    } catch (error) {
      console.error("Logout error:", error)
      alert("Error logging out. Please try again.")
    } finally {
      localStorage.clear()
    }
    navigate("/auth", { replace: true })
  }

  const handleBack = () => {
    if (fromResumeUpload) {
      localStorage.removeItem("fromResumeUpload")
      navigate("/chat")
    } else {
      navigate(-1)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1128] to-[#121a2e] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1128] to-[#121a2e] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8 backdrop-blur-sm bg-[#0f172a]/30 p-4 rounded-2xl border border-[#1e293b]/50">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-[#1e293b]/50 transition-all duration-300 ease-in-out"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-300" />
          </button>
          <h1 className="text-3xl font-bold text-white ml-4">Profile</h1>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tier info */}
          <div className="lg:col-span-1">
            {/* Tier Badge */}
            <div
              className={`bg-gradient-to-br ${getTierColor(tier)} p-6 rounded-2xl shadow-lg border ${getTierBorder(tier)} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#0f172a]/60 p-3 rounded-xl">{getTierIcon(tier)}</div>
                <div className="bg-[#0f172a]/60 px-4 py-1 rounded-full text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tier} Plan
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white capitalize mt-4">
                {tier === "pro" ? "Professional" : tier === "starter" ? "Starter" : "Free"} Tier
              </h2>
              <p className="text-gray-300/80 mt-2 text-sm">
                {tier === "pro"
                  ? "Access to all premium features and priority support"
                  : tier === "starter"
                    ? "Enhanced features for growing professionals"
                    : "Basic features to get you started"}
              </p>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-gray-300">{formatDate(userData.created_at)}</p>
              </div>

              {/* Add Edit Subscription button */}
            
            <button
                  onClick={() => window.open("https://billing.stripe.com/p/login/test_6oUcN41A58ILcCnapd3gk00?prefilled_email="+userData.email, "_blank")}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0f172a]/60 hover:bg-[#0f172a]/80 text-gray-300 py-3 px-4 rounded-xl transition-all duration-300 border border-white/10 group"
                >
                  <CreditCard className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Edit Subscription</span>
            </button>
            
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-[#331133] hover:bg-[#441144] text-red-300 py-4 px-4 rounded-xl transition-all duration-300 border border-red-900/30 group"
            >
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>

          {/* Right column - User info and actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="bg-[#0f172a]/70 rounded-2xl p-6 shadow-lg border border-[#1e293b]/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-400" />
                Personal Information
              </h3>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Full Name
                  </label>
                  <div className="p-4 bg-[#0a1128]/80 border border-[#1e293b] rounded-xl text-gray-200 font-medium">
                    {userData.first_name} {userData.last_name}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    Email Address
                  </label>
                  <div className="p-4 bg-[#0a1128]/80 border border-[#1e293b] rounded-xl text-gray-200 font-medium">
                    {userData.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Status Card */}
            <div className="bg-[#0f172a]/70 rounded-2xl p-6 shadow-lg border border-[#1e293b]/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-purple-400" />
                Resume Status
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      userData.has_resume
                        ? "bg-green-900/20 border border-green-700/30"
                        : "bg-red-900/20 border border-red-700/30"
                    }`}
                  >
                    <Upload className={`h-6 w-6 ${userData.has_resume ? "text-green-400" : "text-red-400"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-white text-lg">
                      {userData.has_resume ? "Resume Uploaded" : "No Resume"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {userData.has_resume
                        ? "Your resume is ready for applications"
                        : "Upload your resume to apply for positions"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/resume-upload", { state: { isUpdate: userData.has_resume } })}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 ${
                    userData.has_resume
                      ? "bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 border border-purple-700/30"
                      : "bg-purple-700/30 hover:bg-purple-600/40 text-white border border-purple-500/30"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {userData.has_resume ? "Update Resume" : "Upload Resume"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
