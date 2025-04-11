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
        handleDeleteColumn
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
        </div>
    );
};

export default Board;