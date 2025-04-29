import styles from './subtaskSection.module.scss'
import SubtaskCard from '../SubtaskCard/SubtaskCard'
import { ISubtask } from '../../types/types'

interface SubtaskSectionProps {
    subtasks: ISubtask[]
    onAddSubtask: () => void
    onSubtaskToggle: (id: string) => void
    onSubtaskUpdate: (subtask: ISubtask) => void
}

function SubtaskSection({ subtasks, onAddSubtask, onSubtaskToggle, onSubtaskUpdate }: SubtaskSectionProps) {
    const getProgress = () => {
        const total = subtasks.length;
        const completed = subtasks.filter(task => task.isDone).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return { completed, total, percentage };
    }

    const getDateRange = () => {
        if (subtasks.length === 0) return null

        const dates = subtasks.flatMap(task => [task.startDate, task.endDate])
            .filter((date): date is string => !!date)
            .map(date => {
                const [day, month, year] = date.split('.').map(Number)
                return new Date(2000 + year, month - 1, day)
            })

        if (dates.length === 0) return null

        const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

        const formatDate = (date: Date) => {
            return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getFullYear() - 2000).toString().padStart(2, '0')}`
        }

        return {
            startDate: formatDate(minDate),
            endDate: formatDate(maxDate)
        }
    }

    const handleAddSubtask = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const formatDate = (date: Date) => {
            return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getFullYear() - 2000).toString().padStart(2, '0')}`
        };

        const newSubtask: ISubtask = {
            id: Date.now().toString(),
            title: 'Новая подзадача',
            isDone: false,
            startDate: formatDate(today),
            endDate: formatDate(nextWeek)
        };

        onAddSubtask();
        onSubtaskUpdate(newSubtask);
    };

    const handleDateChange = (subtaskId: string, startDate?: string, endDate?: string) => {
        const subtask = subtasks.find(task => task.id === subtaskId);
        if (subtask) {
            onSubtaskUpdate({
                ...subtask,
                startDate,
                endDate
            });
        }
    };

    const handleTitleChange = (subtaskId: string, newTitle: string) => {
        const subtask = subtasks.find(task => task.id === subtaskId);
        if (subtask) {
            onSubtaskUpdate({
                ...subtask,
                title: newTitle
            });
        }
    };

    const progress = getProgress();
    const dateRange = getDateRange();

    return (
        <div className={styles.subtaskSection}>
            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill} 
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
                <span className={styles.progressText}>{progress.completed} / {progress.total}</span>
            </div>

            {dateRange && (
                <div className={styles.dateRange}>
                    <i className="pi pi-calendar" />
                    <span>{dateRange.startDate} - {dateRange.endDate}</span>
                </div>
            )}

            <div className={styles.subtaskList}>
                {subtasks.map(subtask => (
                    <SubtaskCard
                        key={subtask.id}
                        title={subtask.title}
                        completed={subtask.isDone}
                        startDate={subtask.startDate}
                        endDate={subtask.endDate}
                        onToggleComplete={() => onSubtaskToggle(subtask.id)}
                        onDateChange={(startDate, endDate) => handleDateChange(subtask.id, startDate, endDate)}
                        onTitleChange={(newTitle) => handleTitleChange(subtask.id, newTitle)}
                    />
                ))}
            </div>

            <button 
                className={styles.addSubtaskButton}
                onClick={handleAddSubtask}
            >
                <i className="pi pi-plus-circle" />
                <span>Добавить подзадачу</span>
            </button>
        </div>
    )
}

export default SubtaskSection 