import { useState, useEffect } from 'react'
import TaskPageHeader from '../../components/TaskPageHeader/taskPageHeader'
import TaskSection from '../../components/TasksSection/taskSection'
import TaskItem from '../../components/TaskItem/taskItem'
import styles from './MyTasks.module.scss'
import { INITIAL_COLUMNS } from '../../constants/mock-data'
import { Tooltip } from 'primereact/tooltip'

const parseDate = (dateStr: string) => {
	const [day, month, year] = dateStr.split('.').map(Number)
	return new Date(2000 + year, month - 1, day)
}

// Функция для получения списка проектов из данных
const getProjectsFromData = (columns: typeof INITIAL_COLUMNS): string[] => {
	const projectIds = new Set<string>()
	columns.forEach(column => {
		column.cards.forEach(card => {
			const projectId = card.id.split('P')[0] // Извлекаем номер проекта из ID
			projectIds.add(`Проект ${projectId}`)
		})
	})
	return ['Все проекты', ...Array.from(projectIds).sort()]
}

const TaskPage = () => {
	const [selectedProject, setSelectedProject] = useState('Все проекты')
	const [searchTerm, setSearchTerm] = useState('')
	const [dateFilterType, setDateFilterType] = useState<
		'created' | 'deadline' | null
	>(null)
	const [allTasks, setAllTasks] = useState<
		Array<{
			id: string
			title?: string
			description?: string
			isDone?: boolean
			startDate?: string
			endDate?: string
			priority?: string
		}>
	>([])

	const projects = getProjectsFromData(INITIAL_COLUMNS)

	// Инициализация всех задач при загрузке
	useEffect(() => {
		const tasks = INITIAL_COLUMNS.flatMap(column =>
			column.cards.map(card => ({
				id: card.id,
				title: card.title,
				description: card.description,
				isDone: card.isDone,
				startDate: card.startDate,
				endDate: card.endDate,
				priority: card.priority,
			}))
		)
		setAllTasks(tasks)
	}, [])

	// Фильтрация задач по выбранному проекту
	const filterByProject = (tasks: typeof allTasks) => {
		if (selectedProject === 'Все проекты') return tasks

		const projectNumber = selectedProject.split(' ')[1]
		return tasks.filter(task => task.id.startsWith(projectNumber))
	}

	// Группировка задач по статусу
	const groupTasks = (tasks: typeof allTasks) => {
		const importantTasks = tasks.filter(
			task => !task.isDone && task.priority === 'Важно'
		)
		const currentTasks = tasks.filter(
			task => !task.isDone && task.priority !== 'Важно'
		)
		const doneTasks = tasks.filter(task => task.isDone)

		const sections = []

		if (importantTasks.length > 0) {
			sections.push({
				title: 'Важные задачи',
				tasks: importantTasks,
			})
		}

		if (currentTasks.length > 0) {
			sections.push({
				title: 'Текущие задачи',
				tasks: currentTasks,
			})
		}

		if (doneTasks.length > 0) {
			sections.push({
				title: 'Выполненные задачи',
				tasks: doneTasks,
			})
		}

		return sections
	}

	// Получение отфильтрованных и сгруппированных задач
	const getFilteredSections = () => {
		let filteredTasks = filterByProject(allTasks)

		// Применяем поиск
		if (searchTerm) {
			filteredTasks = filteredTasks.filter(
				task =>
					task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					task.description?.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		// Применяем сортировку
		filteredTasks = sortTasks(filteredTasks)

		return groupTasks(filteredTasks)
	}

	// Сортировка задач
	const sortTasks = (tasks: typeof allTasks) => {
		if (dateFilterType === 'created') {
			return [...tasks].sort((a, b) => {
				if (!a.startDate && !b.startDate) return 0
				if (!a.startDate) return 1
				if (!b.startDate) return -1

				const dateA = parseDate(a.startDate).getTime()
				const dateB = parseDate(b.startDate).getTime()
				return dateA - dateB
			})
		} else if (dateFilterType === 'deadline') {
			return [...tasks].sort((a, b) => {
				if (!a.endDate && !b.endDate) return 0
				if (!a.endDate) return 1
				if (!b.endDate) return -1

				const dateA = parseDate(a.endDate).getTime()
				const dateB = parseDate(b.endDate).getTime()
				return dateA - dateB
			})
		}
		return tasks
	}

	// Переключение статуса задачи
	const handleTaskToggle = (taskId: string) => {
		setAllTasks(prevTasks =>
			prevTasks.map(task =>
				task.id === taskId ? { ...task, isDone: !task.isDone } : task
			)
		)
	}

	const filteredSections = getFilteredSections()

	return (
		<div className={styles.taskPage}>
			<TaskPageHeader
				onSearchChange={setSearchTerm}
				onDateFilterChange={setDateFilterType}
				onProjectChange={setSelectedProject}
				activeFilter={dateFilterType}
				projects={projects}
				selectedProject={selectedProject}
			/>
			<Tooltip
				target='.task-item'
				position='top'
				content='Test tooltip'
				mouseTrack
				mouseTrackLeft={10}
				showDelay={150}
			/>
			<div className={styles.taskContainer}>
				{filteredSections.length > 0 ? (
					filteredSections.map(section => (
						<TaskSection key={section.title} title={section.title}>
							{section.tasks.map(task => (
								<TaskItem
									key={task.id}
									id={task.id}
									title={task.title}
									description={task.description}
									isDone={task.isDone}
									startDate={task.startDate}
									endDate={task.endDate}
									priority={task.priority}
									onToggleComplete={handleTaskToggle}
								/>
							))}
						</TaskSection>
					))
				) : (
					<div className={styles.noTasks}>
						<i className='pi pi-inbox' style={{ fontSize: '2rem' }} />
						<p>Нет задач для отображения</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default TaskPage
