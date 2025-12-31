import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for refresh token cookie
    timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try to refresh the token
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newToken = response.data.token;
                localStorage.setItem('token', newToken);

                // Update the failed request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Process queued requests
                processQueue(null, newToken);

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear auth and redirect to login
                processQueue(refreshError as Error, null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle 423 (Account Locked)
        if (error.response?.status === 423) {
            const data = error.response.data as { message?: string };
            return Promise.reject(new Error(data.message || 'Account is locked. Please try again later.'));
        }

        // Handle 429 (Rate Limited)
        if (error.response?.status === 429) {
            const data = error.response.data as { message?: string };
            return Promise.reject(new Error(data.message || 'Too many requests. Please slow down.'));
        }

        // Handle validation errors (400)
        if (error.response?.status === 400) {
            const data = error.response.data as { message?: string; errors?: Array<{ message: string }> };
            if (data.errors && Array.isArray(data.errors)) {
                const errorMessages = data.errors.map((e) => e.message).join(', ');
                return Promise.reject(new Error(errorMessages));
            }
            return Promise.reject(new Error(data.message || 'Validation failed'));
        }

        return Promise.reject(error);
    }
);

export default api;
