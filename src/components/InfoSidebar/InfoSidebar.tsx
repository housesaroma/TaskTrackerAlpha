import {Sidebar} from 'primereact/sidebar';
import {TabPanel, TabView} from 'primereact/tabview';
import styles from './InfoSidebar.module.scss';

interface InfoSidebarProps {
    sidebarName: string;
    sidebarDescription: string;
    visible: boolean;
    onHide: () => void;
}

export const InfoSidebar = ({sidebarName, sidebarDescription, visible, onHide}: InfoSidebarProps) => {
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
                            <div className={styles.tabContent}>
                                <p>{sidebarDescription}</p>
                            </div>
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