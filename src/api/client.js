import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { API_CONFIG } from "./API";

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

// axios request middleware
apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("userToken");

        if (token) {
            config.headers.Authorization = token;
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default apiClient;
