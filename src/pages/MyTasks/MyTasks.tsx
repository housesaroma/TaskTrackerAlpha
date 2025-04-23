import styles from './MyTasks.module.scss'
interface MyTasksProps {}

const MyTasks = ({}: MyTasksProps) => {
    return <div className={styles.name}>MyTasks</div>;
};

export default MyTasks;