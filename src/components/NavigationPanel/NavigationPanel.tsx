import styles from './NavigationPanel.module.scss';
import {MenuItem} from "primereact/menuitem";
import {Button} from "primereact/button";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {PanelMenu} from "primereact/panelmenu";
import {useState, useEffect, useRef} from "react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";
import {projectService} from "../../services/project.service";
import { IProject } from '../../types/types.ts';

interface NavigationPanelProps {
    onThemeToggle: () => void;
}

const NavigationPanel = ({onThemeToggle}: NavigationPanelProps) => {
    const navigate = useNavigate();
    const { projectId, boardId } = useParams<{ projectId?: string; boardId?: string }>();
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setIsLoading(true);
                const projectsData = await projectService.getProjects();
                setProjects(projectsData);
            } catch (error) {
                console.error('Failed to load projects:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Ошибка загрузки',
                    detail: error instanceof Error ? error.message : 'Не удалось загрузить проекты',
                    life: 5000
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();
    }, []);

    const handleAddProject = async () => {
        if (!newProjectName.trim()) return;

        try {
            const newProject = await projectService.createProject({
                title: newProjectName.trim(),
                description: newProjectDescription.trim() || 'Новый проект'
            });

            setProjects([...projects, newProject]);
            setNewProjectName('');
            setNewProjectDescription('');
            setShowAddProjectDialog(false);

            // Переходим в новый проект (первая доска первого проекта)
            const firstBoardId = newProject.boards?.[0]?.id || '1';
            navigate(`/${newProject.id}/main/${firstBoardId}`);

            toast.current?.show({
                severity: 'success',
                summary: 'Успех',
                detail: 'Проект успешно создан',
                life: 3000
            });
        } catch (error) {
            console.error('Failed to create project:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка создания',
                detail: error instanceof Error ? error.message : 'Не удалось создать проект',
                life: 5000
            });
        }
    };

    const projectItems: MenuItem[] = projects.map(project => ({
        label: project.title,
        command: () => navigate(`/${project.id}/main/${boardId || project.boards?.[0]?.id || '1'}`)
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
                <PanelMenu
                    model={items}
                    className={styles.menu}
                    disabled={isLoading}
                />
            </div>

            <Dialog
                header="Новый проект"
                visible={showAddProjectDialog}
                onHide={() => {
                    setShowAddProjectDialog(false);
                    setNewProjectName('');
                    setNewProjectDescription('');
                }}
                className={styles.dialog}
            >
                <div className={styles.dialogContent}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="projectName">Название проекта</label>
                        <InputText
                            id="projectName"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Введите название проекта"
                            className={styles.input}
                            autoFocus
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="projectDescription">Описание (необязательно)</label>
                        <InputText
                            id="projectDescription"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            placeholder="Введите описание проекта"
                            className={styles.input}
                        />
                    </div>

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

            <Toast ref={toast} />
        </div>
    );
};

export default NavigationPanel;