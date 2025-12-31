import api from './api';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string;
    isActive?: boolean;
    tasks?: Array<{
        _id: string;
        title: string;
        status: string;
        priority: string;
        dueDate: string;
    }>;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

class UserService {
    /**
     * Get current user profile with tasks
     */
    async getProfile(): Promise<UserProfile> {
        const response = await api.get<{ success: boolean; user: UserProfile }>('/auth/profile');
        return response.data.user;
    }

    /**
     * Update user profile
     */
    async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
        const response = await api.put<{ success: boolean; user: UserProfile }>('/auth/profile', data);
        // Update localStorage with new user data
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            localStorage.setItem('user', JSON.stringify({ ...user, ...response.data.user }));
        }
        return response.data.user;
    }

    /**
     * Change password
     */
    async changePassword(data: ChangePasswordData): Promise<void> {
        await api.put('/auth/change-password', data);
    }

    /**
     * Delete account
     */
    async deleteAccount(password: string): Promise<void> {
        await api.delete('/auth/account', { data: { password } });
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

export default new UserService();
