import { Accordion, AccordionTab } from 'primereact/accordion';
import styles from './TaskInformation.module.scss';
import { TaskInfoSection } from './TaskInfoSection';

interface TaskInformationProps {
    cardId: string;
    startDate?: string;
    endDate?: string;
    priority?: 'Важно' | 'Средне' | 'Незначительно';
    createdAt?: string;
    onDateChange: (cardId: string, startDate: string, endDate: string) => void;
    onPriorityChange: (cardId: string, priority: 'Важно' | 'Средне' | 'Незначительно') => void;
}

export const TaskInformation = ({ 
    cardId, 
    startDate, 
    endDate, 
    priority,
    createdAt,
    onDateChange,
    onPriorityChange 
}: TaskInformationProps) => {
    return (
        <div className={styles.taskInformation}>
            <Accordion multiple>
                <AccordionTab header="Информация о задаче">
                    <div className={styles.accordionContent}>
                        <TaskInfoSection
                            cardId={cardId}
                            startDate={startDate}
                            endDate={endDate}
                            priority={priority}
                            createdAt={createdAt}
                            onDateChange={onDateChange}
                            onPriorityChange={onPriorityChange}
                        />
                    </div>
                </AccordionTab>
                
                <AccordionTab header="Кто видит задачу">
                    <div className={styles.accordionContent}>
                        {/* Content will be added later */}
                    </div>
                </AccordionTab>
                
                <AccordionTab header="Привязанные задачи">
                    <div className={styles.accordionContent}>
                        {/* Content will be added later */}
                    </div>
                </AccordionTab>
                
                <AccordionTab header="Действия над задачей">
                    <div className={styles.accordionContent}>
                        {/* Content will be added later */}
                    </div>
                </AccordionTab>
            </Accordion>
        </div>
    );
}; 