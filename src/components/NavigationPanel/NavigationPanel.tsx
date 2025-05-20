import styles from './NavigationPanel.module.scss';
import {MenuItem} from "primereact/menuitem";
import {Button} from "primereact/button";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {PanelMenu} from "primereact/panelmenu";
import {useState} from "react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

interface NavigationPanelProps {
    onThemeToggle: () => void;
}

interface Project {
    id: number;
    name: string;
}

const NavigationPanel = ({onThemeToggle}: NavigationPanelProps) => {
    const navigate = useNavigate();
    const { projectId, boardId } = useParams<{ projectId?: string; boardId?: string }>();
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const [projects, setProjects] = useState<Project[]>([{ id: 1, name: 'Chill Team' }]);
    const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    const handleAddProject = () => {
        if (newProjectName.trim()) {
            const newProject = {
                id: projects.length + 1,
                name: newProjectName.trim()
            };
            setProjects([...projects, newProject]);
            setNewProjectName('');
            setShowAddProjectDialog(false);
            // Автоматически переходим в новый проект
            navigate(`/${newProject.id}/main/1`);
        }
    };

    const projectItems: MenuItem[] = projects.map(project => ({
        label: project.name,
        command: () => navigate(`/${project.id}/main/${boardId || '1'}`)
    }));

    projectItems.push({
        label: 'Добавить проект',
        icon: 'pi pi-plus',
        command: () => setShowAddProjectDialog(true)
    });

    const items: MenuItem[] = [
        {
            label: 'Мои задачи',
            icon: 'pi pi-check-square',
            command: () => navigate('/mytasks')
        },
        {
            label: 'Проекты',
            icon: 'pi pi-sitemap',
            items: projectItems
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

            <Dialog
                header="Новый проект"
                visible={showAddProjectDialog}
                onHide={() => setShowAddProjectDialog(false)}
                className={styles.dialog}
            >
                <div className={styles.dialogContent}>
                    <InputText
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Введите название проекта"
                        className={styles.input}
                    />
                    <Button
                        label="Создать"
                        onClick={handleAddProject}
                        disabled={!newProjectName.trim()}
                        className={styles.createButton}
                    />
                </div>
            </Dialog>

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