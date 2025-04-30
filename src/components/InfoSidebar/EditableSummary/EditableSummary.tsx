import { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import styles from './EditableSummary.module.scss';

interface EditableSummaryProps {
    summary: string;
    onSave: (newDescription: string) => void;
}

export const EditableSummary = ({ summary, onSave }: EditableSummaryProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentDescription, setCurrentDescription] = useState(summary);

    const handleSave = () => {
        onSave(currentDescription);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentDescription(summary);
        setIsEditing(false);
    };

    return (
        <div className={styles.tabContent}>
            <div className={styles.descriptionHeader}>
                <span>Редактировать резюме</span>
                {!isEditing && (
                    <Button
                        icon="pi pi-pencil"
                        className={`p-button-rounded p-button-text ${styles.editBtn}`}
                        onClick={() => setIsEditing(true)}
                    />
                )}
            </div>

            {isEditing ? (
                <div className={styles.editDescription}>
                    <InputTextarea
                        value={currentDescription}
                        onChange={(e) => setCurrentDescription(e.target.value)}
                        rows={5}
                        autoResize
                        className={styles.editDescriptionArea}
                    />
                    <div className={styles.editButtons}>
                        <Button
                            label="Сохранить"
                            className={`p-button-sm ${styles.btn}`}
                            onClick={handleSave}
                        />
                        <Button
                            label="Отмена"
                            className={`p-button-sm p-button-text ${styles.btn}`}
                            onClick={handleCancel}
                        />
                    </div>
                </div>
            ) : (
                <p>{currentDescription}</p>
            )}
        </div>
    );
};