import styles from './NavigationPanel.module.scss';
import {MenuItem} from "primereact/menuitem";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {PanelMenu} from "primereact/panelmenu";

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
            icon: 'pi pi-sitemap',
            items: [
                {
                    label: 'Chill Team',
                    command: () => navigate('/main')
                },
            ]
        },
        {
            label: 'Чаты',
            icon: 'pi pi-comments',
            command: () => navigate('/chats')
        },
    ];

    return (
        <div className={styles.navigationPanel}>
            <div className={styles.menuContainer}>
                <PanelMenu model={items} className={styles.menu}/>
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