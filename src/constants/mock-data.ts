import {IColumn, IEpic} from "../types/types.ts";

export const INITIAL_COLUMNS: IColumn[] = [
	{
		id: 'artifacts',
		title: 'Артефакты',
		color: '#00E8F080',
		cards: [
			{
				id: '1',
				title: 'Дизайн',
				isDone: false,
				type: 'task',
				description:
					'Создать макеты основных экранов приложения в Figma, включая светлую и темную темы',
				createdAt: '15 Мар 2024 10:30',
				startDate: '12.08.25',
				endDate: '19.10.25',
				epicId: '2',
			},
			{
				id: '2',
				title: 'Паспорт',
				isDone: false,
				type: 'task',
				description:
					'Подготовить паспорт проекта с описанием архитектуры и используемых технологий',
				priority: 'Важно',
				startDate: '12.08.25',
				endDate: '19.10.25',
				createdAt: '18 Мар 2024 14:45',
				epicId: '1',
			},
			{
				id: '3',
				title: 'Аналитика',
				isDone: false,
				type: 'task',
				description:
					'Провести анализ конкурентов и составить отчет по ключевым метрикам',
				priority: 'Средне',
				startDate: '10.05.25',
				endDate: '15.05.25',
				createdAt: '20 Мар 2024 09:15',
				epicId: '1',
			},
		],
	},
	{
		id: 'to-do',
		title: 'Новые задачи',
		color: '#EF312480',
		cards: [
			{
				id: '4',
				title: 'Документирование',
				description:
					'Провести документирование',
				isDone: false,
				type: 'task',
				priority: 'Средне',
				createdAt: '22 Мар 2024 16:20',
			},
		],
	},
	{
		id: 'in-work',
		title: 'В работе',
		color: '#FA931980',
		cards: [
			{
				id: '5',
				title: 'Финальные правки',
				isDone: false,
				type: 'task',
				description: 'Исправить критические баги перед релизом версии 1.0.0',
				startDate: '16.10.25',
				endDate: '17.11.25',
				createdAt: '25 Мар 2024 11:05',
				epicId: '2',
			},
		],
	},
	{
		id: 'done',
		title: 'Готово',
		color: '#A8F00080',
		cards: [
			{
				id: '6',
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
		],
	},
]

export const INITIAL_EPICS: IEpic[] = [
    {
        id: '1',
        title: 'Регистрация',
        description: 'Описание эпика 1',
        startDate: '10.01.25',
        endDate: '10.04.25',
        color: '#FA9319',
    },
    {
        id: '2',
        title: 'Вход в систему',
        description: 'Описание эпика 2',
        startDate: '10.01.25',
        endDate: '10.02.25',
        color: '#e84fbb',
    },
];