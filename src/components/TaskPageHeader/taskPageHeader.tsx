import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { useRef } from 'react'
import styles from './taskPageHeader.module.scss'

function TaskPageHeader() {
	const menuRef = useRef<Menu>(null)

	const items = [
		{ label: 'Проект 1' },
		{ label: 'Проект 2' },
		{ label: 'Проект 3' },
	]

	return (
		<header className={styles.header}>
			<div className={styles.headerContent}>
				<i className='pi pi-eject'/>
				<h1 className={styles.headerTitle}>Мои задачи</h1>
				<div>
					<Menu model={items} popup ref={menuRef} />
					<Button
						onClick={e => menuRef.current?.toggle(e)}
						className={styles.projectButton}
						icon='pi pi-folder-open'
					>
						<div className={styles.buttonContent}>
							<span>Выбрать проект</span>
							<i className='pi pi-chevron-down'></i>
						</div>
					</Button>
				</div>
			</div>
		</header>
	)
}

export default TaskPageHeader
