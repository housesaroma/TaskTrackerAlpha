import {ICard} from '../../types/types.ts';
import BoardCard from '../../components/BoardCard/BoardCard.tsx';

interface DragOverlayContentProps {
    activeCard: ICard | null;
    onCheckClick: (id: string, isDone: boolean) => void;
}

const DragOverlayContent = ({activeCard, onCheckClick}: DragOverlayContentProps) => {
    if (!activeCard) return null;

    return (
        <div style={{
            transform: 'scale(1.05)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            opacity: 0.9,
            zIndex: 1000,
            width: '280px'
        }}>
            <BoardCard
                card={activeCard}
                onCheckClick={onCheckClick}
            />
        </div>
    );
};

export default DragOverlayContent;