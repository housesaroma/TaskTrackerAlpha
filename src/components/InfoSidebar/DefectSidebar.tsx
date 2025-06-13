import {Sidebar} from 'primereact/sidebar';
import styles from './InfoSidebar.module.scss';
import {useState} from "react";
import {EditableDescription} from "./EditableDescription/EditableDescription.tsx";
import {EditableSummary} from "./EditableSummary/EditableSummary.tsx";
import { TaskInfoSection } from './TaskInformation/TaskInfoSection.tsx';
import {TabPanel, TabView} from "primereact/tabview";
import {Chat} from "../Chat/Chat.tsx";
import {TaskInformation} from "./TaskInformation/TaskInformation.tsx";

interface DefectSidebarProps {
    sidebarName: string;
    sidebarDescription: string;
    sidebarSummary: string;
    visible: boolean;
    onHide: () => void;
    cardId: string;
    startDate?: string;
    createdAt?: string;
    endDate?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
}

export const DefectSidebar = ({
    sidebarName, 
    sidebarDescription, 
    sidebarSummary, 
    visible, 
    onHide, 
    cardId,
    startDate,
    endDate,
    priority,
    onDateChange,
    createdAt,
    onPriorityChange,
}: DefectSidebarProps) => {
    const [description, setDescription] = useState(sidebarDescription);
    const [summary, setSummary] = useState(sidebarSummary);

    const handleDescriptionSave = (newDescription: string) => {
        setDescription(newDescription);
        // Здесь можно добавить API-вызов для сохранения на сервере
    };

    const handleSummarySave = (newSummary: string) => {
        setSummary(newSummary);
        // Здесь можно добавить API-вызов для сохранения на сервере
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
                        <EditableSummary
                            summary={summary}
                            onSave={handleSummarySave}
                        />
                        
                        <EditableDescription
                            description={description}
                            onSave={handleDescriptionSave}
                        />
                        
                        <TaskInfoSection
                            cardId={cardId}
                            startDate={startDate}
                            endDate={endDate}
                            priority={priority}
                            createdAt={createdAt}
                            onDateChange={onDateChange}
                            onPriorityChange={onPriorityChange}
                        />
                    </div>
                        </TabPanel> </TabView>
                </div>
            </Sidebar>
        </div>
    );
}; 