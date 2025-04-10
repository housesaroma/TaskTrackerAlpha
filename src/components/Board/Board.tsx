import {closestCenter, defaultDropAnimationSideEffects, DndContext, DragEndEvent, DragOverlay} from '@dnd-kit/core';
import {useState} from 'react';
import Column from '../Column/Column.tsx';
import {ICard, IColumn} from '../../types/types.ts';
import styles from './Board.module.scss'
import BoardCard from "../BoardCard/BoardCard.tsx";

const Board = () => {
    const [columns, setColumns] = useState<IColumn[]>([
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
            id: 'new-tasks',
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
            color: '#A8F0004D',
            cards: [
                {id: '6', title: 'Правки по дизайну мобильной версии', isDone: true},
            ]
        },
    ]);

    const [activeCard, setActiveCard] = useState<{ id: string, title: string } | null>(null);

    const handleDragStart = (event: any) => {
        const {active} = event;
        // Находим карточку, которую начали перетаскивать
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

        if (!over) return;
        if (active.id === over.id) return;

        setColumns(prevColumns => {
            const newColumns = [...prevColumns];

            // Находим колонку и индекс карточки, которую перетаскиваем
            const activeColumnIndex = newColumns.findIndex(col =>
                col.cards.some(card => card.id === active.id)
            );

            // Находим колонку, над которой отпустили карточку
            const overColumnIndex = newColumns.findIndex(col =>
                col.id === over.id || col.cards.some(card => card.id === over.id)
            );

            if (activeColumnIndex === -1 || overColumnIndex === -1) return prevColumns;

            const activeCardIndex = newColumns[activeColumnIndex].cards.findIndex(
                card => card.id === active.id
            );

            const [removed] = newColumns[activeColumnIndex].cards.splice(activeCardIndex, 1);

            // Обновляем статус isDone в зависимости от колонки назначения
            const updatedCard = {
                ...removed,
                isDone: newColumns[overColumnIndex].id === 'done'
            };

            // Если карточка перемещается внутри одной колонки
            if (activeColumnIndex === overColumnIndex) {
                const overCardIndex = newColumns[overColumnIndex].cards.findIndex(
                    card => card.id === over.id
                );

                const insertIndex = activeCardIndex < overCardIndex ? overCardIndex : overCardIndex + 1;
                newColumns[overColumnIndex].cards.splice(insertIndex, 0, updatedCard);
            }
            // Если карточка перемещается в другую колонку
            else {
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

            // Находим карточку и ее текущую колонку
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

            // Обновляем карточку
            const updatedCard = { ...cardToUpdate, isDone };

            if (isDone && newColumns[sourceColumnIndex].id !== 'done') {
                // Перемещаем в "Готово"
                newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);
                const doneColumnIndex = newColumns.findIndex(col => col.id === 'done');
                if (doneColumnIndex !== -1) {
                    newColumns[doneColumnIndex].cards.push(updatedCard);
                }
            } else if (!isDone && newColumns[sourceColumnIndex].id === 'done') {
                // Возвращаем из "Готово" (например, в "В работе")
                newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);
                const inWorkColumnIndex = newColumns.findIndex(col => col.id === 'in-work');
                if (inWorkColumnIndex !== -1) {
                    newColumns[inWorkColumnIndex].cards.push(updatedCard);
                }
            } else {
                // Просто обновляем статус
                newColumns[sourceColumnIndex].cards[cardIndex] = updatedCard;
            }

            return newColumns;
        });
    };

    const dropAnimationConfig = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className={styles.board}>
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.columnsContainer}>
                    {columns.map(column => (
                        <Column
                            key={column.id}
                            column={column}
                            onCheckClick={handleCheckClick}
                        />
                    ))}
                </div>

                <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeCard ? (
                        <div style={{
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            opacity: 0.9,
                            zIndex: 1000,
                            width: '280px'
                        }}>
                            <BoardCard
                                card={activeCard}
                                onCheckClick={handleCheckClick}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default Board;