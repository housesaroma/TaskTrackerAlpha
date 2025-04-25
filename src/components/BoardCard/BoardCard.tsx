import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ICard} from '../../types/types';
import styles from './BoardCard.module.scss';
import "primeicons/primeicons.css";
import {InputText} from "primereact/inputtext";
import {BoardCardMenu} from "./BoardCardMenu.tsx";
import {InfoSidebar} from "../InfoSidebar/InfoSidebar.tsx";
import {useCard} from "../../hooks/useCard";

const BoardCard = ({card, onCheckClick, onRenameCard, onChangeColor, onDeleteCard, onDuplicateCard}: {
    card: ICard;
    onCheckClick?: (id: string, isDone: boolean) => void;
    onRenameCard: (id: string, newTitle: string) => void;
    onChangeColor: (id: string, newColor: string) => void;
    onDeleteCard: (id: string) => void;
    onDuplicateCard: (id: string) => void;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
    });

    const {
        isEditing,
        newTitle,
        sidebarVisible,
        inputRef,
        handleCardClick,
        handleIconClick,
        handleRenameClick,
        handleTitleChange,
        handleTitleBlur,
        handleKeyDown,
        handleMenuAction,
        handleSidebarHide,
    } = useCard(card, {
        onCheckClick,
        onRenameCard,
        onChangeColor,
        onDeleteCard,
        onDuplicateCard
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={styles.draggableWrapper}
                onClick={handleCardClick}
            >
                <div className={styles.card} style={{backgroundColor: card.color}}>
                    <i
                        className={`pi pi-check-circle ${card.isDone ? styles.checkedIcon : ''}`}
                        onClick={handleIconClick}
                        style={{
                            cursor: 'pointer',
                            pointerEvents: 'auto'
                        }}
                    />

                    {!isEditing && (
                        <div className={styles.dragHandle}>
                            <div className={styles.cardContent}>
                                <div className={styles.cardName}>
                                    <h3 {...listeners} className={`${card.isDone ? styles.checkedText : ''}`}>
                                        {card.title}
                                    </h3>
                                </div>
                                {(card.startDate || card.endDate || card.priority) && (
                                    <div className={styles.cardMetadata}>
                                        {(card.startDate || card.endDate) && (
                                            <div className={styles.dates}>
                                                <i className="pi pi-calendar" />
                                                {card.startDate && card.endDate ? (
                                                    `${card.startDate.split('-').slice(1).join('.')} - ${card.endDate.split('-').slice(1).join('.')}`
                                                ) : (
                                                    card.startDate?.split('-').slice(1).join('.') || card.endDate?.split('-').slice(1).join('.')
                                                )}
                                            </div>
                                        )}
                                        {card.priority && (
                                            <div className={`${styles.priority} ${card.priority === 'Важно' ? styles.important : styles.medium}`}>
                                                <i className="pi pi-bolt" />
                                                {card.priority}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div className={styles.cardName}>
                            <InputText
                                value={newTitle}
                                onChange={handleTitleChange}
                                onBlur={handleTitleBlur}
                                onKeyDown={handleKeyDown}
                                ref={inputRef}
                                className={styles.titleInput}
                            />
                        </div>
                    )}

                    <div style={{pointerEvents: 'auto'}} onClick={handleMenuAction}>
                        <BoardCardMenu
                            cardColor={card.color || '#ffffff'}
                            onColorChange={(color) => onChangeColor(card.id, color)}
                            onRename={handleRenameClick}
                            onDelete={() => onDeleteCard(card.id)}
                            onDuplicate={() => onDuplicateCard(card.id)}
                        />
                    </div>
                </div>
            </div>
            <InfoSidebar
                sidebarName={card.title}
                sidebarDescription={card.description ?? 'Нет описания'}
                visible={sidebarVisible}
                onHide={handleSidebarHide}
            />
        </>
    );
};

export default BoardCard;