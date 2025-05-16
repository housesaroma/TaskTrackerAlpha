import React, {useCallback, useEffect, useRef, useState} from "react";
import {ICard} from "../types/types";

export const useCard = (
    card: ICard,
    callbacks: {
        onCheckClick?: (id: string, isDone: boolean) => void;
        onRenameCard?: (id: string, newTitle: string) => void;
        onChangeColor?: (id: string, newColor: string) => void;
        onDeleteCard?: (id: string) => void;
        onDuplicateCard?: (id: string) => void;
    }
) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(card.title);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleCardClick = useCallback(() => {
        setSidebarVisible(true);
    }, []);

    const handleIconClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        callbacks.onCheckClick?.(card.id, !card.isDone);
    }, [card.id, card.isDone, callbacks]);

    const handleRenameClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleTitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const maxLength = 15; // Максимальная длина текста
            if (e.target.value.length <= maxLength) {
                setNewTitle(e.target.value);
            }
        },
        []
    );

    const handleTitleBlur = useCallback(() => {
        if (newTitle.trim() && newTitle !== card.title) {
            callbacks.onRenameCard?.(card.id, newTitle);
        } else {
            setNewTitle(card.title);
        }
        setIsEditing(false);
    }, [newTitle, card.title, card.id, callbacks]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleTitleBlur();
            }
        },
        [handleTitleBlur]
    );

    const handleMenuAction = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
    }, []);

    const handleSidebarHide = useCallback(() => {
        setSidebarVisible(false);
    }, []);

    return {
        isEditing,
        newTitle,
        sidebarVisible,
        inputRef,
        handleCardClick,
        handleIconClick,
        handleRenameClick,
        handleTitleChange,
        handleTitleBlur,
        handleKeyDown,
        handleMenuAction,
        handleSidebarHide,
    };
};