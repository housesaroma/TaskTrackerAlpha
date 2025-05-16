// src/services/auth.service.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Auth';

interface LoginData {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

// Экспортируем объект с методами
export const authService = {
    async login(data: LoginData): Promise<LoginResponse> {
        try {
            const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Login failed');
            }
            throw new Error('An unexpected error occurred');
        }
    }
};