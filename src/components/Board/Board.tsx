import {closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay} from '@dnd-kit/core';
import {SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable';
import styles from './Board.module.scss';
import Column from '../Column/Column';
import {useBoard} from '../../hooks/useBoard';
import DragOverlayContent from '../../utils/DragOverlayContent/DragOverlayContent.tsx';
import { useCardId } from '../../hooks/useCardId';

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
        handleRenameCard
    } = useBoard();
    const { getNextId } = useCardId();

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
                                getNextId={getNextId}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeCard && (
                        <DragOverlayContent
                            activeCard={activeCard}
                            onCheckClick={handleCheckClick}
                            onRenameCard={handleRenameCard}
                            onChangeColor={handleChangeCardColor}
                            onDeleteCard={handleDeleteCard}
                            onDuplicateCard={handleDuplicateCard}
                        />
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