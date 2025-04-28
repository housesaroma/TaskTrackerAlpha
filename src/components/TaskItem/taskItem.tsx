import styles from './taskItem.module.scss'
import { classNames } from 'primereact/utils'

interface TaskItemProps {
	id: string
	title: string
	isDone?: boolean
	startDate?: string
	endDate?: string
	onToggleComplete?: (id: string) => void
}

function TaskItem({
	id,
	title,
	isDone,
	startDate,
	endDate,
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

	const handleClick = () => {
		if (onToggleComplete) {
			onToggleComplete(id)
		}
	}

	return (
		<div className={styles.taskItem}>
			<div
				className={classNames(styles.taskCheckbox, {
					[styles.completed]: isDone,
				})}
				onClick={handleClick}
			>
				{isDone && (
					<i
						className='pi pi-check'
						style={{ fontSize: '0.75rem', color: 'white' }}
					/>
				)}
			</div>
			<div className={styles.taskContent}>
				<span
					className={classNames(styles.taskTitle, {
						[styles.completed]: isDone,
					})}
				>
					{title}
				</span>
				{displayDate && (
					<span className={classNames(styles.taskDueDate, styles[status])}>
						{displayDate}
					</span>
				)}
			</div>
		</div>
	)
}

export default TaskItem
