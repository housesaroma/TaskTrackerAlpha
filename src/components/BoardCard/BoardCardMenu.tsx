import {Menu} from 'primereact/menu';
import {ColorPicker} from 'primereact/colorpicker';
import {MenuItem} from 'primereact/menuitem';
import {Dropdown} from 'primereact/dropdown';
import {useRef, useState} from 'react';
import styles from "./BoardCard.module.scss";
import {IEpic} from '../../types/types';
import {EpicSidebar} from '../EpicSidebar/EpicSidebar';

interface BoardCardMenuProps {
    showMenu?:boolean,
    cardColor: string;
    onColorChange: (color: string) => void;
    onRename: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onEpicSelect?: (epicId: string | null) => void;
    epics: IEpic[];
    onAddEpic?: () => IEpic;
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
    const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
    const [selectedEpic, setSelectedEpic] = useState<IEpic | null>(null);
    const [showEpicSidebar, setShowEpicSidebar] = useState(false);

    const normalizeColor = (color: string) => {
        return color.startsWith('#') ? color.slice(1, 7) : color;
    };

    const epicOptions = [
        ...epics.map(epic => ({
            label: epic.title,
            value: epic.id,
            color: epic.color
        })),
        {
            label: 'Создать эпик',
            value: 'add',
            icon: 'pi pi-plus'
        }
    ];

    const epicItemTemplate = (option: any) => {
        if (option.value === 'add') {
            return (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="pi pi-plus" style={{ marginRight: 8 }} />
                    {option.label}
                </span>
            );
        }
        return (
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: option.color,
                    display: 'inline-block',
                    marginRight: 8,
                    border: '1px solid rgba(0,0,0,0.1)'
                }} />
                {option.label}
            </span>
        );
    };

    const handleEpicChange = (e: { value: string | null }) => {
        if (e.value === 'add') {
            const newEpic = onAddEpic?.();
            if (newEpic) {
                setSelectedEpicId(newEpic.id);
                setSelectedEpic(newEpic);
                setShowEpicSidebar(true);
                onEpicSelect?.(newEpic.id);
            }
        } else {
            setSelectedEpicId(e.value);
            const epic = e.value ? epics.find(epic => epic.id === e.value) || null : null;
            setSelectedEpic(epic);
            onEpicSelect?.(e.value); // Здесь передаем либо ID эпика, либо null
        }
    };

    const items: MenuItem[] = [
        {
            label: 'Эпик',
            icon: 'pi pi-flag',
            template: () => (
                <Dropdown
                    value={selectedEpicId}
                    options={epicOptions}
                    onChange={handleEpicChange}
                    placeholder="Выбрать эпик"
                    itemTemplate={epicItemTemplate}
                    showClear
                    style={{margin: '10px'}}
                />
            )
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
            {selectedEpic && (
                <EpicSidebar
                    epic={selectedEpic}
                    visible={showEpicSidebar}
                    onHide={() => setShowEpicSidebar(false)}
                    onUpdate={(updates) => {
                        // Можно добавить обновление эпика, если нужно
                    }}
                />
            )}
        </>
    );
};