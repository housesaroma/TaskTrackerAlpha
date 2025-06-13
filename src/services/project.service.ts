import axios from 'axios';
import {IProject} from '../types/types.ts'

const API_URL = 'http://localhost:5001/api/projects';

interface CreateProjectData {
    title: string;
    description?: string;
}

interface CreateProjectData {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export const projectService = {
    async getProjects(): Promise<IProject[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<IProject[]>(API_URL, {
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

                throw new Error(error.response.data.message || 'Не удалось загрузить проекты');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    },

    async getProjectById(projectId: number): Promise<IProject> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<IProject>(`${API_URL}/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async createProject(data: CreateProjectData): Promise<IProject> {
        try {
            const token = localStorage.getItem('token');
            const now = new Date().toISOString();

            const projectData = {
                title: data.title,
                description: data.description || 'Новый проект',
                startDate: data.startDate || now,
                endDate: data.endDate || now
            };

            const response = await axios.post<IProject>(API_URL, projectData, {
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
                    throw new Error('Неверные данные проекта');
                }

                throw new Error(error.response.data.message || 'Не удалось создать проект');
            }
            throw new Error('Произошла непредвиденная ошибка');
        }
    }
};