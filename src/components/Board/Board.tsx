import {closestCenter, DndContext, DragEndEvent, DragOverlay, defaultDropAnimationSideEffects} from '@dnd-kit/core';
import {useState} from 'react';
import Column from '../Column/Column.tsx';
import {IColumn} from '../../types/types.ts';
import styles from './Board.module.scss'
import BoardCard from "../BoardCard/BoardCard.tsx";

const Board = () => {
    const [columns, setColumns] = useState<IColumn[]>([
        {
            id: 'artifacts',
            title: 'Артефакты',
            color: '#00E8F080',
            cards: [
                {id: '1', title: 'Дизайн'},
                {id: '2', title: 'Паспорт'},
                {id: '3', title: 'Аналитика'}
            ]
        },
        {
            id: 'new-tasks',
            title: 'Новые задачи',
            color: '#EF312480',
            cards: []
        },
        {
            id: 'in-work',
            title: 'В работе',
            color: '#FA931980',
            cards: [
                {id: '4', title: 'Паспорт'},
                {id: '5', title: 'Аналитика'}
            ]
        },
        {
            id: 'done',
            title: 'Готово',
            color: '#A8F0004D',
            cards: [
                {id: '6', title: 'Дизайн'},
            ]
        },
    ]);

    const [activeCard, setActiveCard] = useState<{id: string, title: string} | null>(null);

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

            if (newColumns[overColumnIndex].cards.some(card => card.id === over.id)) {
                const overCardIndex = newColumns[overColumnIndex].cards.findIndex(
                    card => card.id === over.id
                );
                newColumns[overColumnIndex].cards.splice(overCardIndex, 0, removed);
            } else {
                newColumns[overColumnIndex].cards.push(removed);
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
                            width: '280px' // Ширина карточки
                        }}>
                            <BoardCard card={activeCard} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default Board;