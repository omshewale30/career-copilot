"use client"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Briefcase } from "lucide-react"
import {signUp} from "../api/auth.js";
import {signIn} from "../api/auth.js";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState(null)
  const [signupError, setSignupError] = useState(null)
  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      // User is already logged in, redirect to home page
      navigate('/home', { replace: true })
    }
  })


  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  // Form handlers
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target
    setSignupData({
      ...signupData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    console.log("Login submitted:", loginData)
    try {
      const data = await signIn(loginData.email, loginData.password)
      if (data) {
        console.log("Login successful:", data)

        // Store the access token in local storage
        localStorage.setItem("accessToken", data['access_token'])
        localStorage.setItem("hasResume", data['has_resume'])
        localStorage.setItem("isGuest","false")

        // Redirect to the home page and replace the current entry in the history stack
        navigate('/home', { replace: true })
      }

    }
    catch (error) {
      console.error("Login error:", error)
        setLoginError(error.message)
      // Handle login error (e.g., show a message to the user)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    console.log("Signup submitted:", signupData)
    try{
        const data = await signUp(signupData.firstName, signupData.lastName,signupData.email, signupData.password)
        if (data) {
            // Store the access token in local storage
            console.log("Signup successful:")
            localStorage.setItem("accessToken", data['access_token'])
            // Navigate to the home page and replace the current entry in the history stack
            navigate('/home', { replace: true })
        }
    }
    catch (error) {
        console.error("Signup error:", error)
        setSignupError(error.message)
        // Handle signup error (e.g., show a message to the user)
    }
  }

  const handleGuestContinue = () => {
    console.log("Continuing as guest")
    localStorage.setItem("isGuest", "true")
    localStorage.setItem("hasResume", "false")
    navigate('/home')
    // Add your guest login logic here
  }

  return (
  
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-primary mr-2" />
            <span className="text-2xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CareerCopilot
            </span>
          </div>
          <p className="text-muted text-sm">Your AI-powered career companion</p>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-xl shadow-xl overflow-hidden border border-border">
          {/* Card Header with Tabs */}
    
          <div className="flex border-b border-border">
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "login" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted hover:text-foreground"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "signup"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted hover:text-foreground"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="login-email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="block w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="block w-full pl-10 pr-10 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={handleLoginChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-muted">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </div>

                {loginError && (
                  <div className="text-sm text-destructive">{loginError}</div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-foreground bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                  >
                    Login
                  </button>
                </div>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="signup-firstname" className="text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="signup-firstname"
                        name="firstName"
                        type="text"
                        required
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                        className="block w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signup-lastname" className="text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="signup-lastname"
                        name="lastName"
                        type="text"
                        required
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                        className="block w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-10 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-10 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agreeToTerms"
                    type="checkbox"
                    required
                    checked={signupData.agreeToTerms}
                    onChange={handleSignupChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-muted">
                    I agree to the{" "}
                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {signupError && (
                  <div className="text-sm text-destructive">{signupError}</div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-foreground bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted">Or</span>
                </div>
              </div>
            </div>

            {/* Guest Option */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full flex items-center justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
              >
                Continue as Guest
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-muted">
          <p>
            By using this service, you agree to our{" "}
            <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
