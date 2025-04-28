import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { useRef } from 'react'
import styles from './taskPageHeader.module.scss'
import lgn from './data/eject.svg'
import folder from './data/folder-open.svg'

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
				<img src={lgn} alt='Логотип' />
				<h1 className={styles.headerTitle}>Мои задачи</h1>
				<div>
					<Menu model={items} popup ref={menuRef} />
					<Button
						onClick={e => menuRef.current?.toggle(e)}
						className={styles.projectButton}
						icon='pi pi-chevron-down'
						iconPos='right'
					>
						<span className={styles.buttonContent}>
							<span>Выбрать проект</span>
							<img src={folder} className={styles.folderIcon} alt='Папка' />
						</span>
					</Button>
				</div>
			</div>
		</header>
	)
}

export default TaskPageHeader
