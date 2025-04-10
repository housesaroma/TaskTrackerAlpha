import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {PrimeReactContext, PrimeReactProvider} from 'primereact/api';
import {useContext, useState} from 'react';
import {Button} from 'primereact/button';
import Login from "./pages/Auth/Login/Login.tsx";
import Register from "./pages/Auth/Register/Register.tsx";
import Main from "./pages/Main.tsx";

function AppContent() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const {changeTheme} = useContext(PrimeReactContext);

    const changeMyTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        changeTheme!(
            `bootstrap4-${theme}-purple`,
            `bootstrap4-${newTheme}-purple`,
            'app-theme',
            () => setTheme(newTheme)
        );
    };

    return (
        <>
            <Button
                onClick={changeMyTheme}
                // icon={theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'}
                label={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            />

            <Routes>
                <Route path="/main" element={<Main/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={<Navigate to="/main"/>}/>
                <Route path="*" element={<div>404 Not Found</div>}/>
            </Routes>
        </>
    );
}

function App() {
    return (
        <PrimeReactProvider>
            <BrowserRouter>
                <AppContent/>
            </BrowserRouter>
        </PrimeReactProvider>
    );
}

export default App;