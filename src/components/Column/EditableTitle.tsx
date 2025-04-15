import { InputText } from 'primereact/inputtext';
import { useState, KeyboardEvent } from 'react';

interface EditableTitleProps {
    title: string;
    onSave: (newTitle: string) => void;
    className?: string;
}

export const EditableTitle = ({ title, onSave, className }: EditableTitleProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const handleSave = () => {
        if (editedTitle.trim()) {
            onSave(editedTitle);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
    };

    return isEditing ? (
        <InputText
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`w-full ${className}`}
        />
    ) : (
        <h2
            className={`m-0 ${className}`}
            onClick={() => setIsEditing(true)}
        >
            {title}
        </h2>
    );
};