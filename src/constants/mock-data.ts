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
                priority: 'Важно',
                startDate: '12.10',
                endDate: '12.10'
            },
            {
                id: '3',
                title: 'Аналитика',
                isDone: false,
                type: 'task',
                description: 'Провести анализ конкурентов и составить отчет по ключевым метрикам',
                priority: 'Средне',
                startDate: '10.05',     
                endDate: '10.09'    
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
                priority: 'Средне',
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
                startDate: '16.10',
                endDate: '17.10'
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
                priority: 'Средне',
                startDate: '10.01',
                endDate: '10.04'
            },
        ]
    },
];