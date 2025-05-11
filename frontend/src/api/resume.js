import { API_URL } from "./config"

/**
 * Uploads a resume file to the backend
 * @param {File} file - The resume PDF file
 * @returns {Promise} - Promise that resolves when upload is complete
 */
export const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}resume/upload`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to upload resume")
    }

    return response.json()
}

export const updateResume = async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}resume/update`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to update resume")
    }

    return response.json()
}
