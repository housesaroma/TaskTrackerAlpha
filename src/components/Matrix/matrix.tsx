import React from 'react'
import { IColumn, ICard } from '../../types/types'
import Quadrant from './quardrant'
import styles from './matrix.module.scss'
import { INITIAL_COLUMNS } from '../../constants/mock-data'

const EisenhowerMatrix: React.FC = () => {
	// Получаем колонки, исключая колонку 'done'
	const mockColumns: IColumn[] = React.useMemo(
		() => INITIAL_COLUMNS.filter(column => column.id !== 'done'),
		[]
	)

	// Собираем все карточки из всех колонок
	const allCards: ICard[] = React.useMemo(
		() =>
			mockColumns.reduce(
				(acc: ICard[], column) => [...acc, ...column.cards],
				[]
			),
		[mockColumns]
	)

	const parseDate = React.useCallback(
		(dateStr: string | undefined): Date | null => {
			if (!dateStr) return null

			try {
				const [day, month, yearShort] = dateStr.split('.')
				const fullYear = 2000 + parseInt(yearShort, 10) // Преобразуем YY в 20YY
				const isoDateStr = `${fullYear}-${month.padStart(
					2,
					'0'
				)}-${day.padStart(2, '0')}`
				const date = new Date(isoDateStr)

				return isNaN(date.getTime()) ? null : date
			} catch {
				return null
			}
		},
		[]
	)

	const getUrgencyStatus = React.useCallback(
		(endDate: string | undefined, daysThreshold: number): boolean => {
			const deadline = parseDate(endDate)
			if (!deadline) return false

			const now = new Date()
			const timeDiff = deadline.getTime() - now.getTime()
			return timeDiff >= 0 && timeDiff <= daysThreshold * 24 * 60 * 60 * 1000
		},
		[parseDate]
	)

	const getQuadrant = React.useCallback(
		(card: ICard): number => {
			const isImportant = card.priority === 'Важно'
			const isMedium = card.priority === 'Средне'

			// Для важных задач порог - 3 дня, для средних - 2 дня
			const isUrgent = getUrgencyStatus(card.endDate, isMedium ? 2 : 3)

			if ((isImportant && isUrgent) || (isMedium && isUrgent)) return 1
			if (isImportant||isMedium && !isUrgent) return 2
			if (!isImportant && isUrgent) return 3
			return 4
		},
		[getUrgencyStatus]
	)

	// Распределяем карточки по квадрантам
	const quadrants = React.useMemo(() => {
		const result: Record<number, ICard[]> = { 1: [], 2: [], 3: [], 4: [] }

		allCards.forEach(card => {
			const quadrant = getQuadrant(card)
			result[quadrant].push(card)
		})

		return result
	}, [allCards, getQuadrant])

	return (
		<div className={styles['eisenhower-matrix']}>
			<div className={styles['matrix-labels-container']}>
				<div className={styles['importance-label']}>Важно</div>
				<div className={styles['unimportance-label']}>Не важно</div>
				<div className={styles['urgency-label-left']}>Срочно</div>
				<div className={styles['urgency-label-right']}>Не срочно</div>
			</div>

			<div className={styles['matrix-grid']}>
				<Quadrant quadrantNumber={1} cards={quadrants[1]} />
				<Quadrant quadrantNumber={2} cards={quadrants[2]} />
				<Quadrant quadrantNumber={3} cards={quadrants[3]} />
				<Quadrant quadrantNumber={4} cards={quadrants[4]} />
			</div>
		</div>
	)
}

export default React.memo(EisenhowerMatrix)
