import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";
import {ICard, IColumn} from "../../types/types";
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
}

export const Column = ({
                           column,
                           onCheckClick,
                           onChangeColor,
                           onRenameColumn,
                           onDeleteColumn,
                           onDuplicateColumn,
                           onAddCard,
                       }: ColumnProps) => {
    const {setNodeRef} = useDroppable({id: column.id});

    const {
        isEditing,
        newTitle,
        inputRef,
        handleRenameClick,
        handleTitleChange,
        handleTitleBlur,
        handleKeyDown,
        handleAddCard,
    } = useColumn(column, {onRenameColumn, onAddCard});
    return (
        <div
            ref={setNodeRef}
            className={styles.column}
            style={{backgroundColor: column.color}}
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
                    <h2 className={styles.columnTitle}>{column.title}</h2>
                )}
                <ColumnMenu columnColor={column.color} onColorChange={(color) => onChangeColor(column.id, color)}
                            onRename={handleRenameClick}
                            onDelete={() => onDeleteColumn(column.id)}
                            onDuplicate={() => onDuplicateColumn(column.id)}></ColumnMenu>
            </div>

            {
                column.id !== 'done' ? <SelectTaskType onAdd={handleAddCard}></SelectTaskType> : ''
            }


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

export default Column;