// boardService.ts
import axios from 'axios';
import {IBoard, CreateBoardData, ITask, IDefect} from '../types/types';
import {host} from '../constants/host.ts'

const API_URL = `${host}/api`;

export const boardService = {
    async getBoardsByProjectId(projectId: number): Promise<IBoard[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<IBoard[]>(`${API_URL}/projects/${projectId}/boards`, {
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

                throw new Error(error.response.data.message || 'Не удалось загрузить доски проекта');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    },

    async getBoardById(boardId: number): Promise<IBoard> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<IBoard>(`${API_URL}/Board/${boardId}`, {
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

                if (error.response.status === 404) {
                    throw new Error('Доска не найдена');
                }

                throw new Error(error.response.data.message || 'Не удалось загрузить доску');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    },

    async createBoard(data: CreateBoardData): Promise<IBoard> {
        try {
            const token = localStorage.getItem('token');
            const now = new Date().toISOString();

            const boardData = {
                title: data.title,
                description: data.description || 'Новая доска',
                startDate: now,
                endDate: now,
                projectId: data.projectId
            };

            const response = await axios.post<IBoard>(`${API_URL}/Board`, boardData, {
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

    async updateBoard(projectId: number, boardId: number, data: Partial<CreateBoardData>): Promise<IBoard> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch<IBoard>(`${API_URL}/projects/${projectId}/boards/${boardId}`, data, {
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

                if (error.response.status === 404) {
                    throw new Error('Доска не найдена');
                }

                throw new Error(error.response.data.message || 'Не удалось обновить доску');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    },

    async deleteBoard(projectId: number, boardId: number): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/projects/${projectId}/boards/${boardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new Error('Нет соединения с сервером. Проверьте интернет-соединение.');
                }

                if (error.response.status === 401) {
                    throw new Error('Необходима авторизация');
                }

                if (error.response.status === 404) {
                    throw new Error('Доска не найдена');
                }

                throw new Error(error.response.data.message || 'Не удалось удалить доску');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    },

    async createTask(data: {
        title: string;
        description?: string;
        deadline?: string;
        boardId: number;
        projectId: number;
        currentColumn: string;
        statusId?: number;
        priorityId?: number;
        assignedUserRoleId?: number;
    }): Promise<ITask> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post<ITask>(`${API_URL}/Tasks`, {
                title: data.title || 'Новая задача',
                description: data.description || '',
                boardId: data.boardId,
                projectId: data.projectId,
                deadline: "2025-05-26T16:27:37.237Z",
                currentColumn: data.currentColumn || 'Новые задачи',
                statusId: data.statusId || 1,
                priorityId: data.priorityId || 1,
                assignedUserRoleId: data.assignedUserRoleId || 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error details:', error.response.data);
                throw new Error(error.response.data.message || JSON.stringify(error.response.data));
            }
            throw new Error('Не удалось создать задачу');
        }
    },

    async updateTask(taskId: number, updates: { title?: string, description?: string }): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/Tasks`,
                {
                    taskId: taskId,
                    ...updates
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new Error('Нет соединения с сервером. Проверьте интернет-соединение.');
                }

                if (error.response.status === 401) {
                    throw new Error('Необходима авторизация');
                }

                throw new Error(error.response.data.message || 'Не удалось обновить задачу');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    },

    async createDefect(data: {
        title: string;
        description?: string;
        deadline?: string;
        boardId: number;
        projectId: number;
        currentColumn: string;
        statusId?: number;
        priorityId?: number;
        assignedUserRoleId?: number;
    }): Promise<IDefect> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post<IDefect>(`${API_URL}/Tasks/newDefect`, {
                title: data.title || 'Новый дефект',
                description: data.description || '',
                boardId: data.boardId,
                projectId: data.projectId,
                deadline: "2025-05-26T16:27:37.237Z",
                currentColumn: data.currentColumn || 'Новые задачи',
                statusId: data.statusId || 1,
                priorityId: data.priorityId || 1,
                assignedUserRoleId: data.assignedUserRoleId || 1
            }, {
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
                throw new Error(error.response.data.message || 'Не удалось создать дефект');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    }
};