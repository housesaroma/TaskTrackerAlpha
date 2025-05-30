import { IColumn, IEpic } from '../types/types.ts'

export const INITIAL_COLUMNS: IColumn[] = [
	{
		id: 'artifacts',
		title: 'Артефакты',
		color: '#00E8F080',
		cards: [
			// Первый проект (P1)
			{
				id: '1',
				title: 'Паспорт',
				isDone: false,
				type: 'task',
				description:
					'Подготовить паспорт проекта с описанием архитектуры и используемых технологий',
				priority: 'Важно',
				startDate: '12.08.25',
				endDate: '27.05.25',
				createdAt: '18 Мар 2024 14:45',
				epicId: '1P1E',
			},
			{
				id: '2',
				title: 'Аналитика',
				isDone: false,
				type: 'task',
				description:
					'Провести анализ конкурентов и составить отчет по ключевым метрикам',
				priority: 'Средне',
				startDate: '10.05.25',
				endDate: '10.09.25',
				createdAt: '20 Мар 2024 09:15',
			},
			{
				id: '3',
				title: 'ТЕСТ',
				isDone: false,
				type: 'defect',
				description: 'Провести анализ',
				priority: 'Важно',
				startDate: '12.08.25',
				endDate: '27.05.25',
				createdAt: '18 Мар 2024 14:45',
				epicId: '1',
			},
			// Второй проект (P2)
			{
				id: '4',
				title: 'Техническое задание',
				isDone: false,
				type: 'task',
				description:
					'Составить полное техническое задание для разработки CRM системы',
				createdAt: '10 Апр 2024 09:00',
				priority: 'Важно',
			},
			{
				id: '5',
				title: 'API документация',
				isDone: false,
				type: 'task',
				description:
					'Подготовить Swagger документацию для основных API endpoints',
				createdAt: '12 Апр 2024 14:20',
				endDate: '27.05.25',
				epicId: '101P2E',
			},
		],
	},
	{
		id: 'to-do',
		title: 'Новые задачи',
		color: '#EF312480',
		cards: [
			// Первый проект (P1)
			{
				id: '6',
				title: 'Документирование',
				description:
					'Провести документирование',
				isDone: false,
				type: 'task',
				priority: 'Средне',
				createdAt: '22 Мар 2024 16:20',
			},
			// Второй проект (P2)
			{
				id: '7',
				title: 'Интеграция с платежной системой',
				isDone: false,
				type: 'task',
				description: 'Реализовать модуль для работы с Stripe API',
				priority: 'Важно',
				createdAt: '15 Апр 2024 11:45',
			},
		],
	},
	{
		id: 'in-work',
		title: 'В работе',
		color: '#FA931980',
		cards: [
			// Первый проект (P1)
			{
				id: '8',
				title: 'Финальные правки',
				isDone: false,
				type: 'task',
				description: 'Исправить критические баги перед релизом версии 1.0.0',
				startDate: '16.10.25',
				endDate: '17.11.25',
				createdAt: '25 Мар 2024 11:05',
				epicId: '2P1E',
			},
			// Второй проект (P2)
			{
				id: '9',
				title: 'Разработка ядра системы',
				isDone: false,
				type: 'task',
				description: 'Реализация базовых сервисов и моделей данных',
				startDate: '01.05.25',
				endDate: '30.06.25',
				createdAt: '18 Апр 2024 10:15',
				epicId: '101P2E',
			},
		],
	},
	{
		id: 'done',
		title: 'Готово',
		color: '#A8F00080',
		cards: [
			// Первый проект (P1)
			{
				id: '10',
				title: 'Правки по дизайну мобильной версии',
				isDone: true,
				type: 'task',
				description:
					'Адаптировать дизайн под мобильные устройства согласно новому гайдлайну',
				priority: 'Незначительно',
				startDate: '10.01.25',
				endDate: '10.04.25',
				createdAt: '28 Мар 2024 13:30',
			},
			// Второй проект (P2)
			{
				id: '11',
				title: 'Прототип интерфейса',
				isDone: true,
				type: 'task',
				description:
					'Создать clickable prototype в Figma для согласования с заказчиком',
				startDate: '01.04.25',
				endDate: '10.04.25',
				createdAt: '05 Апр 2024 16:30',
			},
		],
	},
]

export const INITIAL_EPICS: IEpic[] = [
	// Первый проект (P1)
	{
		id: '1P1E',
		title: 'Регистрация',
		description: 'Описание эпика 1',
		startDate: '10.01.25',
		endDate: '10.04.25',
		color: '#FA9319',
	},
	{
		id: '1P2E',
		title: 'Вход в систему',
		description: 'Описание эпика 2',
		startDate: '10.01.25',
		endDate: '10.02.25',
		color: '#e84fbb',
	},
	// Второй проект (P2)
	{
		id: '2P1E',
		title: 'Разработка CRM системы',
		description:
			'Создание системы управления клиентскими отношениями для малого бизнеса',
		startDate: '01.04.25',
		endDate: '30.09.25',
		color: '#4287f5',
	},
	{
		id: '2P2E',
		title: 'Мобильное приложение',
		description: 'Разработка companion app для iOS и Android',
		startDate: '01.06.25',
		endDate: '01.12.25',
		color: '#9c42f5',
	},
]
