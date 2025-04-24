import styles from './SubtaskCard.module.scss';
import "primeicons/primeicons.css";
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { useState, useRef, useEffect } from 'react';

interface SubtaskCardProps {
    title: string;
    completed: boolean;
    startDate?: string;
    endDate?: string;
    onToggleComplete: () => void;
    onDateChange: (startDate?: string, endDate?: string) => void;
    onTitleChange: (newTitle: string) => void;
}

const SubtaskCard = ({ 
    title, 
    completed, 
    startDate, 
    endDate, 
    onToggleComplete,
    onDateChange,
    onTitleChange
}: SubtaskCardProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const parseDateRange = (): Date[] | null => {
        if (!startDate || !endDate) return null;
        
        const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split('.').map(Number);
            return new Date(2000 + year, month - 1, day);
        };

        return [parseDate(startDate), parseDate(endDate)];
    };

    const handleDateChange = (e: { value: any }) => {
        const dates = e.value as Date[];
        setDateRange(dates);
        
        if (dates && dates.length === 2) {
            const formatDate = (date: Date) => {
                return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getFullYear() - 2000).toString().padStart(2, '0')}`;
            };

            onDateChange(formatDate(dates[0]), formatDate(dates[1]));
            setShowCalendar(false);
        }
    };

    const handleTitleClick = () => {
        setIsEditing(true);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        if (editedTitle !== title) {
            onTitleChange(editedTitle);
        }
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    };

    return (
        <div className={styles.card}>
            <i
                className={`pi pi-check-circle ${completed ? styles.checkedIcon : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete();
                }}
                style={{
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                }}
            />

            <div className={styles.cardContent}>
                <div className={styles.cardName}>
                    {isEditing ? (
                        <InputText
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleTitleKeyDown}
                            ref={inputRef}
                            className={styles.titleInput}
                        />
                    ) : (
                        <h3 
                            className={`${completed ? styles.checkedText : ''}`}
                            onClick={handleTitleClick}
                            style={{ cursor: completed ? 'default' : 'pointer' }}
                        >
                            {title}
                        </h3>
                    )}
                </div>
                <div className={styles.dateContainer}>
                    <div 
                        className={styles.dates} 
                        onClick={() => setShowCalendar(true)}
                    >
                        <i className="pi pi-calendar" />
                        <span>{startDate} - {endDate}</span>
                    </div>
                    {showCalendar && (
                        <div className={styles.calendarOverlay} onClick={() => setShowCalendar(false)}>
                            <div className={styles.calendar} onClick={e => e.stopPropagation()}>
                                <Calendar
                                    value={dateRange || parseDateRange()}
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
            </div>
        </div>
    );
};

export default SubtaskCard; 