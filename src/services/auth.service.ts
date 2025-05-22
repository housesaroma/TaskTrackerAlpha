import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Auth';

interface LoginData {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

// Типизированные ошибки от сервера
interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

export const authService = {
    async login(data: LoginData): Promise<LoginResponse> {
        try {
            const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Обрабатываем стандартные HTTP ошибки
                if (!error.response) {
                    throw new Error('Нет соединения с сервером. Проверьте интернет-соединение.');
                }

                // Обрабатываем ошибки валидации (422) и другие специфичные ошибки
                const apiError = error.response.data as ApiError;

                if (error.response.status === 400) {
                    throw new Error('Неверное имя пользователя или пароль');
                } else if (error.response.status === 401) {
                    throw new Error('Неверные учетные данные');
                } else if (error.response.status === 422 && apiError.errors) {
                    // Обработка ошибок валидации
                    const firstError = Object.values(apiError.errors)[0][0];
                    throw new Error(firstError);
                } else if (apiError.message) {
                    throw new Error(apiError.message);
                }
            }

            throw new Error('Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.');
        }
    }
};