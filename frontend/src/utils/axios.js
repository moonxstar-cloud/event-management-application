// src/utils/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Matching your backend port
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;