import React, {useCallback, useEffect, useRef, useState} from "react";
import {ICard, IDefect, ITask} from "../types/types.ts";

export const useColumn = (
    column: { id: string; title: string },
    callbacks: {
        onRenameColumn: (id: string, newTitle: string) => void;
        onAddCard: (columnId: string, card: ICard) => void;
    }
) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(column.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleRenameClick = useCallback(() => setIsEditing(true), []);

    const handleTitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewTitle(e.target.value);
        },
        []
    );

    const handleMenuAction = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
    }, []);

    const handleTitleBlur = useCallback(() => {
        if (newTitle.trim() && newTitle !== column.title) {
            callbacks.onRenameColumn(column.id, newTitle);
        } else {
            setNewTitle(column.title);
        }
        setIsEditing(false);
    }, [newTitle, column.title, column.id, callbacks]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleTitleBlur();
            }
        },
        [handleTitleBlur]
    );

    const createNewCard = useCallback(
        (type: "task" | "defect"): ICard => {
            const baseCard = {
                id: `${type}-${Date.now()}`,
                title: type === "task" ? "Новая задача" : "Новый дефект",
                isDone: false,
                type,
            };

            return type === "task" ? (baseCard as ITask) : (baseCard as IDefect);
        },
        []
    );

    const handleAddCard = useCallback(
        (type: "task" | "defect") => {
            const newCard = createNewCard(type);
            callbacks.onAddCard(column.id, newCard);
        },
        [column.id, callbacks, createNewCard]
    );

    return {
        isEditing,
        newTitle,
        inputRef,
        handleRenameClick,
        handleTitleChange,
        handleTitleBlur,
        handleKeyDown,
        handleAddCard,
        handleMenuAction
    };
};