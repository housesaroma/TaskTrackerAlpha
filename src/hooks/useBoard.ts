import {useState} from 'react';
import {DragEndEvent} from '@dnd-kit/core';
import {ICard, IColumn} from '../types/types.ts';
import {INITIAL_COLUMNS} from '../constants/mock-data.ts';

export const useBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>(INITIAL_COLUMNS);
    const [activeCard, setActiveCard] = useState<ICard | null>(null);

    const handleDragStart = (event: any) => {
        const {active} = event;
        for (const column of columns) {
            const card = column.cards.find(c => c.id === active.id);
            if (card) {
                setActiveCard(card);
                break;
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null);
        const {active, over} = event;

        if (!over || active.id === over.id) return;

        setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            const activeColumnIndex = newColumns.findIndex(col =>
                col.cards.some(card => card.id === active.id)
            );
            const overColumnIndex = newColumns.findIndex(col =>
                col.id === over.id || col.cards.some(card => card.id === over.id)
            );

            if (activeColumnIndex === -1 || overColumnIndex === -1) return prevColumns;

            const activeCardIndex = newColumns[activeColumnIndex].cards.findIndex(
                card => card.id === active.id
            );

            const [removed] = newColumns[activeColumnIndex].cards.splice(activeCardIndex, 1);
            const updatedCard = {
                ...removed,
                isDone: newColumns[overColumnIndex].id === 'done'
            };

            if (activeColumnIndex === overColumnIndex) {
                const overCardIndex = newColumns[overColumnIndex].cards.findIndex(
                    card => card.id === over.id
                );
                const insertIndex = activeCardIndex < overCardIndex ? overCardIndex : overCardIndex + 1;
                newColumns[overColumnIndex].cards.splice(insertIndex, 0, updatedCard);
            } else {
                if (newColumns[overColumnIndex].cards.some(card => card.id === over.id)) {
                    const overCardIndex = newColumns[overColumnIndex].cards.findIndex(
                        card => card.id === over.id
                    );
                    newColumns[overColumnIndex].cards.splice(overCardIndex, 0, updatedCard);
                } else {
                    newColumns[overColumnIndex].cards.push(updatedCard);
                }
            }

            return newColumns;
        });
    };

    const handleCheckClick = (id: string, isDone: boolean) => {
        setColumns(prev => {
            const newColumns = [...prev];
            let sourceColumnIndex = -1;
            let cardIndex = -1;
            let cardToUpdate: ICard | null = null;

            for (let i = 0; i < newColumns.length; i++) {
                const index = newColumns[i].cards.findIndex(c => c.id === id);
                if (index !== -1) {
                    sourceColumnIndex = i;
                    cardIndex = index;
                    cardToUpdate = newColumns[i].cards[index];
                    break;
                }
            }

            if (!cardToUpdate) return prev;

            const updatedCard = {...cardToUpdate, isDone};

            if (isDone && newColumns[sourceColumnIndex].id !== 'done') {
                newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);
                const doneColumnIndex = newColumns.findIndex(col => col.id === 'done');
                if (doneColumnIndex !== -1) {
                    newColumns[doneColumnIndex].cards.push(updatedCard);
                }
            } else if (!isDone && newColumns[sourceColumnIndex].id === 'done') {
                newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);
                const inWorkColumnIndex = newColumns.findIndex(col => col.id === 'in-work');
                if (inWorkColumnIndex !== -1) {
                    newColumns[inWorkColumnIndex].cards.push(updatedCard);
                }
            } else {
                newColumns[sourceColumnIndex].cards[cardIndex] = updatedCard;
            }

            return newColumns;
        });
    };

    const handleChangeColumnColor = (columnId: string, newColor: string) => {
        setColumns(prev =>
            prev.map(column =>
                column.id === columnId
                    ? {...column, color: newColor}
                    : column
            )
        );
    };

    const handleDeleteColumn = (columnId: string) => {
        setColumns(prev => {
            // Нельзя удалить колонки с фиксированными ID
            if (columnId === 'to-do' || columnId === 'in-work' || columnId === 'done') {
                return prev;
            }

            // Перемещаем все карточки из удаляемой колонки в "To Do"
            // const columns = [...prev];
            // const columnToDeleteIndex = columns.findIndex(c => c.id === columnId);
            //
            // if (columnToDeleteIndex === -1) return prev;
            //
            // const cardsToMove = columns[columnToDeleteIndex].cards;
            // const toDoColumnIndex = columns.findIndex(c => c.id === 'to-do');
            //
            // if (toDoColumnIndex !== -1) {
            //     columns[toDoColumnIndex].cards.push(...cardsToMove);
            // }

            return columns.filter(column => column.id !== columnId);
        });
    };

    const handleRenameColumn = (columnId: string, newTitle: string) => {
        setColumns(prev =>
            prev.map(column =>
                column.id === columnId
                    ? {...column, title: newTitle}
                    : column
            )
        );
    };

    const handleAddColumn = () => {
        const newColumn: IColumn = {
            id: `column-${Date.now()}`, // уникальный ID
            title: 'Новая колонка',
            cards: [],
            color: '#e3e3e380' // прозрачный серый по умолчанию
        };

        setColumns(prev => [...prev, newColumn]);
    };

    const handleDuplicateColumn = (columnId: string) => {
        setColumns(prev => {
            const columnToDuplicate = prev.find(col => col.id === columnId);
            if (!columnToDuplicate || columnId === 'to-do' || columnId === 'in-work' || columnId === 'done') return prev;

            // Создаем глубокую копию колонки и ее карточек
            const duplicatedColumn: IColumn = {
                ...columnToDuplicate,
                id: `column-${Date.now()}`, // новый уникальный ID
                title: `${columnToDuplicate.title} (копия)`,
                cards: columnToDuplicate.cards.map(card => ({
                    ...card,
                    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // новые ID для карточек
                }))
            };

            // Вставляем после оригинальной колонки
            const columnIndex = prev.findIndex(col => col.id === columnId);
            const newColumns = [...prev];
            newColumns.splice(columnIndex + 1, 0, duplicatedColumn);

            return newColumns;
        });
    };

    const handleAddCard = (columnId: string, newCard: ICard) => {
        setColumns(columns.map(column => {
            if (column.id === columnId) {
                return {
                    ...column,
                    cards: [...column.cards, newCard]
                };
            }
            return column;
        }));
    };

    return {
        columns,
        activeCard,
        handleDragStart,
        handleDragEnd,
        handleCheckClick,
        handleChangeColumnColor,
        handleDeleteColumn,
        handleRenameColumn,
        handleAddColumn,
        handleDuplicateColumn,
        handleAddCard
    };
};