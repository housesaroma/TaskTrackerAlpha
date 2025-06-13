import { useState, useEffect } from 'react'
import TaskPageHeader from '../../components/TaskPageHeader/taskPageHeader'
import TaskSection from '../../components/TasksSection/taskSection'
import TaskItem from '../../components/TaskItem/taskItem'
import styles from './MyTasks.module.scss'
import { Tooltip } from 'primereact/tooltip'
import { filterProjectsService } from '../../services/filterProjects.service'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { ITask } from '../../types/types'

const TaskPage = () => {
	const [selectedProject, setSelectedProject] = useState<number | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [dateFilterType, setDateFilterType] = useState<
		'created' | 'deadline' | null
	>(null)
	const [allTasks, setAllTasks] = useState<ITask[]>([])
	const [projects, setProjects] = useState<{ id: number; title: string }[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Загрузка проектов при монтировании
	useEffect(() => {
		const loadData = async () => {
			try {
				const projectsData = await filterProjectsService.getAllProjects()
				setProjects(
					projectsData.map(p => ({ id: p.projectId, title: p.title }))
				)
				await loadTasks(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

	// Загрузка задач
	const loadTasks = async (projectId: number | null) => {
		setLoading(true)
		try {
			const tasks = await filterProjectsService.getTasksByProject(projectId)
			console.log(tasks)
			setAllTasks(tasks)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
		} finally {
			setLoading(false)
		}
	}

	// Группировка задач по статусу
	const groupTasks = (tasks: typeof allTasks) => {
		const importantTasks = tasks.filter(
			task => !task.isDone && task.priority?.title === 'Важно'
		)
		const currentTasks = tasks.filter(
			task => !task.isDone && task.priority?.title !== 'Важно'
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

	// Фильтрация и сортировка задач
	const getFilteredSections = () => {
		let filteredTasks = [...allTasks]

		// Фильтрация по поисковому запросу
		if (searchTerm) {
			filteredTasks = filteredTasks.filter(
				task =>
					task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					task.description?.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		// Сортировка по дате
		filteredTasks.sort((a, b) => {
			if (dateFilterType === 'created') {
				const dateA = new Date(a.startDate || 0).getTime()
				const dateB = new Date(b.startDate || 0).getTime()
				return dateA - dateB
			} else if (dateFilterType === 'deadline') {
				const dateA = new Date(a.endDate || 0).getTime()
				const dateB = new Date(b.endDate || 0).getTime()
				return dateA - dateB
			}
			return 0
		})

		return groupTasks(filteredTasks)
	}

	// Обработчик изменения проекта
	const handleProjectChange = (projectId: number | null) => {
		setSelectedProject(projectId)
		loadTasks(projectId)
	}

	// Переключение статуса задачи
	const handleTaskToggle = async (taskId: string) => {
		try {
			const taskToUpdate = allTasks.find(task => task.id === taskId)
			if (!taskToUpdate) return
			const newStatus = !taskToUpdate.isDone

			setAllTasks(prevTasks =>
				prevTasks.map(task =>
					task.id === taskId ? { ...task, isDone: newStatus } : task
				)
			)

			await filterProjectsService.updateTask(taskId, {
				isDone: newStatus,
			})
		} catch (err) {

			setAllTasks(prevTasks =>
				prevTasks.map(task =>
					task.id === taskId ? { ...task, isDone: !task.isDone } : task
				)
			)

			console.error('Ошибка при обновлении задачи:', err)
			setError(
				err instanceof Error ? err.message : 'Не удалось обновить задачу'
			)
		}
	}

	const filteredSections = getFilteredSections()

	if (loading && !allTasks.length) {
		return (
			<div className={styles.taskPage}>
				<ProgressSpinner />
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.taskPage}>
				<Message severity='error' text={error} />
			</div>
		)
	}

	return (
		<div className={styles.taskPage}>
			<TaskPageHeader
				onSearchChange={setSearchTerm}
				onDateFilterChange={setDateFilterType}
				onProjectChange={handleProjectChange}
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
									priority={task.priority?.title}
									onToggleComplete={()=>handleTaskToggle(task.id)}
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
