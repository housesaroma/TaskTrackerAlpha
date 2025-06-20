// useBoard.ts
import {useState, useEffect, useCallback} from 'react';
import {DragEndEvent} from '@dnd-kit/core';
import {ICard, IColumn, ISubtask, ITask, IDefect} from '../types/types';
import {boardService} from '../services/board.service.ts';
import {Toast} from 'primereact/toast';
import {useRef} from 'react';

export const useBoard = (getNextId?: () => number, boardId?: string, projectId?:  string) => {
    const toast = useRef<Toast>(null);
    const [columns, setColumns] = useState<IColumn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCard, setActiveCard] = useState<ICard | null>(null);
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);

    // Функция для преобразования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = String(date.getFullYear()).slice(-2); // Берем последние 2 цифры года
        return `${day}.${month}.${year}`;
    };

    const loadBoardData = async () => {
        setIsLoading(true);
        try {
            const boardData = await boardService.getBoardById(parseInt(boardId));

            // Преобразуем данные API в наш формат колонок
            const transformedColumns = boardData.columns.map(apiColumn => {
                const tasks: ITask[] = apiColumn.tasks?.map(task => ({
                    id: `${task.taskId}`,
                    title: task.title,
                    description: task.description,
                    priority: task.priorityId === 1 ? 'Важно' :
                        task.priorityId === 2 ? 'Средне' : 'Незначительно',
                    startDate: formatDate(task.dateCreated), // Преобразуем дату
                    endDate: formatDate(task.deadline), // Преобразуем дату
                    isDone: apiColumn.title === 'Готово', // Предполагаем, что колонка 4 - "Готово"
                    color: '#ccc',
                    type: 'task',
                    createdAt: task.dateCreated,
                    subtasks: task.subTasks?.map((sub, index) => ({
                        id: `subtask-${task.taskId}-${index}`,
                        title: sub.title || `Подзадача ${index + 1}`,
                        isDone: sub.isDone || false
                    })) || [],
                    // Остальные поля можно добавить по аналогии
                })) || [];

                const defects: IDefect[] = apiColumn.defects?.map(defect => ({
                    id: `defect-${defect.defectId}`,
                    title: defect.title,
                    description: defect.description,
                    priority: defect.priorityId === 1 ? 'Важно' :
                        defect.priorityId === 2 ? 'Средне' : 'Незначительно',
                    startDate: formatDate(defect.dateCreated), // Преобразуем дату
                    endDate: formatDate(defect.deadline), // Преобразуем дату
                    isDone: apiColumn.title === 'Готово',
                    color: 'rgba(145,53,53,0.5)', // Красный цвет для дефектов
                    type: 'defect',
                    createdAt: defect.dateCreated,
                    subtasks: defect.subTasks?.map((sub, index) => ({
                        id: `subtask-${defect.defectId}-${index}`,
                        title: sub.title || `Подзадача ${index + 1}`,
                        isDone: sub.isDone || false
                    })) || [],
                    // Остальные поля можно добавить по аналогии
                })) || [];

                const cards: ICard[] = [...tasks, ...defects];

                return {
                    id: `column-${apiColumn.columnID}`,
                    title: apiColumn.title,
                    color: apiColumn.color,
                    cards
                };
            });

            setColumns(transformedColumns);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: error instanceof Error ? error.message : 'Не удалось загрузить доску',
                life: 3000
            });
            // Если не удалось загрузить, используем начальные колонки
            // setColumns(INITIAL_COLUMNS);
        } finally {
            setIsLoading(false);
        }
    };

    // Загрузка данных доски при монтировании или изменении boardId
    useEffect(() => {
        if (!boardId || !projectId) return;

        // if (boardId === '1' && projectId === '1') {
        //     setColumns(INITIAL_COLUMNS);
        //     return;
        // }

        loadBoardData();
    }, [boardId]);

    const handleDragStart = (event: any) => {
        const {active} = event;
        
        // Check if we're dragging a column
        const column = columns.find(col => col.id === active.id);
        if (column) {
            setActiveColumn(column);
            return;
        }

        // Otherwise check for a card
        for (const column of columns) {
            const card = column.cards.find(c => c.id === active.id);
            if (card) {
                setActiveCard(card);
                break;
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveCard(null);
        setActiveColumn(null);
        const {active, over} = event;

        if (!over || active.id === over.id) return;

        if (columns.some(col => col.id === active.id)) {
            setColumns(prevColumns => {
                const newColumns = [...prevColumns];
                const activeIndex = newColumns.findIndex(col => col.id === active.id);
                const overIndex = newColumns.findIndex(col => col.id === over.id);

                if (activeIndex === -1 || overIndex === -1) return prevColumns;

                const [removed] = newColumns.splice(activeIndex, 1);
                newColumns.splice(overIndex, 0, removed);

                return newColumns;
            });
            return;
        }

        setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            const activeColumnIndex = newColumns.findIndex(col =>
                col.cards.some(card => card.id === active.id)
            );
            const overColumnIndex = newColumns.findIndex(col =>
                col.id === over.id || col.cards.some(card => card.id === over.id)
            );

            if (activeColumnIndex === -1 || overColumnIndex === -1) return prevColumns;

            const activeCardIndex = newColumns[activeColumnIndex].cards.findIndex(
                card => card.id === active.id
            );

            const [removed] = newColumns[activeColumnIndex].cards.splice(activeCardIndex, 1);
            const updatedCard = {
                ...removed,
                // isDone: newColumns[overColumnIndex].id === 'done'
            };

            if (activeColumnIndex === overColumnIndex) {
                const overCardIndex = newColumns[overColumnIndex].cards.findIndex(
                    card => card.id === over.id
                );
                const insertIndex = activeCardIndex < overCardIndex ? overCardIndex : overCardIndex + 1;
                newColumns[overColumnIndex].cards.splice(insertIndex, 0, updatedCard);
            } else {
                if (newColumns[overColumnIndex].cards.some(card => card.id === over.id)) {
                    const overCardIndex = newColumns[overColumnIndex].cards.findIndex(
                        card => card.id === over.id
                    );
                    newColumns[overColumnIndex].cards.splice(overCardIndex, 0, updatedCard);
                } else {
                    newColumns[overColumnIndex].cards.push(updatedCard);
                }
            }

            return newColumns;
        });

        // Сначала создаем копию состояния для оптимистичного обновления
        const activeColumnIndex = columns.findIndex(col =>
            col.cards.some(card => card.id === active.id)
        );
        const overColumnIndex = columns.findIndex(col =>
            col.id === over.id || col.cards.some(card => card.id === over.id)
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1) return;

        const activeCardIndex = columns[activeColumnIndex].cards.findIndex(
            card => card.id === active.id
        );

        const cardToMove = columns[activeColumnIndex].cards[activeCardIndex];
        const targetColumn = columns[overColumnIndex];

        try {
            const taskId = parseInt(cardToMove.id.replace('task-', '').replace('defect-', ''));
            await boardService.updateTaskColumn(taskId, targetColumn.title);
        }catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: error instanceof Error ? error.message : 'Не удалось переместить карточку',
                life: 3000
            });

            setColumns(columns);
        }
    };

    const handleCheckClick = (id: string, isDone: boolean) => {
        if (isDone) {
            // Перемещаем карточку в колонку "Готово"
            boardService.updateTaskColumn(parseInt(id.replace('task-', '')), 'Готово')
                .catch(error => {
                    console.error('Ошибка при перемещении карточки:', error);
                });
        }
        else {
            // Перемещаем карточку в колонку "В работе"
            boardService.updateTaskColumn(parseInt(id.replace('task-', '')), 'В работе')
                .catch(error => {
                    console.error('Ошибка при перемещении карточки:', error);
                });
        }

        setColumns(prev => {
            const newColumns = [...prev];
            let sourceColumnIndex = -1;
            let cardIndex = -1;
            let cardToUpdate: ICard | null = null;

            for (let i = 0; i < newColumns.length; i++) {
                const index = newColumns[i].cards.findIndex(c => c.id === id);
                if (index !== -1) {
                    sourceColumnIndex = i;
                    cardIndex = index;
                    cardToUpdate = newColumns[i].cards[index];
                    break;
                }
            }

            if (!cardToUpdate) return prev;

            const updatedCard = {...cardToUpdate, isDone};

            if (isDone) {
                newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);
                const doneColumnIndex = newColumns.findIndex(col => col.title === 'Готово');
                if (doneColumnIndex !== -1) {
                    newColumns[doneColumnIndex].cards.push(updatedCard);
                }
            } else {
                newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);
                const inWorkColumnIndex = newColumns.findIndex(col => col.title === 'В работе');
                if (inWorkColumnIndex !== -1) {
                    newColumns[inWorkColumnIndex].cards.push(updatedCard);
                }
            }

            return newColumns;
        });
    };

    const handleChangeColumnColor = (columnId: string, newColor: string) => {
        setColumns(prev =>
            prev.map(column =>
                column.id === columnId
                    ? {...column, color: newColor}
                    : column
            )
        );
    };

    const handleDeleteColumn = (columnId: string) => {
        setColumns(prev => {
            // Нельзя удалить колонки с фиксированными ID
            if (columnId === 'to-do' || columnId === 'in-work' || columnId === 'done') {
                return prev;
            }

            // Перемещаем все карточки из удаляемой колонки в "To Do"
            // const columns = [...prev];
            // const columnToDeleteIndex = columns.findIndex(c => c.id === columnId);
            //
            // if (columnToDeleteIndex === -1) return prev;
            //
            // const cardsToMove = columns[columnToDeleteIndex].cards;
            // const toDoColumnIndex = columns.findIndex(c => c.id === 'to-do');
            //
            // if (toDoColumnIndex !== -1) {
            //     columns[toDoColumnIndex].cards.push(...cardsToMove);
            // }

            return columns.filter(column => column.id !== columnId);
        });
    };

    const handleRenameColumn = (columnId: string, newTitle: string) => {
        setColumns(prev =>
            prev.map(column =>
                column.id === columnId
                    ? {...column, title: newTitle}
                    : column
            )
        );
    };

    const handleAddColumn = () => {
        const newColumn: IColumn = {
            id: `column-${Date.now()}`, // уникальный ID
            title: 'Новая колонка',
            cards: [],
            color: '#e3e3e380' // прозрачный серый по умолчанию
        };

        setColumns(prev => [...prev, newColumn]);
    };

    const handleDuplicateColumn = (columnId: string) => {
        setColumns(prev => {
            const columnToDuplicate = prev.find(col => col.id === columnId);
            if (!columnToDuplicate || columnId === 'to-do' || columnId === 'in-work' || columnId === 'done') return prev;

            // Создаем глубокую копию колонки и ее карточек
            const duplicatedColumn: IColumn = {
                ...columnToDuplicate,
                id: `column-${Date.now()}`, // новый уникальный ID
                title: `${columnToDuplicate.title} (копия)`,
                cards: columnToDuplicate.cards.map(card => ({
                    ...card,
                    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // новые ID для карточек
                }))
            };

            // Вставляем после оригинальной колонки
            const columnIndex = prev.findIndex(col => col.id === columnId);
            const newColumns = [...prev];
            newColumns.splice(columnIndex + 1, 0, duplicatedColumn);

            return newColumns;
        });
    };

    const handleAddCard = useCallback(async (columnId: string, card: ICard) => {
        if (!boardId) return;

        try {
            const boardIdNum = parseInt(boardId);
            const projectIdNum = parseInt(projectId!);
            const column = columns.find(c => c.id === columnId);

            if (!column) return;

            let createdCard: ICard;

            if (card.type === 'task') {
                const taskData = await boardService.createTask({
                    title: card.title,
                    description: card.description,
                    deadline: card.endDate,
                    boardId: boardIdNum,
                    projectId: projectIdNum,
                    currentColumn: column.title,
                    priorityId: card.priority === 'Важно' ? 1 :
                        card.priority === 'Средне' ? 2 : 3
                });

                createdCard = {
                    ...card,
                    id: `task-${taskData.taskId}`,
                    createdAt: taskData.dateCreated,
                    endDate: taskData.deadline
                };
            } else {
                const defectData = await boardService.createDefect({
                    title: card.title,
                    description: card.description,
                    deadline: card.endDate,
                    boardId: boardIdNum,
                    projectId: projectIdNum,
                    currentColumn: column.title,
                    priorityId: card.priority === 'Важно' ? 1 :
                        card.priority === 'Средне' ? 2 : 3
                });

                createdCard = {
                    ...card,
                    id: `defect-${defectData.defectId}`,
                    createdAt: defectData.dateCreated,
                    endDate: defectData.deadline
                };
            }

            setColumns(prevColumns =>
                prevColumns.map(col =>
                    col.id === columnId
                        ? {...col, cards: [...col.cards, createdCard]}
                        : col
                )
            );

            loadBoardData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: error instanceof Error ? error.message : 'Не удалось создать карточку',
                life: 3000
            });
        }
    }, [boardId, columns]);

    const handleRenameCard = (cardId: string, newTitle: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? {...card, title: newTitle} : card
                )
            }))
        );
    };

    const handleChangeCardColor = (cardId: string, newColor: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? {...card, color: newColor} : card
                )
            }))
        );
    };

    const handleChangeCardDates = (cardId: string, startDate: string, endDate: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? {...card, startDate, endDate} : card
                )
            }))
        );
    };

    const handleDeleteCard = (cardId: string) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.filter(card => card.id !== cardId)
            }))
        );
    };

    const handleDuplicateCard = (cardId: string) => {
        if (!getNextId) return;
        
        const newId = getNextId();
        const now = new Date();
        const formattedDate = `${now.getDate()} ${getMonthName(now.getMonth())} ${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setColumns(prev => {
            return prev.map(column => {
                const cardToDuplicate = column.cards.find(card => card.id === cardId);
                if (!cardToDuplicate) return column;
    
                const duplicatedCard = {
                    ...cardToDuplicate,
                    id: `${newId}`,
                    title: `${cardToDuplicate.title} (копия)`,
                    createdAt: formattedDate
                };
    
                return {
                    ...column,
                    cards: [...column.cards, duplicatedCard]
                };
            });
        });
    };
    
    // Helper function to get month name in Russian
    const getMonthName = (month: number): string => {
        const months = [
            'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
            'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
        ];
        return months[month];
    };

    const handlePriorityChange = (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => {
        setColumns(prevColumns =>
            prevColumns.map(column => ({
                ...column,
                cards: column.cards.map(card =>
                    card.id === cardId ? { ...card, priority } : card
                )
            }))
        );
    };

    const handleSubtasksChange = (cardId: string, subtasks: ISubtask[]) => {
        setColumns(prev => {
            const newColumns = [...prev];
            
            for (let i = 0; i < newColumns.length; i++) {
                const cardIndex = newColumns[i].cards.findIndex(c => c.id === cardId);
                if (cardIndex !== -1) {
                    newColumns[i].cards[cardIndex] = {
                        ...newColumns[i].cards[cardIndex],
                        subtasks
                    };
                    break;
                }
            }
            
            return newColumns;
        });
    };

    const handleEpicChange = (cardId: string, epicId: string | null) => {
        setColumns(prev =>
            prev.map(column => ({
                ...column,
                cards: column.cards.map(card => {
                    if (card.id === cardId) {
                        return {
                            ...card,
                            epicId: epicId
                        };
                    }
                    return card;
                })
            }))
        );
    };

    return {
        columns,
        activeCard,
        activeColumn,
        handleDragStart,
        handleDragEnd,
        handleCheckClick,
        handleChangeColumnColor,
        handleDeleteColumn,
        handleRenameColumn,
        handleAddColumn,
        handleDuplicateColumn,
        handleAddCard,
        handleRenameCard,
        handleChangeCardColor,
        handleDuplicateCard,
        handleDeleteCard,
        handleChangeCardDates,
        handlePriorityChange,
        handleSubtasksChange,
        handleEpicChange
    };
};