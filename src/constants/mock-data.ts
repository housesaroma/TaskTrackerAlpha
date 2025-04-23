import {IColumn} from "../types/types.ts";

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
                description: 'Создать макеты основных экранов приложения в Figma, включая светлую и темную темы',
            },
            {
                id: '2',
                title: 'Паспорт',
                isDone: false,
                type: 'task',
                description: 'Подготовить паспорт проекта с описанием архитектуры и используемых технологий',
                priority: 1,
                dates: '2023-10-10/2023-10-12'
            },
            {
                id: '3',
                title: 'Аналитика',
                isDone: false,
                type: 'task',
                description: 'Провести анализ конкурентов и составить отчет по ключевым метрикам',
                priority: 3,
                dates: '2023-10-05/2023-10-09'
            }
        ]
    },
    {
        id: 'to-do',
        title: 'Новые задачи',
        color: '#EF312480',
        cards: [
            {
                id: '4',
                title: 'Документирование',
                isDone: false,
                type: 'task',
                priority: 2,
                dates: '2023-10-18/2023-10-25'
            },
        ]
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
                priority: 1,
                dates: '2023-10-16/2023-10-17'
            },
        ]
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
                description: 'Адаптировать дизайн под мобильные устройства согласно новому гайдлайну',
                priority: 2,
                dates: '2023-10-01/2023-10-04'
            },
        ]
    },
];