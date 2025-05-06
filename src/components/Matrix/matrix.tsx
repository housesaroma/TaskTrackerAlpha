// components/EisenhowerMatrix/EisenhowerMatrix.tsx
import React from 'react'
import { IColumn, ICard} from '../../types/types'
import Quadrant from './quardrant'
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
				<Quadrant quadrantNumber={2} cards={quadrants[2]} />
				{/* Квадрант 1: Важно + Срочно */}
				<Quadrant quadrantNumber={1} cards={quadrants[1]} />
				{/* Квадрант 4: Не важно + Не срочно */}
				<Quadrant quadrantNumber={4} cards={quadrants[4]} />
				{/* Квадрант 3: Не важно + Срочно */}
				<Quadrant quadrantNumber={3} cards={quadrants[3]} />
			</div>
		</div>
	)
}

export default EisenhowerMatrix
