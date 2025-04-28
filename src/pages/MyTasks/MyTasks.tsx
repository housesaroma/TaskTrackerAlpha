import { useState } from 'react'
import TaskPageHeader from '../../components/TaskPageHeader/taskPageHeader.tsx'
import TaskSection from '../../components/TasksSection/taskSection.tsx'
import TaskItem from '../../components/TaskItem/taskItem.tsx'
import styles from './MyTasks.module.scss'
import { ITask } from '../../types/types.ts'

type TaskItemData = Pick<ITask, 'id' | 'title' | 'startDate' | 'endDate' | 'isDone'>

interface ITaskSectionData {
	title: string
	tasks: TaskItemData[]
}

const TaskPage = () => {
	const [sections, setSections] = useState<ITaskSectionData[]>([
		{
			title: 'Важные задачи',
			tasks: [
				{
					id: '1',
					title: 'Задача',
					isDone: false,
					startDate: '17.04.23',
					endDate: '21.04.23',
				},
			],
		},
		{
			title: 'Текущие задачи',
			tasks: [
				{
					id: '2',
					title: 'Сделать дизайн сайта (подробнее в комментариях макета)',
					isDone: false,
					startDate: '30.03.23',
					endDate: '04.04.23',
				},
				{
					id: '3',
					title: 'Сделать тест 1',
					isDone: false,
					startDate: '23.04.25',
					endDate: '30.04.25',
				},
				{
					id: '4',
					title: 'Сделать тест 2',
					isDone: false,
					startDate: '20.04.25',
					endDate: '24.04.25',
				},
			],
		},
		{
			title: 'Выполненные задачи',
			tasks: [
				{
					id: '5',
					title: 'Создать UI-кит и шаблон сайта с референсами',
					isDone: true,
					startDate: '10.11.22',
					endDate: '15.11.22',
				},
				{
					id: '6',
					title: 'Создание рабочего прототипа в фигме',
					isDone: true,
					startDate: '01.10.22',
					endDate: '14.10.22',
				},
			],
		},
	])
	const handleTaskToggle = (taskId: string) => {
		setSections(prevSections => {
			// Создаем глубокую копию разделов
			const newSections = JSON.parse(
				JSON.stringify(prevSections)
			) as ITaskSectionData[]

			// Находим задачу и ее текущий раздел
			let taskToMove: TaskItemData | null = null
			let sourceSectionIndex = -1
			let taskIndex = -1

			for (let i = 0; i < newSections.length; i++) {
				const idx = newSections[i].tasks.findIndex(t => t.id === taskId)
				if (idx !== -1) {
					taskToMove = { ...newSections[i].tasks[idx] }
					sourceSectionIndex = i
					taskIndex = idx
					break
				}
			}

			if (!taskToMove) return prevSections

			// Инвертируем статус задачи
			taskToMove.isDone = !taskToMove.isDone

			// Удаляем задачу из текущего раздела
			newSections[sourceSectionIndex].tasks.splice(taskIndex, 1)

			// Определяем целевой раздел
			const targetSectionTitle = taskToMove.isDone
				? 'Выполненные задачи'
				: 'Текущие задачи'

			const targetSectionIndex = newSections.findIndex(
				s => s.title === targetSectionTitle
			)

			// Добавляем задачу в начало целевого раздела
			if (targetSectionIndex !== -1) {
				newSections[targetSectionIndex].tasks.unshift(taskToMove)
			}

			return newSections
		})
	}

	return (
		<div className={styles.taskPage}>
			<TaskPageHeader />

			<div className={styles.taskContainer}>
				{sections.map(section => (
					<TaskSection key={section.title} title={section.title}>
						{section.tasks.map(task => (
							<TaskItem
								key={task.id}
								id={task.id}
								title={task.title}
								isDone={task.isDone}
								startDate={task.startDate}
								endDate={task.endDate}
								onToggleComplete={handleTaskToggle}
							/>
						))}
					</TaskSection>
				))}
			</div>
		</div>
	)
}

export default TaskPage
