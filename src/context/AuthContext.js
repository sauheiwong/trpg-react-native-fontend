import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import apiClient from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // When the app is active, try to get token from secureStore
    useEffect(() => {
        const loadToken = async() => {
            try {
                const storedToken = await SecureStore.getItemAsync("userToken");
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (e) {
                console.error("Failed to load token", e);
            } finally {
                setIsLoading(false);
            }
        }

        loadToken();
    }, []);

    const login = async (username, password) => {
        const response = await apiClient.post("/login", { username, password });
        const receivedToken = response.data.token;

        setToken(receivedToken);
        await SecureStore.setItemAsync("userToken", receivedToken);
    }

    const logout = async () => {
        await apiClient.post("/logout", {})
        setToken(null);
        await SecureStore.deleteItemAsync("userToken");
    }

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
