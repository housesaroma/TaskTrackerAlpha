import {useState} from 'react';
import {DragEndEvent} from '@dnd-kit/core';
import {ICard, IColumn, ISubtask} from '../types/types.ts';
import {INITIAL_COLUMNS} from '../constants/mock-data.ts';

export const useBoard = (getNextId?: () => number) => {
    const [columns, setColumns] = useState<IColumn[]>(INITIAL_COLUMNS);
    const [activeCard, setActiveCard] = useState<ICard | null>(null);
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);

    const handleDragStart = (event: any) => {
        const {active} = event;
        
        // Check if we're dragging a column
        const column = columns.find(col => col.id === active.id);
        if (column) {
            setActiveColumn(column);
            return;
        }

        // Otherwise check for a card
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
        setActiveColumn(null);
        const {active, over} = event;

        if (!over || active.id === over.id) return;

        if (columns.some(col => col.id === active.id)) {
            setColumns(prevColumns => {
                const newColumns = [...prevColumns];
                const activeIndex = newColumns.findIndex(col => col.id === active.id);
                const overIndex = newColumns.findIndex(col => col.id === over.id);

                if (activeIndex === -1 || overIndex === -1) return prevColumns;

                const [removed] = newColumns.splice(activeIndex, 1);
                newColumns.splice(overIndex, 0, removed);

                return newColumns;
            });
            return;
        }

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

    const handleRenameCard = (cardId: string, newTitle: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? {...card, title: newTitle} : card
                )
            }))
        );
    };

    const handleChangeCardColor = (cardId: string, newColor: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? {...card, color: newColor} : card
                )
            }))
        );
    };

    const handleChangeCardDates = (cardId: string, startDate: string, endDate: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? {...card, startDate, endDate} : card
                )
            }))
        );
    };

    const handleDeleteCard = (cardId: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.filter(card => card.id !== cardId)
            }))
        );
    };

    const handleDuplicateCard = (cardId: string) => {
        if (!getNextId) return;
        
        const newId = getNextId();
        const now = new Date();
        const formattedDate = `${now.getDate()} ${getMonthName(now.getMonth())} ${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setColumns(prev => {
            return prev.map(column => {
                const cardToDuplicate = column.cards.find(card => card.id === cardId);
                if (!cardToDuplicate) return column;
    
                const duplicatedCard = {
                    ...cardToDuplicate,
                    id: `${newId}`,
                    title: `${cardToDuplicate.title} (копия)`,
                    createdAt: formattedDate
                };
    
                return {
                    ...column,
                    cards: [...column.cards, duplicatedCard]
                };
            });
        });
    };
    
    // Helper function to get month name in Russian
    const getMonthName = (month: number): string => {
        const months = [
            'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
            'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
        ];
        return months[month];
    };

    const handlePriorityChange = (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => {
        setColumns(prevColumns =>
            prevColumns.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? { ...card, priority } : card
                )
            }))
        );
    };

    const handleSubtasksChange = (cardId: string, subtasks: ISubtask[]) => {
        setColumns(prev => {
            const newColumns = [...prev];
            
            for (let i = 0; i < newColumns.length; i++) {
                const cardIndex = newColumns[i].cards.findIndex(c => c.id === cardId);
                if (cardIndex !== -1) {
                    newColumns[i].cards[cardIndex] = {
                        ...newColumns[i].cards[cardIndex],
                        subtasks
                    };
                    break;
                }
            }
            
            return newColumns;
        });
    };

    return {
        columns,
        activeCard,
        activeColumn,
        handleDragStart,
        handleDragEnd,
        handleCheckClick,
        handleChangeColumnColor,
        handleDeleteColumn,
        handleRenameColumn,
        handleAddColumn,
        handleDuplicateColumn,
        handleAddCard,
        handleRenameCard,
        handleChangeCardColor,
        handleDuplicateCard,
        handleDeleteCard,
        handleChangeCardDates,
        handlePriorityChange,
        handleSubtasksChange
    };
};