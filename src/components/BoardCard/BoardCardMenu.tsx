import {Menu} from 'primereact/menu';
import {ColorPicker} from 'primereact/colorpicker';
import {MenuItem} from 'primereact/menuitem';
import {Dropdown} from 'primereact/dropdown';
import {useRef, useState} from 'react';
import styles from "./BoardCard.module.scss";
import {IEpic} from '../../types/types';
import {EpicSidebar} from '../EpicSidebar/EpicSidebar';

interface BoardCardMenuProps {
    cardColor: string;
    onColorChange: (color: string) => void;
    onRename: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onEpicSelect?: (epicId: string | null) => void;
    epics: IEpic[];
    onAddEpic?: () => void;
}

export const BoardCardMenu = ({
                                  cardColor,
                                  onColorChange,
                                  onDelete,
                                  onRename,
    onDuplicate,
    onEpicSelect,
    epics,
    onAddEpic
                              }: BoardCardMenuProps) => {
    const menuRef = useRef<Menu>(null);
    const [showEpicDropdown, setShowEpicDropdown] = useState(false);
    const [selectedEpic, setSelectedEpic] = useState<IEpic | null>(null);
    const [showEpicSidebar, setShowEpicSidebar] = useState(false);

    const normalizeColor = (color: string) => {
        return color.startsWith('#') ? color.slice(1, 7) : color;
    };

    const epicOptions = [
        ...epics.map(epic => ({
            label: epic.title,
            value: epic.id,
            style: { color: epic.color }
        })),
        {
            label: 'Добавить эпик',
            value: 'add',
            icon: 'pi pi-plus'
        }
    ];

    const handleEpicChange = (e: { value: string }) => {
        if (e.value === 'add') {
            onAddEpic?.();
        } else {
            const epic = epics.find(epic => epic.id === e.value);
            if (epic) {
                setSelectedEpic(epic);
                setShowEpicSidebar(true);
                onEpicSelect?.(epic.id);
            }
        }
        setShowEpicDropdown(false);
    };

    const handleEpicSelect = (e: React.MouseEvent) => {
        setShowEpicDropdown(true);
        menuRef.current?.toggle(e);
    };

    const items: MenuItem[] = [
                {
                    label: 'Выбрать эпик',
                    icon: 'pi pi-flag',
            command: (e) => handleEpicSelect(e.originalEvent as React.MouseEvent)
                },
                {
                    label: 'Переименовать',
                    icon: 'pi pi-pencil',
                    command: onRename
                },
                {
                    label: 'Дублировать',
                    icon: 'pi pi-copy',
                    command: onDuplicate
                },
                {
                    label: 'Цвет карточки',
                    icon: 'pi pi-palette',
                    template: () => (
                        <div className="p-2" style={{padding: '0 12px 12px 12px'}}>
                            <p>Цвет карточки</p>
                            <ColorPicker
                                value={normalizeColor(cardColor)}
                                onChange={(e) => onColorChange(`#${e.value}80`)}
                                format="hex"
                            />
                            <p>{cardColor}</p>
                        </div>
                    )
                },
                {
                    label: 'Убрать в архив',
                    icon: 'pi pi-box',
                    command: onDelete
        }
    ];

    return (
        <>
            <i
                className={`pi pi-ellipsis-v ${styles.titleIcon}`}
                onClick={(e) => menuRef.current?.toggle(e)}
                style={{ color: 'var(--text-color)' }}
            />
            <Menu model={items} popup ref={menuRef} id="card_menu"/>
            {showEpicDropdown && (
                <div className="p-dialog-mask p-component-overlay">
                    <div className="p-dialog p-component" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: '300px'
                    }}>
                        <div className="p-dialog-header">
                            <h3 className="p-dialog-title">Выберите эпик</h3>
                            <button 
                                className="p-dialog-header-icon p-dialog-header-close p-link" 
                                onClick={() => setShowEpicDropdown(false)}
                                aria-label="Close"
                            >
                                <span className="p-dialog-header-close-icon pi pi-times"></span>
                            </button>
                        </div>
                        <div className="p-dialog-content">
                            <Dropdown
                                value={null}
                                options={epicOptions}
                                onChange={handleEpicChange}
                                placeholder="Выберите эпик"
                                className="w-full"
                                showClear
                            />
                        </div>
                    </div>
                </div>
            )}
            {selectedEpic && (
                <EpicSidebar
                    epic={selectedEpic}
                    visible={showEpicSidebar}
                    onHide={() => setShowEpicSidebar(false)}
                />
            )}
        </>
    );
};