
export const logout = async () => {
    const response = await fetch("http://localhost:8000/logout/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    })
    if (!response.ok) {
        throw new Error("Logout failed")
    }

    return await response.json()
}