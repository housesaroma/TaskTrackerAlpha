import {FC, ReactNode} from 'react';
import NavigationPanel from "../NavigationPanel/NavigationPanel.tsx";
import Header from "../Header/Header.tsx";
import styles from './AuthenticatedLayout.module.scss';

interface AuthenticatedLayoutProps {
    children: ReactNode;
    onThemeToggle: () => void;
}

const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = ({children, onThemeToggle}) => {

    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <Header/></div>
            <div className={styles.navPanel}>
                <NavigationPanel onThemeToggle={onThemeToggle}/>
            </div>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};

export default AuthenticatedLayout;