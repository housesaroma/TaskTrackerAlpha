import { Calendar } from 'primereact/calendar';
import { useState, useEffect } from 'react';
import styles from './TaskInformation.module.scss';
import "primeicons/primeicons.css";

interface TaskInfoSectionProps {
    cardId: string;
    startDate?: string;
    endDate?: string;
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
}

export const TaskInfoSection = ({ cardId, startDate, endDate, onDateChange }: TaskInfoSectionProps) => {
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
            setShowCalendar(false);
        }
    };

    return (
        <div className={styles.dateContainer}>
            <div 
                className={styles.dates} 
                onClick={() => setShowCalendar(true)}
            >
                <i style={{color: 'var(--text-color)'}} className="pi pi-calendar" />
                <span>{startDate} - {endDate}</span>
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
    );
}; 