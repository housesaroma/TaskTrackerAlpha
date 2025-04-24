import styles from './taskItem.module.scss'
import { classNames } from 'primereact/utils'

interface TaskItemProps {
	title: string
	completed: boolean
	startDate?: string // формат: 'dd.mm.yy'
	endDate?: string // формат: 'dd.mm.yy'
}

function TaskItem({ title, completed, startDate, endDate }: TaskItemProps) {
	const getDueDateStatus = () => {
		if (completed) return 'completed'
		if (!endDate) return 'normal'

		// Парсим дату из формата dd.mm.yy
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
				'Jan', 'Feb', 'Mar', 'Apr',
				'May', 'Jun', 'Jul', 'Aug',
				'Sep', 'Oct', 'Nov', 'Dec',
			]
			return `${day} ${months[parseInt(month) - 1]}`
		}

		return `${formatPart(startDate)} - ${formatPart(endDate)}`
	}

	const status = getDueDateStatus()
	const displayDate = formatDisplayDate()

	return (
		<div className={styles.taskItem}>
			<div
				className={classNames(styles.taskCheckbox, {
					[styles.completed]: completed,
				})}
			>
				{completed && (
					<i
						className='pi pi-check'
						style={{ fontSize: '0.75rem', color: 'white' }}
					/>
				)}
			</div>
			<div className={styles.taskContent}>
				<span
					className={classNames(styles.taskTitle, {
						[styles.completed]: completed,
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
