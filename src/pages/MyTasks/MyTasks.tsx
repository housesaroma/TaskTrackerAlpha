import { useState } from 'react'
import TaskPageHeader from '../../components/TaskPageHeader/taskPageHeader.tsx'
import TaskSection from '../../components/TasksSection/taskSection.tsx'
import TaskItem from '../../components/TaskItem/taskItem.tsx'
import styles from './MyTasks.module.scss'
import { INITIAL_COLUMNS } from '../../constants/mock-data.ts'

const TaskPage = () => {
	// Преобразуем данные из INITIAL_COLUMNS в нужный формат
	const [sections, setSections] = useState(() => {
		return [
			{
				title: 'Важные задачи',
				tasks: INITIAL_COLUMNS.flatMap(column =>
					column.cards
						.filter(card => card.priority === 'Важно' && !card.isDone)
						.map(card => ({
							id: card.id,
							title: card.description,
							isDone: card.isDone,
							startDate: card.startDate,
							endDate: card.endDate,
						}))
				),
			},
			{
				title: 'Текущие задачи',
				tasks: INITIAL_COLUMNS.flatMap(column =>
					column.cards
						.filter(card => !card.isDone && card.priority !== 'Важно')
						.map(card => ({
							id: card.id,
							title: card.description,
							isDone: card.isDone,
							startDate: card.startDate,
							endDate: card.endDate,
						}))
				),
			},
			{
				title: 'Выполненные задачи',
				tasks: INITIAL_COLUMNS.flatMap(column =>
					column.cards
						.filter(card => card.isDone)
						.map(card => ({
							id: card.id,
							title: card.description,
							isDone: card.isDone,
							startDate: card.startDate,
							endDate: card.endDate,
						}))
				),
			},
		].filter(section => section.tasks.length > 0) // Убираем пустые секции
	})

	const handleTaskToggle = (taskId: string) => {
		setSections(prevSections => {
			const newSections = JSON.parse(JSON.stringify(prevSections))

			// Находим задачу и меняем ее статус
			for (const section of newSections) {
				const taskIndex = section.tasks.findIndex((t: any) => t.id === taskId)
				if (taskIndex !== -1) {
					const task = section.tasks[taskIndex]
					task.isDone = !task.isDone

					// Удаляем из текущей секции
					section.tasks.splice(taskIndex, 1)

					// Добавляем в соответствующую секцию
					const targetSectionTitle = task.isDone
						? 'Выполненные задачи'
						: task.priority === 'Важно'
						? 'Важные задачи'
						: 'Текущие задачи'

					const targetSection = newSections.find(
						(s: any) => s.title === targetSectionTitle
					)
					if (targetSection) {
						targetSection.tasks.unshift(task)
					}

					break
				}
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
