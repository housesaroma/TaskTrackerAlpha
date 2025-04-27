import {Sidebar} from 'primereact/sidebar';
import {TabPanel, TabView} from 'primereact/tabview';
import styles from './InfoSidebar.module.scss';
import {useState} from "react";
import {EditableDescription} from "./EditableDescription/EditableDescription.tsx";
import SubtaskSection from '../SubtaskSection/subtaskSection';
import { TaskInformation } from './TaskInformation/TaskInformation';
import { Chat } from '../Chat/Chat';

interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    startDate?: string;
    endDate?: string;
}

interface InfoSidebarProps {
    sidebarName: string;
    sidebarDescription: string;
    visible: boolean;
    onHide: () => void;
    cardId: string;
    startDate?: string;
    endDate?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
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
    onDateChange,
    onPriorityChange
}: InfoSidebarProps) => {
    const [description, setDescription] = useState(sidebarDescription);
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);

    const handleDescriptionSave = (newDescription: string) => {
        setDescription(newDescription);
        // Здесь можно добавить API-вызов для сохранения на сервере
    };

    const handleAddSubtask = () => {
        // Обработка добавления подзадачи будет происходить в компоненте SubtaskSection
    };

    const handleSubtaskToggle = (id: string) => {
        setSubtasks(subtasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleSubtaskUpdate = (updatedSubtask: Subtask) => {
        setSubtasks(prevSubtasks => {
            const existingTaskIndex = prevSubtasks.findIndex(task => task.id === updatedSubtask.id);
            if (existingTaskIndex !== -1) {
                // Обновляем существующую подзадачу
                const newSubtasks = [...prevSubtasks];
                newSubtasks[existingTaskIndex] = updatedSubtask;
                return newSubtasks;
            } else {
                // Добавляем новую подзадачу
                return [...prevSubtasks, updatedSubtask];
            }
        });
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
                                <Chat />
                            </div>
                        </TabPanel>

                        <TabPanel header="Информация">
                            <div className={styles.tabContent}>
                                <TaskInformation 
                                    cardId={cardId}
                                    startDate={startDate}
                                    endDate={endDate}
                                    priority={priority}
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