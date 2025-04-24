export interface ISubtask {
    id: string;
    title: string;
    isDone: boolean;
    startDate?: string;
    endDate?: string;
}

export interface ITask {
    id: string;
    title: string;
    description?: string;
    priority?: number;
    dates?: string;
    isDone?: boolean;
    color?: string;
    type: 'task';
    subtasks?: ISubtask[];
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
    subtasks?: ISubtask[];
}

export type ICard = ITask | IDefect;

export interface IColumn {
    id: string;
    title: string;
    cards: ICard[];
    color: string;
}