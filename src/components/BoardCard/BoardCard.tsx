import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ICard, ISubtask, IEpic} from '../../types/types';
import styles from './BoardCard.module.scss';
import "primeicons/primeicons.css";
import {InputText} from "primereact/inputtext";
import {BoardCardMenu} from "./BoardCardMenu.tsx";
import {InfoSidebar} from "../InfoSidebar/InfoSidebar.tsx";
import {DefectSidebar} from "../InfoSidebar/DefectSidebar.tsx";
import {useCard} from "../../hooks/useCard";
import { useState } from 'react';
import { EpicSidebar } from "../EpicSidebar/EpicSidebar.tsx";

const BoardCard = ({card, showMenu=true, onCheckClick, onRenameCard, onChangeColor, onDeleteCard, onDuplicateCard, onDateChange, onPriorityChange, onSubtasksChange, epics, onEpicChange, onUpdateEpic, onAddEpic}: {
    card: ICard;
    showMenu?:boolean,
    onCheckClick?: (id: string, isDone: boolean) => void;
    onRenameCard?: (id: string, newTitle: string) => void;
    onChangeColor?: (id: string, newColor: string) => void;
    onDeleteCard?: (id: string) => void;
    onDuplicateCard?: (id: string) => void;
    onDateChange?: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange?: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
    onSubtasksChange?: (cardId: string, subtasks: ISubtask[]) => void;
    epics?: IEpic[];
    onEpicChange?: (cardId: string, epicId: string | null) => void;
    onUpdateEpic?: (epicId: string, updates: Partial<IEpic>) => void;
    onAddEpic?: () => IEpic;
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

    const [showSubtasks, setShowSubtasks] = useState(false);
    const [showEpicSidebar, setShowEpicSidebar] = useState(false);
    const [selectedEpic, setSelectedEpic] = useState<IEpic | null>(null);

    const formatDate = (date: string) => {
        return date.split('.')[0] + '.' + date.split('.')[1];
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    const toggleSubtasks = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowSubtasks(!showSubtasks);
    };

    const getCompletedSubtasksCount = () => {
        return card.subtasks?.filter(subtask => subtask.isDone).length || 0;
    };

    const getTotalSubtasksCount = () => {
        return card.subtasks?.length || 0;
    };

    const handleSubtasksChange = (cardId: string, subtasks: ISubtask[]) => {
        if (onSubtasksChange) {
            onSubtasksChange(cardId, subtasks);
        }
    };

	const handleEpicSidebarUpdate = (updates: Partial<IEpic>) => {
		if (selectedEpic) {
			// Обновляем локальное состояние
			setSelectedEpic({...selectedEpic, ...updates});
			
			// Обновляем глобальное состояние
			if (onUpdateEpic) {
				onUpdateEpic(selectedEpic.id, updates);
			}
			
			// Принудительно обновляем цвет в карточке
			if (updates.color && card.epicId === selectedEpic.id) {

				const updatedEpics = epics?.map(epic => 
					epic.id === selectedEpic.id ? {...epic, color: updates.color!} : epic
				);

				// const updatedEpics = epics.map(epic =>
				// 	epic.id === selectedEpic.id ? {...epic, color: updates.color!} : epic
				// );

				// Если нужно, можно передать обновленные эпики в родительский компонент
			}
		}
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
					<div className={styles.card} style={{ backgroundColor: card.color }}>
						<i
							className={`pi ${
								card.type === 'defect'
									? 'pi-exclamation-triangle'
									: 'pi-check-circle'
							} ${card.isDone ? styles.checkedIcon : styles.icon}`}
							onClick={handleIconClick}
							style={{
								cursor: 'pointer',
								pointerEvents: 'auto',
							}}
						/>

						{!isEditing && (
							<div className={styles.dragHandle}>
								<div className={styles.cardName}>
									<h3
										{...listeners}
										className={`${card.isDone ? styles.checkedText : ''}`}
									>
										{card.title}{' '}
										<span style={{ fontSize: '0.9em' }}>#{card.id}</span>
									</h3>
																	{/* Epic tag */}
								{card.epicId && (
									<div className={styles.epicContainer}>
										{epics?.find(epic => epic.id === card.epicId) && (
											<div 
												className={styles.epicTag}
												style={{ 
													backgroundColor: epics.find(epic => epic.id === card.epicId)?.color || '#e3e3e3'
												}}
												onClick={(e) => {
													e.stopPropagation();
													const epic = epics.find(epic => epic.id === card.epicId);
													if (epic) {
														setSelectedEpic(epic);
														setShowEpicSidebar(true);
													}
												}}
											>
												{epics.find(epic => epic.id === card.epicId)?.title}
											</div>
										)}
									</div>
								)}
								</div>
								{(card.startDate || card.endDate || card.priority) && (
									<div className={styles.cardMetadata}>
										{(card.startDate || card.endDate) && (
											<div className={styles.dates}>
												<i className='pi pi-calendar' />
												{card.startDate && card.endDate
													? `${formatDate(card.startDate)} - ${formatDate(
															card.endDate
													  )}`
													: card.startDate
													? formatDate(card.startDate)
													: card.endDate
													? formatDate(card.endDate)
													: null}
											</div>
										)}
										{card.priority && (
											<div
												className={`${styles.priority} ${
													card.priority === 'Важно'
														? styles.important
														: card.priority === 'Средне'
														? styles.medium
														: styles.low
												}`}
											>
												<i className='pi pi-bolt' />
												{card.priority}
											</div>
										)}
									</div>
								)}
								{/* Subtasks section */}
								{card.subtasks && card.subtasks.length > 0 && (
									<div className={styles.subtasksSection}>
										<div
											className={styles.subtasksHeader}
											onClick={toggleSubtasks}
											style={{ cursor: 'pointer' }}
										>
											<i
												className={`pi ${
													showSubtasks ? 'pi-chevron-down' : 'pi-chevron-right'
												}`}
											/>
											<span>
												Подзадачи ({getCompletedSubtasksCount()}/
												{getTotalSubtasksCount()})
											</span>
										</div>

										{showSubtasks && (
											<div className={styles.subtasksList}>
												{card.subtasks.map(subtask => (
													<div key={subtask.id} className={styles.subtaskItem}>
														<i
															className={`pi pi-check-circle ${
																subtask.isDone ? styles.checkedIcon : ''
															}`}
														/>
														<span
															className={
																subtask.isDone ? styles.checkedText : ''
															}
														>
															{subtask.title}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								)}
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

						{showMenu && (
							<div style={{ pointerEvents: 'auto' }} onClick={handleMenuAction}>
								<BoardCardMenu
									cardColor={card.color || '#ffffff'}
									onColorChange={color => onChangeColor?.(card.id, color)}
									onRename={handleRenameClick}
									onDelete={() => onDeleteCard?.(card.id)}
									onDuplicate={() => onDuplicateCard?.(card.id)}
									epics={epics || []}
									onEpicSelect={(epicId) => onEpicChange?.(card.id, epicId)}
									onAddEpic={onAddEpic}/>
							</div>
						)}
					</div>
				</div>

				{showMenu &&
					(card.type === 'defect' ? (
						<DefectSidebar
							sidebarName={card.title}
							sidebarDescription={card.description ?? 'Нет описания'}
							sidebarSummary={card.summary ?? 'Нет резюме'}
							visible={sidebarVisible}
							onHide={handleSidebarHide}
							cardId={card.id}
							startDate={card.startDate}
							endDate={card.endDate}
							priority={card.priority}
							createdAt={card.createdAt}
							onDateChange={(...args) => onDateChange?.(...args)}
							onPriorityChange={(...args) => onPriorityChange?.(...args)}
						/>
					) : (
						<InfoSidebar
							sidebarName={card.title}
							sidebarDescription={card.description ?? 'Нет описания'}
							visible={sidebarVisible}
							onHide={handleSidebarHide}
							cardId={card.id}
							startDate={card.startDate}
							endDate={card.endDate}
							priority={card.priority}
							onDateChange={(...args) => onDateChange?.(...args)}
							onPriorityChange={(...args) => onPriorityChange?.(...args)}
							createdAt={card.createdAt}
							subtasks={card.subtasks}
							onSubtasksChange={handleSubtasksChange}
						/>
					))

				}
				{selectedEpic && (
					<EpicSidebar
						epic={selectedEpic}
						visible={showEpicSidebar}
						onHide={() => setShowEpicSidebar(false)}
						onUpdate={handleEpicSidebarUpdate}
					/>
				)}
			</>
		)
};

export default BoardCard;