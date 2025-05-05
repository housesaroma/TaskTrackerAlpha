// components/EisenhowerMatrix/EisenhowerMatrix.tsx
import React from 'react'
import { IColumn, ICard, ISubtask } from '../../types/types'
import BoardCard from '../../components/BoardCard/BoardCard'
import styles from './matrix.module.scss'
import { INITIAL_COLUMNS } from '../../constants/mock-data'

const mockColumns: IColumn[] = INITIAL_COLUMNS.filter(
	column => column.id === 'to-do' || column.id === 'in-work'
)

const EisenhowerMatrix: React.FC = () => {
	// Собираем все задачи из всех колонок
	const allCards: ICard[] = mockColumns.reduce((acc: ICard[], column) => {
		return [...acc, ...column.cards]
	}, [])

	// Функция для определения квадранта задачи
	const getQuadrant = (card: ICard): number => {
		const isImportant = card.priority === 'Важно'
		const isUrgent =
			card.endDate &&
			new Date(card.endDate.split('.').reverse().join('-')).getTime() -
				Date.now() <
				3 * 24 * 60 * 60 * 1000 //3 дня

		if (isImportant && isUrgent) return 1
		if (isImportant && !isUrgent) return 2
		if (!isImportant && isUrgent) return 3
		return 4
	}

	// Разделяем задачи по квадрантам
	const quadrants: Record<number, ICard[]> = {
		1: [],
		2: [],
		3: [],
		4: [],
	}

	allCards.forEach(card => {
		const quadrant = getQuadrant(card)
		quadrants[quadrant].push(card)
	})

	// Mock handlers
	const handleRenameCard = (cardId: string, newName: string) => {
		console.log('Rename card:', cardId, newName)
	}

	const handleChangeColor = (cardId: string, color: string) => {
		console.log('Change color:', cardId, color)
	}

	const handleDeleteCard = (cardId: string) => {
		console.log('Delete card:', cardId)
	}

	const handleDuplicateCard = (cardId: string) => {
		console.log('Duplicate card:', cardId)
	}

	const handleCheckClick = (id: string, isDone: boolean) => {
		console.log('Check click:', id, isDone)
	}

	const handleSubtasksChange = (cardId: string, subtasks: ISubtask[]) => {
		console.log('Subtasks change:', cardId, subtasks)
	}

	const handleDateChange = (id: string, newDate: string) => {
		console.log('Date change:', id, newDate)
	}

	const handlePriorityChange = (id: string, newPriority: string) => {
		console.log('Priority change:', id, newPriority)
	}

	return (
		<div className={styles['eisenhower-matrix']}>
			<div className={styles['matrix-labels-container']}>
				<div className={styles['importance-label']}>Важно</div>
				<div className={styles['unimportance-label']}>Не важно</div>
				<div className={styles['urgency-label-left']}>Не срочно</div>
				<div className={styles['urgency-label-right']}>Срочно</div>
			</div>

			<div className={styles['matrix-grid']}>
				{/* Квадрант 2: Важно + Не срочно */}
				<div className={`${styles.quadrant} ${styles['quadrant-2']}`}>
					<div className={styles['cards-container']}>
						{quadrants[2].map(card => (
							<BoardCard
								key={card.id}
								card={card}
								onRenameCard={handleRenameCard}
								onChangeColor={handleChangeColor}
								onDeleteCard={handleDeleteCard}
								onDuplicateCard={handleDuplicateCard}
								onCheckClick={handleCheckClick}
								onSubtasksChange={handleSubtasksChange}
								onDateChange={handleDateChange}
								onPriorityChange={handlePriorityChange}
							/>
						))}
					</div>
				</div>

				{/* Квадрант 1: Важно + Срочно */}
				<div className={`${styles.quadrant} ${styles['quadrant-1']}`}>
					<div className={styles['cards-container']}>
						{quadrants[1].map(card => (
							<BoardCard
								key={card.id}
								card={card}
								onRenameCard={handleRenameCard}
								onChangeColor={handleChangeColor}
								onDeleteCard={handleDeleteCard}
								onDuplicateCard={handleDuplicateCard}
								onCheckClick={handleCheckClick}
								onSubtasksChange={handleSubtasksChange}
								onDateChange={handleDateChange}
								onPriorityChange={handlePriorityChange}
							/>
						))}
					</div>
				</div>

				{/* Квадрант 4: Не важно + Не срочно */}
				<div className={`${styles.quadrant} ${styles['quadrant-4']}`}>
					<div className={styles['cards-container']}>
						{quadrants[4].map(card => (
							<BoardCard
								key={card.id}
								card={card}
								onRenameCard={handleRenameCard}
								onChangeColor={handleChangeColor}
								onDeleteCard={handleDeleteCard}
								onDuplicateCard={handleDuplicateCard}
								onCheckClick={handleCheckClick}
								onSubtasksChange={handleSubtasksChange}
								onDateChange={handleDateChange}
								onPriorityChange={handlePriorityChange}
							/>
						))}
					</div>
				</div>

				{/* Квадрант 3: Не важно + Срочно */}
				<div className={`${styles.quadrant} ${styles['quadrant-3']}`}>
					<div className={styles['cards-container']}>
						{quadrants[3].map(card => (
							<BoardCard
								key={card.id}
								card={card}
								onRenameCard={handleRenameCard}
								onChangeColor={handleChangeColor}
								onDeleteCard={handleDeleteCard}
								onDuplicateCard={handleDuplicateCard}
								onCheckClick={handleCheckClick}
								onSubtasksChange={handleSubtasksChange}
								onDateChange={handleDateChange}
								onPriorityChange={handlePriorityChange}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default EisenhowerMatrix
