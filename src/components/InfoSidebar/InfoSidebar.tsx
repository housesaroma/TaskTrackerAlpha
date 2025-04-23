import {Sidebar} from 'primereact/sidebar';
import {TabPanel, TabView} from 'primereact/tabview';
import styles from './InfoSidebar.module.scss';
import {useState} from "react";
import {EditableDescription} from "./EditableDescription/EditableDescription.tsx";

interface InfoSidebarProps {
    sidebarName: string;
    sidebarDescription: string;
    visible: boolean;
    onHide: () => void;
}

export const InfoSidebar = ({sidebarName, sidebarDescription, visible, onHide}: InfoSidebarProps) => {

    const [description, setDescription] = useState(sidebarDescription);

    const handleDescriptionSave = (newDescription: string) => {
        setDescription(newDescription);
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
                    <h3 className={styles.name}>{sidebarName}</h3>

                    <TabView className={styles.tabView}>
                        <TabPanel header="Чат">
                            <div className={styles.tabContent}>
                                <p>Тут будет чат</p>
                            </div>
                        </TabPanel>

                        <TabPanel header="Информация">
                            <div className={styles.tabContent}>
                                <p>Содержимое вкладки Информация</p>
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
                                <p>Содержимое вкладки Подзадачи</p>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </Sidebar>
        </div>
    );
};