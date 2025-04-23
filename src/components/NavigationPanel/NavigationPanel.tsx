import styles from './NavigationPanel.module.scss';
import {MenuItem} from "primereact/menuitem";
import {Menu} from "primereact/menu";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts";

interface NavigationPanelProps {
    onThemeToggle: () => void;
}

const NavigationPanel = ({onThemeToggle}: NavigationPanelProps) => {
    const navigate = useNavigate();
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

    const items: MenuItem[] = [
        {
            label: 'Мои задачи',
            icon: 'pi pi-check-square',
            command: () => navigate('/mytasks')
        },
        {
            label: 'Проекты',
            icon: 'pi pi-th-large',
            command: () => navigate('/main')
        },
        {
            label: 'Чаты',
            icon: 'pi pi-comments',
            command: () => navigate('/chats')
        },
        {
            label: 'Метрики',
            icon: 'pi pi-chart-line',
            command: () => navigate('/metrics')
        },
    ];

    return (
        <div className={styles.navigationPanel}>
            <div className={styles.menuContainer}>
                <Menu model={items} className={styles.menu}/>
            </div>
            <div className={styles.themeToggle}>
                <Button onClick={onThemeToggle} className={styles.themeButton}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <i className={currentTheme === 'dark' ? 'pi pi-moon' : 'pi pi-sun'}/>
                        Тема
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default NavigationPanel;