import {closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay} from '@dnd-kit/core';
import styles from './Board.module.scss';
import Column from '../Column/Column';
import {useBoard} from '../../hooks/useBoard';
import DragOverlayContent from '../../utils/DragOverlayContent/DragOverlayContent.tsx';

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
        handleDragStart,
        handleDragEnd,
        handleCheckClick,
        handleRenameColumn,
        handleChangeColumnColor,
        handleDeleteColumn,
        handleAddColumn,
        handleDuplicateColumn,
        handleAddCard
    } = useBoard();

    return (
        <div className={styles.board}>
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
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
                        />
                    ))}
                </div>

                <DragOverlay dropAnimation={dropAnimationConfig}>
                    <DragOverlayContent
                        activeCard={activeCard}
                        onCheckClick={handleCheckClick}
                    />
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