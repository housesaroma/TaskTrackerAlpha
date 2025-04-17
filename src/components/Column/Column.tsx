import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {useDroppable} from '@dnd-kit/core';
import {ICard, IColumn, IDefect, ITask} from '../../types/types.ts';
import styles from './Column.module.scss';
import BoardCard from "../BoardCard/BoardCard.tsx";
import {ColumnMenu} from "./ColumnMenu.tsx";
import React, {useEffect, useRef, useState} from "react";
import {InputText} from "primereact/inputtext";
import {SelectTaskType} from "../SelectTaskType/SelectTaskType.tsx";

interface ColumnProps {
    column: IColumn;
    onCheckClick?: (id: string, isDone: boolean) => void;
    onRenameColumn: (id: string, newTitle: string) => void;
    onChangeColor: (id: string, newColor: string) => void;
    onDeleteColumn: (id: string) => void;
    onDuplicateColumn: (id: string) => void;
    onAddCard: (columnId: string, card: ICard) => void;
}

const Column = ({
                    column,
                    onCheckClick,
                    onChangeColor,
                    onRenameColumn,
                    onDeleteColumn,
                    onDuplicateColumn,
                    onAddCard
                }: ColumnProps) => {
    const {setNodeRef} = useDroppable({
        id: column.id,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(column.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleRenameClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        if (newTitle.trim() && newTitle !== column.title) {
            onRenameColumn(column.id, newTitle);
        } else {
            setNewTitle(column.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    };

    const handleAddCard = (type: 'task' | 'defect') => {
        let newCard: ICard;

        if (type === 'task') {
            newCard = {
                id: `task-${Date.now()}`,
                title: 'Новая задача',
                isDone: false,
                type: 'task'
            } as ITask;
        } else {
            newCard = {
                id: `defect-${Date.now()}`,
                title: 'Новый дефект',
                isDone: false,
                type: 'defect'
            } as IDefect;
        }

        onAddCard(column.id, newCard);
    };
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


            <SelectTaskType onAdd={handleAddCard}></SelectTaskType>

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