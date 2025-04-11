import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ICard} from '../../types/types';
import styles from './BoardCard.module.scss';
import "primeicons/primeicons.css";
import React from "react";

const BoardCard = ({card, onCheckClick}: { card: ICard; onCheckClick?: (id: string, isDone: boolean) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
    });

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onCheckClick?.(card.id, !card.isDone);
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.draggableWrapper}
        >
            <div className={styles.card}>
                <div className={styles.cardName}>
                    <i
                        className={`pi pi-check-circle ${card.isDone ? styles.checkedIcon : ''}`}
                        onClick={handleIconClick}
                        style={{
                            cursor: 'pointer',
                            pointerEvents: 'auto'
                        }}
                    />
                    <h3>{card.title}</h3>
                    {card.priority && (
                        <span className={`priority-badge priority-${card.priority}`}>
                            {card.priority}
                        </span>
                    )}
                </div>
                {card.dates && (
                    <div className="flex align-items-center mt-2">
                        <i className="pi pi-calendar mr-2"></i>
                        <span className="text-sm">{card.dates}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardCard;