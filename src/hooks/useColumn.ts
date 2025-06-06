import React, {useCallback, useEffect, useRef, useState} from "react";
import {ICard, IDefect, ITask} from "../types/types.ts";

export const useColumn = (
    column: { id: string; title: string },
    callbacks: {
        onRenameColumn: (id: string, newTitle: string) => void;
        onAddCard: (columnId: string, card: ICard) => void;
    },
    getNextId: () => number
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
            const maxLength = 15; // Максимальная длина текста
            if (e.target.value.length <= maxLength) {
                setNewTitle(e.target.value);
            }
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
            const now = new Date();
            const formattedDate = `${now.getDate()} ${getMonthName(now.getMonth())} ${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            const baseCard = {
                id: `temp-${getNextId()}`,
                title: type === "task" ? "Новая задача" : "Новый дефект",
                description: "",
                priority: 'Средне' as const,
                startDate: formattedDate,
                endDate: formattedDate,
                isDone: false,
                type,
                createdAt: formattedDate,
                color: type === "task" ? "#00E8F080" : "#FF000080"
            };

            return type === "task" ? (baseCard as ITask) : (baseCard as IDefect);
        },
        [getNextId]
    );

    // Helper function to get month name in Russian
    const getMonthName = (month: number): string => {
        const months = [
            'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
            'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
        ];
        return months[month];
    };

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