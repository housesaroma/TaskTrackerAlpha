import axios from 'axios';
import { IBoard } from '../types/types.ts';

const API_URL = 'http://localhost:5000/api/Board';

export const boardService = {
    async createBoard(data: {
        title: string;
        description?: string;
        startDate: string;
        endDate: string;
        projectId: number;
    }): Promise<IBoard> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post<IBoard>(API_URL, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new Error('Нет соединения с сервером. Проверьте интернет-соединение.');
                }

                if (error.response.status === 401) {
                    throw new Error('Необходима авторизация');
                }

                if (error.response.status === 400) {
                    throw new Error('Неверные данные доски');
                }

                throw new Error(error.response.data.message || 'Не удалось создать доску');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    },

    async getBoardById(boardId: number): Promise<IBoard> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<IBoard>(`${API_URL}/${boardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};