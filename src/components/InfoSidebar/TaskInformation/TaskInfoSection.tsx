import { Calendar } from 'primereact/calendar';
import { SelectButton } from 'primereact/selectbutton';
import {useState, useEffect, useRef} from 'react';
import styles from './TaskInformation.module.scss';
import "primeicons/primeicons.css";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import {host} from '../../../constants/host.ts'
import {boardService} from "../../../services/board.service";

interface TaskInfoSectionProps {
    cardId: string;
    startDate?: string;
    endDate?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    createdAt?: string;
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
    type: 'task' | 'defect';
}

const priorityOptions = [
    { label: 'Важно', value: 'Важно' as const },
    { label: 'Средне', value: 'Средне' as const },
    { label: 'Незначительно', value: 'Незначительно' as const }
];

const priorityToId = {
    'Важно': 1,
    'Средне': 2,
    'Незначительно': 3
};

export const TaskInfoSection = ({
                                    cardId,
                                    startDate,
                                    endDate,
                                    priority,
                                    createdAt,
                                    onDateChange,
                                    onPriorityChange,
                                    type
                                }: TaskInfoSectionProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const toast = useRef<Toast>(null);
    const apiUrl = `${host}`;

    useEffect(() => {
        if (startDate && endDate) {
            const parseDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split('.').map(Number);
                return new Date(2000 + year, month - 1, day);
            };
            setDateRange([parseDate(startDate), parseDate(endDate)]);
        }
    }, [startDate, endDate]);

    const updateTaskOnServer = async (updates: any) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'task' ? 'Tasks' : 'Tasks';

            await axios.put(`${apiUrl}/api/${endpoint}/${cardId}`, updates, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error updating task:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось обновить задачу',
                life: 3000
            });
        }
    };

    const handleDateChange = async (e: { value: any }) => {
        const dates = e.value as Date[];
        setDateRange(dates);

        if (dates && dates.length === 2) {
            const formatDate = (date: Date) => {
                return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getFullYear() - 2000).toString().padStart(2, '0')}`;
            };

            const newStartDate = formatDate(dates[0]);
            const newEndDate = formatDate(dates[1]);

            // Обновляем на сервере
            await updateTaskOnServer({
                deadline: dates[1].toISOString() // Отправляем дату в ISO формате
            });

            // Обновляем локальное состояние
            onDateChange(cardId, newStartDate, newEndDate);
        } else {
            // Если даты не выбраны или очищены
            await updateTaskOnServer({ deadline: null });
            onDateChange(cardId, '', '');
        }
        setShowCalendar(false);
    };

    const handlePriorityChange = async (e: { value: 'Важно' | 'Средне' | 'Незначительно' }) => {
        const newPriority = e.value;
        const priorityId = priorityToId[newPriority].toString();

        // Обновляем на сервере
        boardService.updateTask(cardId, {priorityId: priorityId})

        // Обновляем локальное состояние
        onPriorityChange(cardId, newPriority);
    };

    return (
        <div className={styles.taskInfoContainer}>
            <Toast ref={toast} />
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
                    onChange={handlePriorityChange}
                    className={styles.prioritySelect}
                />
            </div>
        </div>
    );
};