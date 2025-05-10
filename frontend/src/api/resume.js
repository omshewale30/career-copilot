import { getApiEndpoint } from './config'

/**
 * Uploads a resume file to the backend
 * @param {File} file - The resume PDF file
 * @returns {Promise} - Promise that resolves when upload is complete
 */
export const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("accessToken")

    const response = await fetch(getApiEndpoint("resume/upload"), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to upload resume")
    }

    return await response.json()
}
