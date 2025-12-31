import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
    token: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    success: boolean;
    message: string;
    errors?: ValidationError[];
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Still clear local storage even if API call fails
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    async refreshToken(): Promise<string | null> {
        try {
            const response = await api.post<{ success: boolean; token: string }>('/auth/refresh-token');
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                return response.data.token;
            }
            return null;
        } catch (error) {
            this.clearAuth();
            return null;
        }
    }

    async getCurrentUserFromServer(): Promise<User | null> {
        try {
            const response = await api.get<{ success: boolean; user: User }>('/auth/me');
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return response.data.user;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    clearAuth(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Helper to check password strength on frontend
    validatePassword(password: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain a lowercase letter');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain an uppercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain a number');
        }
        if (!/[@$!%*?&]/.test(password)) {
            errors.push('Password must contain a special character (@$!%*?&)');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

export default new AuthService();
