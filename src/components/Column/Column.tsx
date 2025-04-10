import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { IColumn } from '../../types/types.ts';
import styles from './Column.module.scss';
import BoardCard from "../BoardCard/BoardCard.tsx";

const Column = ({ column }: { column: IColumn }) => {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div
            ref={setNodeRef}
            className={styles.column}
            style={{ backgroundColor: column.color }}
        >
            <h2>{column.title}</h2>
            <SortableContext
                items={column.cards.map(card => card.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={styles.cardsList}>
                    {column.cards.length > 0 ? (
                        column.cards.map(card => (
                            <BoardCard key={card.id} card={card} />
                        ))
                    ) : (
                        <div className={styles.emptyColumn}>
                            <p>Перетащите задачи сюда</p>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export default Column;