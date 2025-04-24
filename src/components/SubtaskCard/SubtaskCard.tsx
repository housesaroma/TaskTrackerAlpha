import styles from './SubtaskCard.module.scss';
import "primeicons/primeicons.css";
import { Calendar } from 'primereact/calendar';
import { useState } from 'react';

interface SubtaskCardProps {
    title: string;
    completed: boolean;
    startDate?: string;
    endDate?: string;
    onToggleComplete: () => void;
    onDateChange: (startDate?: string, endDate?: string) => void;
}

const SubtaskCard = ({ 
    title, 
    completed, 
    startDate, 
    endDate, 
    onToggleComplete,
    onDateChange 
}: SubtaskCardProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState<Date[] | null>(null);

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
                    <h3 className={`${completed ? styles.checkedText : ''}`}>
                        {title}
                    </h3>
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