import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {PrimeReactContext, PrimeReactProvider} from 'primereact/api';
import {useContext} from 'react';
import {Button} from 'primereact/button';
import Login from "./pages/Auth/Login/Login.tsx";
import Register from "./pages/Auth/Register/Register.tsx";
import Main from "./pages/Main/Main.tsx";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState, store, toggleTheme} from "./store.ts";
import "primeicons/primeicons.css";
import styles from './App.module.scss'

function AppContent() {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const {changeTheme} = useContext(PrimeReactContext);

    const handleThemeChange = () => {
        dispatch(toggleTheme());
        changeTheme!(
            `bootstrap4-${currentTheme}-purple`,
            `bootstrap4-${currentTheme === 'dark' ? 'light' : 'dark'}-purple`,
            'app-theme'
        );
    };

    return (
        <div>

            <Button onClick={handleThemeChange} className={styles.themeButton}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <i className={currentTheme === 'dark' ? 'pi pi-moon' : 'pi pi-sun'}></i>
                    Тема
                </div>
            </Button>

            <Routes>
                <Route path="/main" element={<Main/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={<Navigate to="/main"/>}/>
                <Route path="*" element={<div>404 Not Found</div>}/>
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Provider store={store}>
            <PrimeReactProvider>
                <BrowserRouter>
                    <AppContent/>
                </BrowserRouter>
            </PrimeReactProvider>
        </Provider>
    );
}

export default App;