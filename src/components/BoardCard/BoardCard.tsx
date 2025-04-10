import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ICard} from '../../types/types.ts';
import styles from './BoardCard.module.scss';

const BoardCard = ({card}: { card: ICard }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id, transition: {
            duration: 150, // Плавность анимации
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition as string,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.draggableWrapper}
        >
            <div className={styles.card}>
                <div className="flex align-items-center justify-content-between">
                    <h3 className="">{card.title}</h3>
                    {card.priority && (
                        <span className={`priority-badge priority-${card.priority}`}>
                            {card.priority}
                        </span>
                    )}
                </div>
                {card.dates && (
                    <div className="flex align-items-center mt-2">
                        <i className="pi pi-calendar mr-2"></i>
                        <span className="text-sm">{card.dates}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardCard;