import {closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay} from '@dnd-kit/core';
import {SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable';
import styles from './Board.module.scss';
import Column from '../Column/Column';
import {useBoard} from '../../hooks/useBoard';
import { useCardId } from '../../hooks/useCardId';
import BoardCard from '../BoardCard/BoardCard.tsx';

const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

const Board = () => {
    const { getNextId } = useCardId();
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
        handleSubtasksChange
    } = useBoard(getNextId);

    return (
        <div className={styles.board}>
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