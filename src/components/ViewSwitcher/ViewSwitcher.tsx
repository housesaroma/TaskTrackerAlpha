import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import styles from './ViewSwitcher.module.scss';

const ViewSwitcher = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.viewSwitcher}>
            <Button
                label="Доска"
                icon="pi pi-table"
                onClick={() => navigate('/main')}
                className={styles.button}
            />
            <Button
                label="По Ганту"
                icon="pi pi-chart-bar"
                onClick={() => navigate('/gantt')}
                className={styles.button}
            />
            <Button
                label="Матрица Эйзенхауэра"
                icon="pi pi-th-large"
                onClick={() => navigate('/matrix')}
                className={styles.button}
            />
            <Button
                label="Метрики"
                icon="pi pi-chart-line"
                onClick={() => navigate('/metrics')}
                className={styles.button}
            />
        </div>
    );
};

export default ViewSwitcher;