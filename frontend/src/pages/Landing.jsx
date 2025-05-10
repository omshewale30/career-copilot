"use client"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Briefcase, Star, BarChart, Github, Twitter, Linkedin, ArrowRight } from "lucide-react"

const LandingPage = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate('/auth')
    }

    const handleSignIn = () => {
        navigate('/auth')
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            navigate('/home', { replace: true })
        }

        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0d1117]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-[#6366f1] opacity-10 rounded-full blur-3xl animate-blob" />
                    <div className="absolute top-40 right-20 w-96 h-96 bg-[#7c3aed] opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#2dd4bf] opacity-10 rounded-full blur-3xl animate-blob animation-delay-4000" />
                </div>
            </div>

            {/* Loading Screen */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] z-50">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-[#e5e7eb] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[#e5e7eb] text-xl font-medium">Loading...</p>
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center py-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <Briefcase className="w-8 h-8 text-[#e5e7eb] mr-2" />
                        <span className="text-[#e5e7eb] text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#7c3aed]">
                            CareerCopilot
                        </span>
                    </motion.div>
                    <nav className="hidden md:flex space-x-8">
                        {['Features', 'About', 'Pricing'].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-[#e5e7eb]/80 hover:text-[#e5e7eb] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </nav>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:block bg-[#161b22] text-[#e5e7eb] px-6 py-2 rounded-full hover:bg-[#161b22]/80 transition-all duration-300 font-medium border border-[#e5e7eb]/10"
                        onClick={handleSignIn}
                    >
                        Sign In
                    </motion.button>
                </header>

                {/* Hero Section */}
                <motion.div
                    className="flex-1 flex flex-col items-center justify-center text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold text-[#e5e7eb] mb-8 tracking-tight"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#7c3aed]">
                            Career
                        </span>{" "}
                        <span className="inline-block relative">
                            Copilot AI
                            <motion.span
                                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#2dd4bf] to-[#6366f1] rounded-full"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-[#e5e7eb]/90 max-w-2xl mb-12 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        Your AI-powered assistant for career growth, resume optimization, and job search success.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-[#e5e7eb] font-bold rounded-full hover:shadow-lg hover:shadow-[#6366f1]/30 transform transition-all duration-300 flex items-center justify-center group"
                        >
                            Get Started
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-[#161b22] text-[#e5e7eb] font-bold rounded-full hover:bg-[#161b22]/80 transition-all duration-300 border border-[#e5e7eb]/10"
                        >
                            Learn More
                        </motion.button>
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.6 }}
                    >
                        {[
                            {
                                icon: <Briefcase className="w-6 h-6 text-[#e5e7eb]" />,
                                title: "Resume Builder",
                                description: "Create professional resumes tailored to your target roles with AI assistance.",
                                color: "from-[#6366f1]/20 to-[#6366f1]/10"
                            },
                            {
                                icon: <Star className="w-6 h-6 text-[#2dd4bf]" />,
                                title: "Skill Analysis",
                                description: "Identify skill gaps and get personalized recommendations for improvement.",
                                color: "from-[#2dd4bf]/20 to-[#2dd4bf]/10"
                            },
                            {
                                icon: <BarChart className="w-6 h-6 text-[#7c3aed]" />,
                                title: "Career Insights",
                                description: "Get data-driven career advice and industry trends to guide your professional journey.",
                                color: "from-[#7c3aed]/20 to-[#7c3aed]/10"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className={`bg-gradient-to-br ${feature.color} backdrop-blur-lg rounded-2xl p-8 border border-[#e5e7eb]/10 hover:border-[#e5e7eb]/20 transition-all duration-300`}
                            >
                                <div className="bg-[#161b22] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#e5e7eb] mb-4">{feature.title}</h3>
                                <p className="text-[#e5e7eb]/80 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* About Section */}
                <motion.section
                    id="about"
                    className="py-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-[#e5e7eb] mb-6">
                                Why Career Copilot?
                            </h2>
                            <p className="text-xl text-[#e5e7eb]/80 max-w-3xl mx-auto">
                                We're on a mission to democratize career success through AI-powered guidance and personalized support.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6"
                            >
                                <div className="bg-[#161b22] rounded-2xl p-8 border border-[#e5e7eb]/10">
                                    <h3 className="text-2xl font-bold text-[#e5e7eb] mb-4">Our Motivation</h3>
                                    <p className="text-[#e5e7eb]/80 leading-relaxed">
                                        In today's rapidly evolving job market, many professionals struggle to navigate their career paths effectively. 
                                        We created Career Copilot to bridge the gap between traditional career guidance and modern technology, 
                                        making professional development accessible to everyone.
                                    </p>
                                </div>

                                <div className="bg-[#161b22] rounded-2xl p-8 border border-[#e5e7eb]/10">
                                    <h3 className="text-2xl font-bold text-[#e5e7eb] mb-4">The Problem We Solve</h3>
                                    <p className="text-[#e5e7eb]/80 leading-relaxed">
                                        Career development is often expensive, time-consuming, and inaccessible. Many people struggle with:
                                    </p>
                                    <ul className="mt-4 space-y-3">
                                        {[
                                            "Unclear career progression paths",
                                            "Difficulty in identifying skill gaps",
                                            "Challenges in crafting effective resumes",
                                            "Limited access to career guidance"
                                        ].map((item, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                                className="flex items-center text-[#e5e7eb]/80"
                                            >
                                                <span className="w-2 h-2 bg-[#2dd4bf] rounded-full mr-3" />
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6"
                            >
                                <div className="bg-[#161b22] rounded-2xl p-8 border border-[#e5e7eb]/10">
                                    <h3 className="text-2xl font-bold text-[#e5e7eb] mb-4">How We Help</h3>
                                    <p className="text-[#e5e7eb]/80 leading-relaxed mb-6">
                                        Career Copilot leverages advanced AI to provide personalized career guidance and support:
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: "Personalized Guidance",
                                                description: "AI-powered career path recommendations based on your skills and goals"
                                            },
                                            {
                                                title: "Skill Development",
                                                description: "Identify and bridge skill gaps with targeted learning recommendations"
                                            },
                                            {
                                                title: "Resume Optimization",
                                                description: "Smart resume analysis and optimization for better job opportunities"
                                            },
                                            {
                                                title: "Career Insights",
                                                description: "Data-driven insights into industry trends and job market demands"
                                            }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                                className="bg-[#0d1117] rounded-xl p-4 border border-[#e5e7eb]/5"
                                            >
                                                <h4 className="text-lg font-semibold text-[#e5e7eb] mb-2">{item.title}</h4>
                                                <p className="text-[#e5e7eb]/70">{item.description}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* Footer */}
                <footer className="mt-auto pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#e5e7eb]/10 pt-6">
                        <div className="text-[#e5e7eb]/60 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} Career Copilot AI. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            {[
                                { icon: <Github className="w-5 h-5" />, href: "https://github.com/omshewale30" },
                                { icon: <Twitter className="w-5 h-5" />, href: "#" },
                                { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/omshewale/" }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#e5e7eb]/60 hover:text-[#e5e7eb] transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default LandingPage
