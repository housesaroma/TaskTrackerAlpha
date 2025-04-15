import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { IColumn } from '../../types/types';
import styles from './Column.module.scss';
import BoardCard from "../BoardCard/BoardCard";
import { ColumnMenu } from './ColumnMenu';
import { EditableTitle } from './EditableTitle';

interface ColumnProps {
    column: IColumn;
    onCheckClick?: (id: string, isDone: boolean) => void;
    onRenameColumn: (id: string, newTitle: string) => void;
    onChangeColor: (id: string, newColor: string) => void;
    onDeleteColumn: (id: string) => void;
}

export const Column = ({
                           column,
                           onCheckClick,
                           onRenameColumn,
                           onChangeColor,
                           onDeleteColumn
                       }: ColumnProps) => {
    const { setNodeRef } = useDroppable({ id: column.id });

    return (
        <div
            ref={setNodeRef}
            className={styles.column}
            style={{ backgroundColor: column.color }}
        >
            <div className={styles.columnTitleWrapper}>
                <EditableTitle
                    title={column.title}
                    onSave={(newTitle) => onRenameColumn(column.id, newTitle)}
                    className={styles.columnTitle}
                />

                <ColumnMenu
                    columnColor={column.color}
                    onRename={() => onRenameColumn(column.id, column.title)}
                    onColorChange={(color) => onChangeColor(column.id, color)}
                    onDelete={() => onDeleteColumn(column.id)}
                />
            </div>

            <SortableContext
                items={column.cards.map(card => card.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={styles.cardsList}>
                    {column.cards.length > 0 ? (
                        column.cards.map(card => (
                            <BoardCard
                                key={card.id}
                                card={card}
                                onCheckClick={onCheckClick}
                            />
                        ))
                    ) : (
                        <div className={styles.emptyColumn}>
                            <p className={styles.emptyColumnText}>Перетащите задачи сюда</p>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};