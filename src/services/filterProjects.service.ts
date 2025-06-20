import axios from 'axios'
import { IProject, ITask } from '../types/types'
import { host } from '../constants/host.ts'

const API_URL = `${host}/api`
const token = localStorage.getItem('token')

export const filterProjectsService = {
	async getAllProjects(): Promise<IProject[]> {
		try {
			const response = await axios.get<IProject[]>(`${API_URL}/projects`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data
		} catch (error) {
			return Promise.reject(
				this.handleError(error, 'Не удалось загрузить проекты')
			)
		}
	},

	async getTasksByProject(projectId: number | null): Promise<ITask[]> {
		try {
			const url = projectId
				? `${API_URL}/Tasks/tasksByProject/${projectId}`
				: `${API_URL}/Tasks/byUser`

			const response = await axios.get<ITask[]>(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data
		} catch (error) {
			return Promise.reject(
				this.handleError(error, 'Не удалось загрузить задачи')
			)
		}
	},

	async updateTask(
		taskId: string,
		updateData: { isDone: boolean }
	): Promise<ITask> {
		console.log(`Отправил задачу ${taskId}, статус ${updateData.isDone}`)
		try {
			const response = await axios.put<ITask>(
				`${API_URL}/Tasks`,
				{ taskId: taskId, isDone: updateData.isDone },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			console.log(response.data)
			return response.data
		} catch (error) {
			return Promise.reject(
				this.handleError(error, 'Не удалось обновить задачу')
			)
		}
	},

	handleError(error: unknown, defaultMessage: string): Error {
		if (axios.isAxiosError(error)) {
			if (!error.response) {
				return new Error(
					'Нет соединения с сервером. Проверьте интернет-соединение.'
				)
			}

			if (error.response.status === 401) {
				return new Error('Необходима авторизация')
			}

			return new Error(error.response.data.message || defaultMessage)
		}
		return new Error('Произошла непредвиденная ошибка')
	},
}
