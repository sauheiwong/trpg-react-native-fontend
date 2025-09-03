import axios from "axios";

import { API_CONFIG } from "./API";

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

export default apiClient;
