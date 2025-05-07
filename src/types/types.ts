export interface ISubtask {
    id: string;
    title: string;
    isDone: boolean;
    startDate?: string;
    endDate?: string;
}

export interface IEpic {
    id: string;
    title: string;
    description?: string;
    summary?: string;
    startDate?: string;
    endDate?: string;
    color?: string;
}

export interface IUser {
    id: string;
    name: string;
    avatar?: string;
    role?: 'administrator' | 'user';
}

export interface ITaskAction {
    id: string;
    date: string;
    action: string;
    user: IUser;
}

export interface ITask {
    id: string;
    title: string;
    description?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    startDate?: string;
    endDate?: string;
    isDone?: boolean;
    color?: string;
    type: 'task';
    epicId?: string | null;
    subtasks?: ISubtask[];
    createdAt?: string;
    createdBy?: IUser;
    assignedTo?: IUser;
    responsibleUser?: IUser;
    viewers?: IUser[];
    linkedTasks?: string[];
    actions?: ITaskAction[];
    location?: {
        board: string;
        section: string;
    };
}

export interface IDefect {
    id: string;
    title: string;
    description?: string;
    summary?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    startDate?: string;
    endDate?: string;
    isDone?: boolean;
    color: string;
    type: 'defect';
    epicId?: string | null;
    subtasks?: ISubtask[];
    createdAt?: string;
    createdBy?: IUser;
    assignedTo?: IUser;
    responsibleUser?: IUser;
    viewers?: IUser[];
    linkedTasks?: string[];
    actions?: ITaskAction[];
    location?: {
        board: string;
        section: string;
    };
}

export type ICard = ITask | IDefect;

export interface IColumn {
    id: string;
    title: string;
    cards: ICard[];
    color: string;
}