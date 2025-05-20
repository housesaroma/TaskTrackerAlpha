import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import styles from './taskPageHeader.module.scss'

interface TaskPageHeaderProps {
	onSearchChange: (value: string) => void
	onDateFilterChange: (type: 'created' | 'deadline' | null) => void
	activeFilter: 'created' | 'deadline' | null
}

function TaskPageHeader({
	onSearchChange,
	onDateFilterChange,
	activeFilter,
}: TaskPageHeaderProps) {
	const menuRef = useRef<Menu>(null)
	const opRef = useRef<OverlayPanel>(null)
	const [searchValue, setSearchValue] = useState('')

	const items = [
		{ label: 'Проект 1' },
		{ label: 'Проект 2' },
		{ label: 'Проект 3' },
	]

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchValue(value)
		onSearchChange(value)
	}

	const handleFilterSelect = (type: 'created' | 'deadline') => {
		const newFilter = activeFilter === type ? null : type
		onDateFilterChange(newFilter)
		opRef.current?.hide()
	}

	const resetFilters = () => {
		onDateFilterChange(null)
		setSearchValue('')
		onSearchChange('')
	}

	return (
		<header className={styles.header}>
			<div className={styles.headerContent}>
				<div className={styles.headerLeft}>
					<i className='pi pi-eject' />
					<h1 className={styles.headerTitle}>Мои задачи</h1>
				</div>

				<div className={styles.controls}>
					<div>
						<span>
							<InputText
								value={searchValue}
								onChange={handleSearchChange}
								placeholder='Поиск по названию'
								className={styles.search}
							/>
						</span>
					</div>

					<div className={styles.filterButtons}>
						<Button
							label='Фильтр'
							icon='pi pi-filter'
							className={styles.buttonFilter}
							onClick={e => opRef.current?.toggle(e)}
						/>
						{activeFilter && (
							<Button
								className={styles.escFilt}
								icon='pi pi-times'
								onClick={resetFilters}
								tooltip='Сбросить фильтры'
							/>
						)}
					</div>

					<OverlayPanel ref={opRef} dismissable>
						<div style={{ display: 'flex', gap: '0.5rem' }}>
							<Button
								style={{ backgroundColor: 'var(--surface-200)', borderStyle:'none',color: 'var(--surface-900)', boxShadow:'none' }}
								label='По дате начала'
								onClick={() => handleFilterSelect('created')}
							/>
							<Button
								style={{ backgroundColor: 'var(--surface-200)', borderStyle:'none',color: 'var(--surface-900)', boxShadow:'none' }}
								label='По дедлайну'
								onClick={() => handleFilterSelect('deadline')}
							/>
						</div>
					</OverlayPanel>

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
