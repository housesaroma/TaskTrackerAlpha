import React, {useEffect, useRef, useState} from 'react';
import { IColumn, ICard } from '../../types/types';
import Quadrant from './quardrant';
import styles from './matrix.module.scss';
import { useParams } from "react-router-dom";
import { boardService } from '../../services/board.service';
import { Toast } from 'primereact/toast';

interface EisenhowerMatrixProps {
	projectId: string;
	boardId: string;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = () => {
	const { projectId, boardId } = useParams<{ projectId: string; boardId: string; }>();
	const [columns, setColumns] = useState<IColumn[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const toast = useRef<Toast>(null);

	// Функция для преобразования даты
	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		return `${day}.${month}.${year}`;
	};

	// Загрузка данных доски
	const loadBoardData = async () => {
		setIsLoading(true);
		try {
			const boardData = await boardService.getBoardById(parseInt(boardId!));

			// Преобразуем данные API в наш формат колонок
			const transformedColumns = boardData.columns.map((apiColumn: any) => {
				const tasks: ICard[] = apiColumn.tasks?.map((task: any) => ({
					id: `${task.taskId}`,
					title: task.title,
					description: task.description,
					priority: task.priorityId === 1 ? 'Важно' :
						task.priorityId === 2 ? 'Средне' : 'Незначительно',
					startDate: formatDate(task.dateCreated),
					endDate: formatDate(task.deadline),
					isDone: apiColumn.columnID === 4,
					color: apiColumn.color,
					type: 'task',
					createdAt: task.dateCreated,
				})) || [];

				const defects: ICard[] = apiColumn.defects?.map((defect: any) => ({
					id: `defect-${defect.defectId}`,
					title: defect.title,
					description: defect.description,
					priority: defect.priorityId === 1 ? 'Важно' :
						defect.priorityId === 2 ? 'Средне' : 'Незначительно',
					startDate: formatDate(defect.dateCreated),
					endDate: formatDate(defect.deadline),
					isDone: apiColumn.columnID === 4,
					color: '#FF000080',
					type: 'defect',
					createdAt: defect.dateCreated,
				})) || [];

				return {
					id: `column-${apiColumn.columnID}`,
					title: apiColumn.title,
					color: apiColumn.color,
					cards: [...tasks, ...defects]
				};
			});

			// Исключаем колонку "Готово"
			const filteredColumns = transformedColumns.filter(column => !column.title.toLowerCase().includes('готово'));
			setColumns(filteredColumns);
		} catch (error) {
			console.error('Error loading board data:', error);
			toast.current?.show({
				severity: 'error',
				summary: 'Ошибка',
				detail: 'Не удалось загрузить данные для матрицы Эйзенхауэра',
				life: 3000
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (boardId && projectId) {
			loadBoardData();
		}
	}, [boardId, projectId]);

	const parseDate = React.useCallback(
		(dateStr: string | undefined): Date | null => {
			if (!dateStr) return null;

			try {
				const [day, month, yearShort] = dateStr.split('.');
				const fullYear = 2000 + parseInt(yearShort, 10); // Преобразуем YY в 20YY
				const isoDateStr = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
				const date = new Date(isoDateStr);

				return isNaN(date.getTime()) ? null : date;
			} catch {
				return null;
			}
		},
		[]
	);

	const getUrgencyStatus = React.useCallback(
		(endDate: string | undefined, daysThreshold: number): boolean => {
			const deadline = parseDate(endDate);
			if (!deadline) return false;

			const now = new Date();
			const timeDiff = deadline.getTime() - now.getTime();
			return timeDiff >= 0 && timeDiff <= daysThreshold * 24 * 60 * 60 * 1000;
		},
		[parseDate]
	);

	const getQuadrant = React.useCallback(
		(card: ICard): number => {
			const isImportant = card.priority === 'Важно';
			const isMedium = card.priority === 'Средне';

			// Для важных задач порог - 3 дня, для средних - 2 дня
			const isUrgent = getUrgencyStatus(card.endDate, isMedium ? 2 : 3);

			if ((isImportant && isUrgent) || (isMedium && isUrgent)) return 1;
			if ((isImportant || isMedium) && !isUrgent) return 2;
			if (!isImportant && isUrgent) return 3;
			return 4;
		},
		[getUrgencyStatus]
	);

	// Распределяем карточки по квадрантам
	const quadrants = React.useMemo(() => {
		const result: Record<number, ICard[]> = { 1: [], 2: [], 3: [], 4: [] };

		// Собираем все карточки из всех колонок
		const allCards = columns.reduce(
			(acc: ICard[], column) => [...acc, ...column.cards],
			[]
		);

		allCards.forEach(card => {
			const quadrant = getQuadrant(card);
			result[quadrant].push(card);
		});

		return result;
	}, [columns, getQuadrant]);

	if (isLoading) {
		return <div className={styles.loading}>Загрузка данных...</div>;
	}

	return (
		<div className={styles['eisenhower-matrix']}>
			<Toast ref={toast} />
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
	);
};

export default React.memo(EisenhowerMatrix);