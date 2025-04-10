export interface ICard {
    id: string;
    title: string;
    description?: string;
    priority?: number;
    dates?: string;
}

export interface IColumn {
    id: string;
    title: string;
    cards: ICard[];
    color?: string;
}