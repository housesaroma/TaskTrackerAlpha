import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {ICard, IColumn, ISubtask} from "../../types/types";
import styles from "./Column.module.scss";
import BoardCard from "../BoardCard/BoardCard";
import {ColumnMenu} from "./ColumnMenu";
import {InputText} from "primereact/inputtext";
import {SelectTaskType} from "../SelectTaskType/SelectTaskType";
import {useColumn} from "../../hooks/useColumn.ts";

interface ColumnProps {
    column: IColumn;
    onCheckClick?: (id: string, isDone: boolean) => void;
    onRenameColumn: (id: string, newTitle: string) => void;
    onChangeColor: (id: string, newColor: string) => void;
    onDeleteColumn: (id: string) => void;
    onDuplicateColumn: (id: string) => void;
    onAddCard: (columnId: string, card: ICard) => void;
    onRenameCard: (id: string, newTitle: string) => void;
    onChangeCardColor: (id: string, newColor: string) => void;
    onDeleteCard: (id: string) => void;
    onDuplicateCard: (id: string) => void;
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
    onSubtasksChange: (cardId: string, subtasks: ISubtask[]) => void;
    getNextId: () => number;
}

export const Column = ({
                           column,
                           onCheckClick,
                           onChangeColor,
                           onRenameColumn,
                           onDeleteColumn,
                           onDuplicateColumn,
                           onAddCard,
                           onRenameCard,
                           onChangeCardColor,
                           onDeleteCard,
                           onDuplicateCard,
                           onDateChange,
                           onPriorityChange,
                           onSubtasksChange,
                           getNextId
                       }: ColumnProps) => {
    const {setNodeRef} = useDroppable({id: column.id});

    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
    });

    const {
        isEditing,
        newTitle,
        inputRef,
        handleRenameClick,
        handleTitleChange,
        handleTitleBlur,
        handleKeyDown,
        handleAddCard: handleAddCardLocal,
        handleMenuAction
    } = useColumn(column, {onRenameColumn, onAddCard}, getNextId);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                setSortableRef(node);
            }}
            className={styles.column}
            style={{...style, backgroundColor: column.color}}
            {...attributes}
        >
            <div className={styles.columnTitleWrapper}>
                {isEditing ? (
                    <InputText
                        value={newTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        className={styles.titleInput}
                    />
                ) : (
                    <h2 className={styles.columnTitle} {...listeners}>{column.title}</h2>
                )}
                <div style={{pointerEvents: 'auto'}} onClick={handleMenuAction}>
                    <ColumnMenu
                        columnColor={column.color}
                        onColorChange={(color) => onChangeColor(column.id, color)}
                        onRename={handleRenameClick}
                        onDelete={() => onDeleteColumn(column.id)}
                        onDuplicate={() => onDuplicateColumn(column.id)}
                    /></div>
            </div>

            {column.id !== 'done' && <SelectTaskType onAdd={handleAddCardLocal}/>}

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
                                onRenameCard={onRenameCard}
                                onChangeColor={onChangeCardColor}
                                onDeleteCard={onDeleteCard}
                                onDuplicateCard={onDuplicateCard}
                                onDateChange={onDateChange}
                                onPriorityChange={onPriorityChange}
                                onSubtasksChange={onSubtasksChange}
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

export default Column;