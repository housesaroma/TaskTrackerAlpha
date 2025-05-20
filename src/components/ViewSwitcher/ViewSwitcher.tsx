import { Button } from 'primereact/button';
import {useNavigate, useParams} from 'react-router-dom';
import styles from './ViewSwitcher.module.scss';

const ViewSwitcher = () => {
    const navigate = useNavigate();
    const { projectId, boardId } = useParams<{ projectId: string; boardId: string }>();
    const currentProjectId = projectId || '1';
    const currentBoardId = boardId || '1';

    return (
        <div className={styles.viewSwitcher}>
            <Button
                label="Доска"
                icon="pi pi-table"
                onClick={() => navigate(`/${currentProjectId}/main/${currentBoardId}`)}
                className={styles.button}
            />
            <Button
                label="По Ганту"
                icon="pi pi-chart-bar"
                onClick={() => navigate(`/${currentProjectId}/gantt/${currentBoardId}`)}
                className={styles.button}
            />
            <Button
                label="Матрица Эйзенхауэра"
                icon="pi pi-th-large"
                onClick={() => navigate(`/${currentProjectId}/matrix/${currentBoardId}`)}
                className={styles.button}
            />
            <Button
                label="Метрики"
                icon="pi pi-chart-line"
                onClick={() => navigate(`/${currentProjectId}/metrics/${currentBoardId}`)}
                className={styles.button}
            />
        </div>
    );
};

export default ViewSwitcher;