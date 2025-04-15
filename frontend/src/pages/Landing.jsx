"use client"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Briefcase, Star, BarChart, Github, Twitter, Linkedin } from "lucide-react"


const LandingPage = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const navigate = useNavigate()

    const handleGetStarted = () => {
        // Navigate to the home page when "Get Started" button is clicked
        navigate('/auth')
    }

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-700 z-0" />

            {/* Animated Circles - Background Elements */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl" />

            {/* Loading Screen */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-700 z-50">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-white text-xl font-medium">Loading...</p>
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Briefcase className="w-8 h-8 text-white mr-2" />
                        <span className="text-white text-xl font-bold">CareerCopilot</span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#features" className="text-white hover:text-blue-200 transition-colors">
                            Features
                        </a>
                        <a href="#about" className="text-white hover:text-blue-200 transition-colors">
                            About
                        </a>
                        <a href="#pricing" className="text-white hover:text-blue-200 transition-colors">
                            Pricing
                        </a>
                    </nav>
                    <button className="hidden md:block bg-white/30 backdrop-blur-md backdrop-saturate-150 text-white px-5 py-2 rounded-full shadow-md hover:bg-white/40 transition-all duration-300 font-medium border border-white/40">
                      Sign In
                    </button>




                    <button className="md:hidden text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* Hero Section */}
                <motion.div
                    className="flex-1 flex flex-col items-center justify-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <span className="inline-block">Career</span>{" "}
                        <span className="inline-block relative">
              Copilot AI
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></span>
            </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-blue-100 max-w-2xl mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        Your AI-powered assistant for career growth, resume optimization, and job search success.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                    >
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group">
                            Get Started
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-400 to-indigo-700 text-white font-bold rounded-full hover:bg-opacity-30 transition-all duration-300">
                            Learn More
                        </button>
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.6 }}
                    >
                        <div className="bg-white/20 backdrop-blur-lg backdrop-saturate-150 rounded-2xl p-6 hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-md">
                            <div className="bg-blue-500 bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6 text-blue-100" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Resume Builder</h3>
                          <p className="text-gray-800">
                            Create professional resumes tailored to your target roles with AI assistance.
                          </p>
                        </div>


                          <div className="bg-white/20 backdrop-blur-lg backdrop-saturate-150 rounded-2xl p-6 hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-md">
                            <div className="bg-green-500 bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Star className="w-6 h-6 text-green-200" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Skill Analysis</h3>
                            <p className="text-blue-100">Identify skill gaps and get personalized recommendations for improvement.</p>
                        </div>

                         <div className="bg-white/20 backdrop-blur-lg backdrop-saturate-150 rounded-2xl p-6 hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-md">
                            <div className="bg-purple-500 bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <BarChart className="w-6 h-6 text-purple-200" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Career Insights</h3>
                            <p className="text-blue-100">
                                Get data-driven career advice and industry trends to guide your professional journey.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <footer className="mt-auto pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-white border-opacity-20 pt-6">
                        <div className="text-white text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} Career Copilot AI. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-white hover:text-blue-200 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white hover:text-blue-200 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white hover:text-blue-200 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default LandingPage
