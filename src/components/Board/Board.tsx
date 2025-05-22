import {closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay} from '@dnd-kit/core';
import {SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable';
import styles from './Board.module.scss';
import Column from '../Column/Column';
import {useBoard} from '../../hooks/useBoard';
import { useCardId } from '../../hooks/useCardId';
import { useEpic } from '../../hooks/useEpic';
import BoardCard from '../BoardCard/BoardCard.tsx';
import {useEffect} from 'react';
import {projectService} from '../../services/project.service';
import {Toast} from 'primereact/toast';
import {useRef} from 'react';

const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

interface BoardProps {
    projectId: string;
    boardId: string;
}

const Board = ({ projectId, boardId }: BoardProps) => {
    const { getNextId } = useCardId();
    const { epics, handleAddEpic, handleUpdateEpic } = useEpic();
    const toast = useRef<Toast>(null);
    const {
        columns,
        activeCard,
        activeColumn,
        handleDragStart,
        handleDragEnd,
        handleCheckClick,
        handleRenameColumn,
        handleChangeColumnColor,
        handleDeleteColumn,
        handleAddColumn,
        handleDuplicateColumn,
        handleAddCard,
        handleChangeCardColor,
        handleDeleteCard,
        handleDuplicateCard,
        handleRenameCard,
        handleChangeCardDates,
        handlePriorityChange,
        handleSubtasksChange,
        handleEpicChange,
        loadBoardData
    } = useBoard(getNextId, boardId);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const project = await projectService.getProjectById(parseInt(projectId));
                const board = project.boards?.find(b => b.boardId === parseInt(boardId));

                if (board) {
                    loadBoardData(board);
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Ошибка',
                        detail: 'Доска не найдена',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Failed to load board:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Ошибка загрузки',
                    detail: 'Не удалось загрузить данные доски',
                    life: 5000
                });
            }
        };

        fetchBoardData();
    }, [projectId, boardId]);

    const handleAddNewEpic = () => {
        const newEpic = handleAddEpic();
        return newEpic;
    };

    return (
        <div className={styles.board}>
            <Toast ref={toast} />
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={columns.map(column => column.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className={styles.columnsContainer}>
                        {columns.map(column => (
                            <Column
                                key={column.id}
                                column={column}
                                onCheckClick={handleCheckClick}
                                onRenameColumn={handleRenameColumn}
                                onChangeColor={handleChangeColumnColor}
                                onDeleteColumn={handleDeleteColumn}
                                onDuplicateColumn={handleDuplicateColumn}
                                onAddCard={handleAddCard}
                                onRenameCard={handleRenameCard}
                                onChangeCardColor={handleChangeCardColor}
                                onDeleteCard={handleDeleteCard}
                                onDuplicateCard={handleDuplicateCard}
                                onDateChange={handleChangeCardDates}
                                onPriorityChange={handlePriorityChange}
                                onSubtasksChange={handleSubtasksChange}
                                onEpicChange={handleEpicChange}
                                epics={epics}
                                onAddEpic={handleAddNewEpic}
                                onUpdateEpic={handleUpdateEpic}
                                getNextId={getNextId}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeCard && (
                        <div style={{
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            opacity: 0.9,
                            zIndex: 1000,
                            width: '280px'
                        }}>
                            <BoardCard
                                card={activeCard}
                                onCheckClick={handleCheckClick}
                                onRenameCard={handleRenameCard}
                                onDuplicateCard={handleDuplicateCard}
                                onChangeColor={handleChangeCardColor}
                                onDeleteCard={handleDeleteCard}
                                onDateChange={handleChangeCardDates}
                                onPriorityChange={handlePriorityChange}
                                onEpicChange={handleEpicChange}
                                epics={epics}
                                onAddEpic={handleAddNewEpic}
                                onUpdateEpic={handleUpdateEpic}
                            />
                        </div>
                    )}
                    {activeColumn && (
                        <div style={{
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            opacity: 0.9,
                            zIndex: 1000,
                            width: '300px',
                            backgroundColor: activeColumn.color,
                            borderRadius: '8px',
                            padding: '1rem'
                        }}>
                            <h2>{activeColumn.title}</h2>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
            <i
                className={'pi pi-plus-circle'}
                style={{cursor: 'pointer'}}
                onClick={handleAddColumn}
            ></i>
        </div>
    );
};

export default Board;