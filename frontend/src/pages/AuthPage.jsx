"use client"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Briefcase } from "lucide-react"
import {signUp} from "../api/auth.js";
import {signIn} from "../api/auth.js";
import { supabase } from '../lib/supabaseClient';

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
      // User is already logged in, check if they have a resume
      const hasResume = localStorage.getItem("hasResume") === "true"
      navigate(hasResume ? '/chat' : '/resume-upload', { replace: true })
    }
  })
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    document.body.appendChild(script)
  }, [])


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

        // Store the access token and user data in local storage
        localStorage.setItem("accessToken", data['access_token'])
        localStorage.setItem("hasResume", data['has_resume'])
        localStorage.setItem("isGuest", "false")
        localStorage.setItem("tier", data['tier'])
        localStorage.setItem("user_email", data['user']['email'])

        // Check if user has a subscription (any tier)
        const hasSubscription = data['tier'] !== null
        if (hasSubscription) {
          // If user has a subscription, check if they have a resume
          if (data['has_resume']) {
            navigate('/chat', { replace: true })
          } else {
            navigate('/resume-upload', { replace: true })
          }
        } else {
          // If no subscription, redirect to pricing page
          navigate('/pricing', { replace: true })
        }
      }
    }
    catch (error) {
      console.error("Login error:", error)
      setLoginError(error.message)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    try{
        const data = await signUp(signupData.firstName, signupData.lastName,signupData.email, signupData.password)
        if (data) {
            console.log("Signup successful:", data)
            if (data.user.email_verification_required) {
                // Show success message about email verification
                setSignupError("Please check your email to verify your account before logging in.")
                setActiveTab("login")
            } else {
                // Store the access token in local storage
                localStorage.setItem("accessToken", data['access_token'])
                localStorage.setItem("hasAccess",false)

                setActiveTab("login")
                // Navigate to the home page and replace the current entry in the history stack
                navigate('/auth', { replace: true })
            }
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
  }

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setLoginError('Failed to sign in with Google');
    }
  };

  // Add this useEffect to handle the OAuth callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("session", session)
      
      if (session) {
        // First check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Only insert if profile doesn't exist
        if (!existingProfile) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                first_name: session.user.user_metadata.name.split(" ")[0],
                last_name: session.user.user_metadata.name.split(" ")[1],
                email: session.user.email,
                has_resume: false,
                tier: null,
              }
            ]).select();

          if (userError) {
            console.error('Error inserting user data:', userError.message);
          }
        }

        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_resume, tier')
          .eq('id', session.user.id)
          .single();

        // Store necessary data in localStorage
        localStorage.setItem("accessToken", session.access_token);
        localStorage.setItem("hasResume", profile?.has_resume || false);
        localStorage.setItem("isGuest", "false");
        localStorage.setItem("tier", profile?.tier || null);
        localStorage.setItem("user_email", session.user.email);

        // Redirect based on subscription and resume status
        if (profile?.tier) {
          navigate(profile.has_resume ? '/chat' : '/resume-upload', { replace: true });
        } else {
          navigate('/pricing', { replace: true });
        }
      }
    };

    // Check if we're on the callback page
    if (window.location.pathname === '/auth/callback') {
      handleAuthCallback();
    }
  }, [navigate]);

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

            {/* Google Sign In Button */}
            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
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
