import {IColumn} from "../types/types.ts";

export const INITIAL_COLUMNS: IColumn[] = [
    {
        id: 'artifacts',
        title: 'Артефакты',
        color: '#00E8F080',
        cards: [
            {id: '1', title: 'Дизайн', isDone: false},
            {id: '2', title: 'Паспорт', isDone: false},
            {id: '3', title: 'Аналитика', isDone: false}
        ]
    },
    {
        id: 'to-do',
        title: 'Новые задачи',
        color: '#EF312480',
        cards: [
            {id: '4', title: 'Документирование', isDone: false},
        ]
    },
    {
        id: 'in-work',
        title: 'В работе',
        color: '#FA931980',
        cards: [
            {id: '5', title: 'Финальные правки', isDone: false},
        ]
    },
    {
        id: 'done',
        title: 'Готово',
        color: '#A8F00080',
        cards: [
            {id: '6', title: 'Правки по дизайну мобильной версии', isDone: true},
        ]
    },
]