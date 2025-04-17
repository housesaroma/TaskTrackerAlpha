import {useState} from 'react';
import {SelectButton} from 'primereact/selectbutton';
import styles from './SelectTaskType.module.scss';
import {Button} from "primereact/button";

interface SelectTaskTypeProps {
    onAdd: (type: 'task' | 'defect') => void;
}

export const SelectTaskType = ({onAdd}: SelectTaskTypeProps) => {
    const [taskType, setTaskType] = useState<'task' | 'defect'>('task');

    const options = [
        {label: 'Задачу', value: 'task'},
        {label: 'Дефект', value: 'defect'}
    ];

    const handleAddClick = () => {
        onAdd(taskType);
    };

    return (
        <div className={styles.wrapper}>
            <Button
                className={'p-button-text'}
                icon={'pi pi-plus'}
                onClick={handleAddClick}
            >
                Добавить
            </Button>
            <SelectButton
                className={styles.selectButton}
                value={taskType}
                options={options}
                optionLabel="label"
                allowEmpty={false}
                onChange={(e) => setTaskType(e.value)}
            />
        </div>
    );
};