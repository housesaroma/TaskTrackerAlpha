import { useState, useRef, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
import styles from './EpicSidebar.module.scss';

interface EpicSidebarProps {
    epic: {
        id: string;
        title: string;
        description?: string;
        summary?: string;
        startDate?: string;
        endDate?: string;
        color?: string;
    };
    visible: boolean;
    onHide: () => void;
    onUpdate: (updates: {
        title?: string;
        description?: string;
        summary?: string;
        startDate?: string;
        endDate?: string;
        color?: string;
    }) => void;
}

export const EpicSidebar = ({ epic, visible, onHide, onUpdate }: EpicSidebarProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(epic.title);
    const [description, setDescription] = useState(epic.description || '');
    const [summary, setSummary] = useState(epic.summary || '');
    const [startDate, setStartDate] = useState<Date | null>(epic.startDate ? new Date(epic.startDate) : null);
    const [endDate, setEndDate] = useState<Date | null>(epic.endDate ? new Date(epic.endDate) : null);
    const [color, setColor] = useState(epic.color || '#e3e3e3');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setNewTitle(epic.title);
        setDescription(epic.description || '');
        setSummary(epic.summary || '');
        setStartDate(epic.startDate ? new Date(epic.startDate) : null);
        setEndDate(epic.endDate ? new Date(epic.endDate) : null);
        setColor(epic.color || '#e3e3e3');
    }, [epic]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleTitleClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        if (newTitle.trim() && newTitle !== epic.title) {
            onUpdate({ title: newTitle });
        } else {
            setNewTitle(epic.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        onUpdate({ description: e.target.value });
    };

    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSummary(e.target.value);
        onUpdate({ summary: e.target.value });
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        onUpdate({ startDate: date?.toISOString() });
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        onUpdate({ endDate: date?.toISOString() });
    };

    const handleColorChange = (e: ColorPickerChangeEvent) => {
        const newColor = e.value as string;
        setColor(newColor);
        onUpdate({ color: newColor });
    };

    return (
        <Sidebar
            visible={visible}
            position="right"
            onHide={onHide}
            className={styles.epicSidebar}
        >
            <div className={styles.sidebarContent}>
                <div className={styles.sidebarHeader}>
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
                        <h2 onClick={handleTitleClick} className={styles.sidebarTitle}>
                            {epic.title}
                        </h2>
                    )}
                </div>

                <div className={styles.sidebarSection}>
                    <h3>Резюме</h3>
                    <InputTextarea
                        value={summary}
                        onChange={handleSummaryChange}
                        rows={3}
                        className={styles.textarea}
                        placeholder="Введите резюме эпика"
                    />
                </div>

                <div className={styles.sidebarSection}>
                    <h3>Описание</h3>
                    <InputTextarea
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={5}
                        className={styles.textarea}
                        placeholder="Введите описание эпика"
                    />
                </div>

                <div className={styles.sidebarSection}>
                    <h3>Даты</h3>
                    <div className={styles.dateInputs}>
                        <div className={styles.dateInput}>
                            <label>Начало</label>
                            <Calendar
                                value={startDate}
                                onChange={(e) => handleStartDateChange(e.value as Date | null)}
                                dateFormat="dd.mm.yy"
                                showIcon
                            />
                        </div>
                        <div className={styles.dateInput}>
                            <label>Окончание</label>
                            <Calendar
                                value={endDate}
                                onChange={(e) => handleEndDateChange(e.value as Date | null)}
                                dateFormat="dd.mm.yy"
                                showIcon
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.sidebarSection}>
                    <h3>Цвет</h3>
                    <ColorPicker
                        value={color}
                        onChange={handleColorChange}
                        className={styles.colorPicker}
                    />
                </div>
            </div>
        </Sidebar>
    );
}; 