import axios from "axios";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL+'/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
})

// Endpoint for refreshing the tokens
const refreshToken = async () => {
    await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/v1/auth/refresh', {}, {
        withCredentials: true
    })
    return
}

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
            await refreshToken()
            return api.request({ ...originalRequest })
        } catch {
            useAuthStore.getState().logout()
        }
    }
    return Promise.reject(error)
})