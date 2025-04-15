import { Menu } from 'primereact/menu';
import { ColorPicker } from 'primereact/colorpicker';
import { MenuItem } from 'primereact/menuitem';
import { useRef } from 'react';
import styles from "./Column.module.scss";

interface ColumnMenuProps {
    columnColor: string;
    onRename: () => void;
    onColorChange: (color: string) => void;
    onDelete: () => void;
}

export const ColumnMenu = ({
                               columnColor,
                               onRename,
                               onColorChange,
                               onDelete
                           }: ColumnMenuProps) => {
    const menuRef = useRef<Menu>(null);

    // Функция для нормализации цвета (удаление # если есть)
    const normalizeColor = (color: string) => {
        return color.startsWith('#') ? color.slice(1,7) : color;
    };

    const items: MenuItem[] = [
        {
            label: 'Действия',
            items: [
                {
                    label: 'Переименовать',
                    icon: 'pi pi-pencil',
                    command: onRename
                },
                {
                    label: 'Цвет колонки',
                    icon: 'pi pi-palette',
                    template: () => (
                        <div className="p-2" style={{padding: '0 12px 12px 12px'}}>
                            <p>Цвет колонки</p>
                            <ColorPicker
                                value={normalizeColor(columnColor)}
                                onChange={(e) => onColorChange(`#${e.value}`)}
                                format="hex"
                            />
                        </div>
                    )
                },
                {
                    label: 'Удалить',
                    icon: 'pi pi-trash',
                    command: onDelete
                }
            ]
        }
    ];

    return (
        <>
            <i
                className={`pi pi-ellipsis-v cursor-pointer p-1 hover:bg-gray-200 rounded ${styles.titleIcon}`}
                onClick={(e) => menuRef.current?.toggle(e)}
            />
            <Menu model={items} popup ref={menuRef} id="column_menu" />
        </>
    );
};