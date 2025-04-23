import {ICard} from '../../types/types.ts';
import BoardCard from '../../components/BoardCard/BoardCard.tsx';

interface DragOverlayContentProps {
    activeCard: ICard | null;
    onCheckClick: (id: string, isDone: boolean) => void;
    onRenameCard: (id: string, newTitle: string) => void;
    onChangeColor: (id: string, newColor: string) => void;
    onDeleteCard: (id: string) => void;
    onDuplicateCard: (id: string) => void;
}

const DragOverlayContent = ({activeCard, onCheckClick, onRenameCard, onDuplicateCard, onDeleteCard, onChangeColor}: DragOverlayContentProps) => {
    if (!activeCard) return null;

    return (
        <div style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            opacity: 0.9,
            zIndex: 1000,
            width: '280px'
        }}>
            <BoardCard
                card={activeCard}
                onCheckClick={onCheckClick}
                onRenameCard={onRenameCard}
                onDuplicateCard={onDuplicateCard}
                onChangeColor={onChangeColor}
                onDeleteCard={onDeleteCard}
            />
        </div>
    );
};

export default DragOverlayContent;