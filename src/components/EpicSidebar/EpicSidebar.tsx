import { Sidebar } from 'primereact/sidebar';
import { Calendar } from 'primereact/calendar';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import styles from './EpicSidebar.module.scss';
import { useState, useEffect, useRef } from "react";
import { EditableDescription } from "../InfoSidebar/EditableDescription/EditableDescription.tsx";
import { EditableSummary } from "../InfoSidebar/EditableSummary/EditableSummary.tsx";
import "primeicons/primeicons.css";

interface EpicSidebarProps {
    epic: {
        id: string;
        title: string;
        description?: string;
        summary?: string;
        startDate?: string;
        endDate?: string;
        color?: string;
        createdAt?: string;
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
    const [description, setDescription] = useState(epic.description || '');
    const [summary, setSummary] = useState(epic.summary || '');
    const [color, setColor] = useState(epic.color || '#e3e3e3');
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(epic.title);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Добавляем useEffect для синхронизации состояния
    useEffect(() => {
        setDescription(epic.description || '');
        setSummary(epic.summary || '');
        setColor(epic.color || '#e3e3e3');
        setNewTitle(epic.title);

        if (epic.startDate && epic.endDate) {
            const parseDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split('.').map(Number);
                return new Date(2000 + year, month - 1, day);
            };
            setDateRange([parseDate(epic.startDate), parseDate(epic.endDate)]);
        } else {
            setDateRange(null);
        }
    }, [epic]);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleTitleClick = () => {
        setIsEditingTitle(true);
        setNewTitle(epic.title);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        if (newTitle.trim() && newTitle !== epic.title) {
            onUpdate({ title: newTitle });
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    };

    const handleDescriptionSave = (newDescription: string) => {
        setDescription(newDescription);
        onUpdate({ description: newDescription });
    };

    const handleSummarySave = (newSummary: string) => {
        setSummary(newSummary);
        onUpdate({ summary: newSummary });
    };

    const handleColorChange = (e: ColorPickerChangeEvent) => {
        const newColor = e.value as string;
        setColor(newColor);
        onUpdate({ 
            color: newColor,
            title: newTitle,
            description,
            summary,
            startDate: epic.startDate,
            endDate: epic.endDate
        });
    };

    const handleDateChange = (e: { value: any }) => {
        const dates = e.value as Date[];
        setDateRange(dates);
        
        if (dates && dates.length === 2) {
            const formatDate = (date: Date) => {
                return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getFullYear() - 2000).toString().padStart(2, '0')}`;
            };
    
            const newStartDate = formatDate(dates[0]);
            const newEndDate = formatDate(dates[1]);
            onUpdate({ 
                startDate: newStartDate, 
                endDate: newEndDate 
            });
        } else {
            onUpdate({ 
                startDate: '', 
                endDate: '' 
            });
        }
    };

    const formatDisplayDate = () => {
        if (epic.startDate && epic.endDate) return `${epic.startDate} - ${epic.endDate}`;
        if (epic.startDate) return epic.startDate;
        if (epic.endDate) return epic.endDate;
        return 'Выберите даты';
    };

    return (
        <Sidebar
            visible={visible}
            position="right"
            onHide={onHide}
            className={styles.sidebar}
        >
            <div className={styles.sidebarContent}>
                {isEditingTitle ? (
                    <InputText
                        value={newTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        ref={titleInputRef}
                        className={styles.titleInput}
                    />
                ) : (
                    <h3 className={styles.name} onClick={handleTitleClick}>
                        {epic.title} <span style={{ fontSize: '0.9em' }}>#{epic.id}</span>
                    </h3>
                )}

                <div className={styles.tabContent}>
                    <EditableSummary
                        summary={summary}
                        onSave={handleSummarySave}
                    />

                    <EditableDescription
                        description={description}
                        onSave={handleDescriptionSave}
                    />

                    <div className={styles.dateSection}>
                        {epic.createdAt && (
                            <div className={styles.createdAt}>
                                <i className="pi pi-clock" />
                                <span>Создано: {epic.createdAt}</span>
                            </div>
                        )}
                        <div
                            className={styles.dates}
                            onClick={() => setShowCalendar(true)}
                        >
                            <i className="pi pi-calendar" />
                            <span>{formatDisplayDate()}</span>
                        </div>
                        {showCalendar && (
                            <div className={styles.calendarOverlay} onClick={() => setShowCalendar(false)}>
                                <div className={styles.calendar} onClick={e => e.stopPropagation()}>
                                    <Calendar
                                        value={dateRange}
                                        onChange={handleDateChange}
                                        selectionMode="range"
                                        readOnlyInput
                                        inline
                                        dateFormat="dd.mm.yy"
                                        showButtonBar
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.colorSection}>
                        <h3>Цвет</h3>
                        <ColorPicker
                            value={color}
                            onChange={handleColorChange}
                            className={styles.colorPicker}
                        />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};