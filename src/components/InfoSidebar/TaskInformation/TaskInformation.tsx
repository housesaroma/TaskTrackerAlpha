import { Accordion, AccordionTab } from 'primereact/accordion';
import styles from './TaskInformation.module.scss';

export const TaskInformation = () => {
    return (
        <div className={styles.taskInformation}>
            <Accordion multiple>
                <AccordionTab header="Информация о задаче">
                    <div className={styles.accordionContent}>
                        {/* Content will be added later */}
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