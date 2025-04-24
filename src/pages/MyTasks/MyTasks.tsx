import TaskPageHeader from '../../components/TaskPageHeader/taskPageHeader.tsx'
import TaskSection from '../../components/TasksSection/taskSection.tsx'
import TaskItem from '../../components/TaskItem/taskItem.tsx'
import styles from './MyTasks.module.scss'

interface ITask {
    id: number
    title: string
    completed: boolean
    startDate?: string
    endDate?: string
}

interface ITaskSectionData {
    title: string
    tasks: ITask[]
}

const TaskPage = () => {
    // Тестовые данные задач с дедлайнами в формате dd.mm.yy
    const sectionsData: ITaskSectionData[] = [
        {
            title: 'Важные задачи',
            tasks: [
                {id: 1, title: 'Задача', completed: false, startDate: '17.04.23', endDate: '21.04.23'},
            ],
        },
        {
            title: 'Текущие задачи',
            tasks: [
                { id: 2, title: 'Сделать дизайн сайта (подробнее в комментариях макета)', completed: false, startDate: '30.03.23', endDate: '04.04.23'},
                { id: 2, title: 'Сделать тест 1', completed: false, startDate: '23.04.25', endDate: '30.04.25'},
                { id: 2, title: 'Сделать тест 2', completed: false, startDate: '20.04.25', endDate: '24.04.25'},
            ],
        },
        {
            title: 'Выполненные задачи',
            tasks: [
                { id: 3, title: 'Создать UI-кит и шаблон сайта с референсами', completed: true, startDate: '10.11.22', endDate: '15.11.22'},
                { id: 4, title: 'Создание рабочего прототипа в фигме', completed: true, startDate: '01.10.22', endDate: '14.10.22'}
            ],
        },
    ]

    return (
        <div className={styles.taskPage}>
            <TaskPageHeader />

            <div className={styles.taskContainer}>
                {/* Это тестовая версия, если что, то можно поставить
                 3 компонента секций и уже для каждого делать запрос */}
                {sectionsData.map(section => (
                    <TaskSection key={section.title} title={section.title}>
                        {section.tasks.map(task => (
                            <TaskItem
                                key={task.id}
                                title={task.title}
                                completed={task.completed}
                                startDate={task.startDate}
                                endDate={task.endDate}
                            />
                        ))}
                    </TaskSection>
                ))}
            </div>
        </div>
    )
}

export default TaskPage
