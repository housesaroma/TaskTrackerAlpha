import {Sidebar} from 'primereact/sidebar';
import {TabPanel, TabView} from 'primereact/tabview';
import styles from './InfoSidebar.module.scss';
import {useState, useEffect} from "react";
import {EditableDescription} from "./EditableDescription/EditableDescription.tsx";
import SubtaskSection from '../SubtaskSection/subtaskSection';
import { TaskInformation } from './TaskInformation/TaskInformation';
import { Chat } from '../Chat/Chat';
import { ISubtask } from '../../types/types';
import {boardService} from "../../services/board.service.ts";

interface InfoSidebarProps {
    sidebarName: string;
    sidebarDescription: string;
    visible: boolean;
    onHide: () => void;
    cardId: string;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
    subtasks?: ISubtask[];
    onSubtasksChange?: (cardId: string, subtasks: ISubtask[]) => void;
}

export const InfoSidebar = ({
    sidebarName, 
    sidebarDescription, 
    visible, 
    onHide, 
    cardId,
    startDate,
    endDate,
    priority,
    createdAt,
    onDateChange,
    onPriorityChange,
    subtasks: initialSubtasks = [],
    onSubtasksChange
}: InfoSidebarProps) => {
    const [description, setDescription] = useState(sidebarDescription);
    const [subtasks, setSubtasks] = useState<ISubtask[]>(initialSubtasks);

    useEffect(() => {
        setSubtasks(initialSubtasks);
    }, []);

    const handleDescriptionSave = async (newDescription: string) => {
        try {
            await boardService.updateTask(parseInt(cardId), {
                description: newDescription
            });
            setDescription(newDescription);
        } catch (error) {
            console.error('Failed to update description:', error);
            // Optionally show error to user or revert changes
        }
    };

    const handleAddSubtask = () => {
        // Обработка добавления подзадачи будет происходить в компоненте SubtaskSection
    };

    const handleSubtaskToggle = (id: string) => {
        const updatedSubtasks = subtasks.map(task => 
            task.id === id ? { ...task, isDone: !task.isDone } : task
        );
        setSubtasks(updatedSubtasks);
        if (onSubtasksChange) {
            onSubtasksChange(cardId, updatedSubtasks);
        }
    };

    const handleSubtaskUpdate = (updatedSubtask: ISubtask) => {
        const updatedSubtasks = [...subtasks];
        const existingTaskIndex = updatedSubtasks.findIndex(task => task.id === updatedSubtask.id);
        
        if (existingTaskIndex !== -1) {
            // Обновляем существующую подзадачу
            updatedSubtasks[existingTaskIndex] = updatedSubtask;
        } else {
            // Добавляем новую подзадачу
            updatedSubtasks.push(updatedSubtask);
        }
        
        setSubtasks(updatedSubtasks);
        if (onSubtasksChange) {
            onSubtasksChange(cardId, updatedSubtasks);
        }
    };

    return (
        <div>
            <Sidebar
                visible={visible}
                position="right"
                onHide={onHide}
                className={styles.sidebar}
            >
                <div className={styles.sidebarContent}>
                    <h3 className={styles.name}>{sidebarName} <span style={{fontSize: '0.9em'}}>#{cardId}</span></h3>

                    <TabView className={styles.tabView}>
                        <TabPanel header="Чат">
                            <div className={styles.tabContent}>
                                <Chat cardId={cardId} />
                            </div>
                        </TabPanel>

                        <TabPanel header="Информация">
                            <div className={styles.tabContent}>
                                <TaskInformation 
                                    cardId={cardId}
                                    startDate={startDate}
                                    endDate={endDate}
                                    priority={priority}
                                    createdAt={createdAt}
                                    onDateChange={onDateChange}
                                    onPriorityChange={onPriorityChange}
                                />
                            </div>
                        </TabPanel>

                        <TabPanel header="Описание">
                            <EditableDescription
                                description={description}
                                onSave={handleDescriptionSave}
                            />
                        </TabPanel>

                        <TabPanel header="Подзадачи">
                            <div className={styles.tabContent}>
                                <SubtaskSection
                                    subtasks={subtasks}
                                    onAddSubtask={handleAddSubtask}
                                    onSubtaskToggle={handleSubtaskToggle}
                                    onSubtaskUpdate={handleSubtaskUpdate}
                                />
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </Sidebar>
        </div>
    );
};