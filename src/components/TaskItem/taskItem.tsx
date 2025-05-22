import styles from './taskItem.module.scss'
import { classNames } from 'primereact/utils'

interface TaskItemProps {
	id: string
	title?: string
	description?: string
	isDone?: boolean
	startDate?: string
	endDate?: string
	priority?: string,
	onToggleComplete?: (id: string) => void
}

function TaskItem({
	id,
	title,
	description,
	isDone,
	startDate,
	endDate,
	priority,
	onToggleComplete,
}: TaskItemProps) {
	const getDueDateStatus = () => {
		if (isDone) return 'completed'
		if (!endDate) return 'normal'

		const parseDate = (dateStr: string) => {
			const [day, month, year] = dateStr.split('.').map(Number)
			return new Date(2000 + year, month - 1, day)
		}

		const end = parseDate(endDate)
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const timeDiff = end.getTime() - today.getTime()
		const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

		if (daysDiff < 0) return 'overdue'
		if (daysDiff === 1) return 'warning'
		return 'normal'
	}

	const formatDisplayDate = () => {
		if (!startDate || !endDate) return ''

		const formatPart = (dateStr: string) => {
			const [day, month] = dateStr.split('.')
			const months = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			]
			return `${day} ${months[parseInt(month) - 1]}`
		}

		return `${formatPart(startDate)} - ${formatPart(endDate)}`
	}

	const status = getDueDateStatus()
	const displayDate = formatDisplayDate()

	const tooltipContent = `${
		description ? `Описание: ${description}` : 'Нет описания'
	}
    Сроки: ${startDate && endDate ? `${startDate} - ${endDate}` : 'Не указаны'}`

	const handleClick = () => {
		if (onToggleComplete) {
			onToggleComplete(id)
		}
	}

	return (
		<div
			className={`task-item ${styles.taskItem}`}
			data-pr-tooltip={tooltipContent}
		>
			<div
				className={classNames(styles.taskCheckbox, {
					[styles.completed]: isDone,
					[styles.important]: priority === 'Важно' && !isDone,
				})}
				onClick={handleClick}
			>
				{isDone && (
					<i
						className='pi pi-check-circle'
						style={{ color: 'var(--surface-900)', fontSize: '1.5rem' }}
					/>
				)}
			</div>
			<div className={styles.taskContent}>
				<span
					className={classNames(styles.taskTitle, {
						[styles.completed]: isDone,
						[styles.important]: priority === 'Важно' && !isDone,
					})}
				>
					{title}
				</span>

				{displayDate && (
					<span className={classNames(styles.taskDueDate, styles[status])}>
						<i className='pi pi-calendar' style={{ marginRight: '0.3rem' }} />
						{displayDate}
					</span>
				)}
			</div>
		</div>
	)
}

export default TaskItem
