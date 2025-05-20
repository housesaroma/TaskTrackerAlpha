import {FC, ReactNode} from 'react';
import NavigationPanel from "../NavigationPanel/NavigationPanel.tsx";
import Header from "../Header/Header.tsx";
import styles from './AuthenticatedLayout.module.scss';
import ViewSwitcher from '../ViewSwitcher/ViewSwitcher.tsx';

interface AuthenticatedLayoutProps {
    children: ReactNode;
    onThemeToggle: () => void;
    showViewSwitcher?: boolean;
}

const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = ({children, onThemeToggle, showViewSwitcher = true}) => {
    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <Header/></div>
            <div className={styles.navPanel}>
                <NavigationPanel onThemeToggle={onThemeToggle}/>
            </div>
            <main className={styles.content}>
                {showViewSwitcher && <ViewSwitcher />}
                {children}
            </main>
        </div>
    );
};

export default AuthenticatedLayout;