/**
 * Uploads a resume file to the backend
 * @param {File} file - The resume PDF file
 * @returns {Promise} - Promise that resolves when upload is complete
 */
export const getProfile = async () => {

    const token = localStorage.getItem("accessToken")

    const response = await fetch("http://localhost:8000/profile/", {

        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })


    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to upload resume")
    }

    return await response.json()
}
