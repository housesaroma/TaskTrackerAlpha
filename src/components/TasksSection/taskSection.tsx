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
					style: { backgroundColor: 'var(--surface-ground)', border: 'none' },
				},
				header: {
					style: {
						backgroundColor: 'var(--surface-ground)',
						border: 'none',
						justifyContent: 'flex-start',
					},
				},
				content: {
					style: { backgroundColor: 'var(--surface-ground)', border: 'none' },
				}
			}}
		>
			<div className={styles.taskList}>{children}</div>
		</Panel>
	)
}

export default TaskSection
