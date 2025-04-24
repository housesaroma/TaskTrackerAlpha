import { Panel } from 'primereact/panel'
import { ReactNode, Children } from 'react'
import styles from './taskSection.module.scss'

interface TaskSectionProps {
	title: string
	children: ReactNode
	defaultCollapsed?: boolean
}

const TaskSection = ({title,children, defaultCollapsed = false}: TaskSectionProps) => {
	// Вычисляем количество задач
	const taskCount = Children.count(children)

	const header = (
		<div className={styles.panelHeader}>
			<span className={styles.sectionTitle}>{title}</span>
			<span className={styles.taskCount}>{taskCount}</span>
		</div>
	)

	return (
		<Panel
			header={header}
			toggleable
			collapsed={defaultCollapsed}
			className={styles.taskPanel}
			pt={{
				root: {
					style: { backgroundColor: '#CCCCCC', border: '1px solid #CCCCCC' },
				},
				header: {
					style: { backgroundColor: '#CCCCCC', border: '1px solid #CCCCCC' },
				},
				content: {
					style: { backgroundColor: '#CCCCCC', border: '1px solid #CCCCCC' },
				},
			}}
		>
			<div className={styles.taskList}>{children}</div>
		</Panel>
	)
}

export default TaskSection
