import { getApiEndpoint } from './config'

export const logout = async () => {
    const response = await fetch(getApiEndpoint("logout/"), {
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