/**
 * Uploads a resume file to the backend
 * @param {File} file - The resume PDF file
 * @returns {Promise} - Promise that resolves when upload is complete
 */
export const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("http://localhost:8000/resume/upload", {
        method: "POST",
        body: formData,
    })


    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to upload resume")
    }

    return await response.json()
}
