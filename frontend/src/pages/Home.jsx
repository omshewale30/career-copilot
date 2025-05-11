"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../components/Spinner"

const Home = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const hasResume = localStorage.getItem("hasResume") === "true"
        navigate(hasResume ? '/chat' : '/resume-upload', { replace: true })
    }, [navigate])

    return <Spinner />
}

export default Home
