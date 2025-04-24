import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { useRef } from 'react'
import styles from './taskPageHeader.module.scss'

function TaskPageHeader(){
	const menuRef = useRef<Menu>(null)

	const items = [
		{ label: 'Проект 1' },
		{ label: 'Проект 2' },
		{ label: 'Проект 3' },
	]

	return (
		<header className={styles.header}>
			<div className={styles.headerContent}>
				<h1 className={styles.headerTitle}>Мои задачи</h1>
				<div>
					<Menu model={items} popup ref={menuRef} />
					<Button
						label='Выбрать проект'
						icon='pi pi-chevron-down'
						onClick={e => menuRef.current?.toggle(e)}
						className={styles.projectButton}
					/>
				</div>
			</div>
		</header>
	)
}

export default TaskPageHeader
