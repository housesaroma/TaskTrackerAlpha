import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ICard} from '../../types/types';
import styles from './BoardCard.module.scss';
import "primeicons/primeicons.css";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {InputText} from "primereact/inputtext";
import {BoardCardMenu} from "./BoardCardMenu.tsx";

const BoardCard = ({card, onCheckClick, onRenameCard, onChangeColor, onDeleteCard, onDuplicateCard}: {
    card: ICard;
    onCheckClick?: (id: string, isDone: boolean) => void;
    onRenameCard: (id: string, newTitle: string) => void;
    onChangeColor: (id: string, newColor: string) => void;
    onDeleteCard: (id: string) => void;
    onDuplicateCard: (id: string) => void;
}) => {
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

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(card.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCheckClick?.(card.id, !card.isDone);
    };

    const handleRenameClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        if (newTitle.trim() && newTitle !== card.title) {
            onRenameCard(card.id, newTitle);
        } else {
            setNewTitle(card.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleTitleBlur();
            }
        },
        [handleTitleBlur]
    );

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

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
            className={styles.draggableWrapper}
        >
            <div className={styles.card} style={{backgroundColor: card.color}}>
                <i
                    className={`pi pi-check-circle ${card.isDone ? styles.checkedIcon : ''}`}
                    onClick={handleIconClick}
                    style={{
                        cursor: 'pointer',
                        pointerEvents: 'auto'
                    }}
                />

                {/* Drag handle только для обычного отображения */}
                {!isEditing && (
                    <div className={styles.dragHandle} {...listeners}>
                        <div className={styles.cardName}>
                            <h3 className={`${card.isDone ? styles.checkedText : ''}`}>{card.title}</h3>
                        </div>
                    </div>
                )}

                {/* InputText вне drag handle при редактировании */}
                {isEditing && (
                    <div className={styles.cardName}>
                        <InputText
                            value={newTitle}
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleKeyDown}
                            ref={inputRef}
                            className={styles.titleInput}
                        />
                    </div>
                )}

                {/* Меню - не должно быть частью drag handle */}
                <div style={{pointerEvents: 'auto'}}>
                    <BoardCardMenu
                        cardColor={card.color || '#ffffff'}
                        onColorChange={(color) => onChangeColor(card.id, color)}
                        onRename={handleRenameClick}
                        onDelete={() => onDeleteCard(card.id)}
                        onDuplicate={() => onDuplicateCard(card.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BoardCard;