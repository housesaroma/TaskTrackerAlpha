import { Calendar } from 'primereact/calendar';
import { SelectButton } from 'primereact/selectbutton';
import { useState, useEffect } from 'react';
import styles from './TaskInformation.module.scss';
import "primeicons/primeicons.css";

interface TaskInfoSectionProps {
    cardId: string;
    startDate?: string;
    endDate?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    createdAt?: string;
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
}

const priorityOptions = [
    { label: 'Важно', value: 'Важно' as const },
    { label: 'Средне', value: 'Средне' as const },
    { label: 'Незначительно', value: 'Незначительно' as const }
];

export const TaskInfoSection = ({ cardId, startDate, endDate, priority, createdAt, onDateChange, onPriorityChange }: TaskInfoSectionProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState<Date[] | null>(null);

    useEffect(() => {
        if (startDate && endDate) {
            const parseDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split('.').map(Number);
                return new Date(2000 + year, month - 1, day);
            };
            setDateRange([parseDate(startDate), parseDate(endDate)]);
        }
    }, [startDate, endDate]);

    const handleDateChange = (e: { value: any }) => {
        const dates = e.value as Date[];
        setDateRange(dates);
        
        if (dates && dates.length === 2) {
            const formatDate = (date: Date) => {
                return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getFullYear() - 2000).toString().padStart(2, '0')}`;
            };

            const newStartDate = formatDate(dates[0]);
            const newEndDate = formatDate(dates[1]);
            onDateChange(cardId, newStartDate, newEndDate);
        } else {
            // Если даты не выбраны или очищены, передаем пустые строки
            onDateChange(cardId, '', '');
        }
        setShowCalendar(false);
    };

    return (
        <div className={styles.taskInfoContainer}>
            <div className={styles.dateContainer}>
                {createdAt && (
                    <div className={styles.createdAt}>
                        <i style={{color: 'var(--text-color)'}} className="pi pi-clock" />
                        <span>Создано: {createdAt}</span>
                    </div>
                )}
                <div 
                    className={styles.dates} 
                    onClick={() => setShowCalendar(true)}
                >
                    <i style={{color: 'var(--text-color)'}} className="pi pi-calendar" />
                    <span>{startDate && endDate ? `${startDate} - ${endDate}` : startDate ? startDate : endDate ? endDate : 'Выберите даты'}</span>
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
            
            <div className={styles.priorityContainer}>
                <label>Приоритет</label>
                <SelectButton
                    value={priority}
                    options={priorityOptions}
                    onChange={(e) => onPriorityChange(cardId, e.value)}
                    className={styles.prioritySelect}
                />
            </div>
        </div>
    );
}; 