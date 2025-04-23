import {Menu} from 'primereact/menu';
import {ColorPicker} from 'primereact/colorpicker';
import {MenuItem} from 'primereact/menuitem';
import {useRef} from 'react';
import styles from "./BoardCard.module.scss";

interface BoardCardMenuProps {
    cardColor: string;
    onColorChange: (color: string) => void;
    onRename: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

export const BoardCardMenu = ({
                                  cardColor,
                                  onColorChange,
                                  onDelete,
                                  onRename,
                                  onDuplicate
                              }: BoardCardMenuProps) => {
    const menuRef = useRef<Menu>(null);

    const normalizeColor = (color: string) => {
        return color.startsWith('#') ? color.slice(1, 7) : color;
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
            ]
        }
    ];

    return (
        <>
            <i
                className={`pi pi-ellipsis-v  ${styles.titleIcon}`}
                onClick={(e) => menuRef.current?.toggle(e)}
            />
            <Menu model={items} popup ref={menuRef} id="card_menu"/>
        </>
    );
};