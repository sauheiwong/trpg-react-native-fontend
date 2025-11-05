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

const setupResponseInterceptor = (logout) => {
    apiClient.interceptors.response.use(
      (response) => response, // Passthrough for successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Authentication error (401), logging out.");
          logout();
        }
        return Promise.reject(error);
      }
    );
  };
  
export { apiClient, setupResponseInterceptor };
