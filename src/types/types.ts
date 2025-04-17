export interface ITask {
    id: string;
    title: string;
    description?: string;
    priority?: number;
    dates?: string;
    isDone?: boolean;
    color: string;
    type: 'task';
}

export interface IDefect {
    id: string;
    title: string;
    description?: string;
    priority?: number;
    dates?: string;
    isDone?: boolean;
    color: string;
    type: 'defect';
}

export type ICard = ITask | IDefect;

export interface IColumn {
    id: string;
    title: string;
    cards: ICard[];
    color: string;
}