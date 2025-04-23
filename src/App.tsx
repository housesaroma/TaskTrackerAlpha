import {BrowserRouter, Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {PrimeReactContext, PrimeReactProvider} from 'primereact/api';
import {useContext} from 'react';
import Login from "./pages/Auth/Login/Login.tsx";
import Register from "./pages/Auth/Register/Register.tsx";
import Main from "./pages/Main/Main.tsx";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState, store, toggleTheme} from "./store.ts";
import "primeicons/primeicons.css";
import Chats from "./pages/Chats/Chats.tsx";
import Metrics from "./pages/Metrics/Metrics.tsx";
import MyTasks from "./pages/MyTasks/MyTasks.tsx";
import AuthenticatedLayout from "./components/AuthenticatedLayout/AuthenticatedLayout.tsx";

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
        <>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={<Navigate to="/main"/>}/>

                <Route element={
                    <AuthenticatedLayout onThemeToggle={handleThemeChange}>
                        <Outlet />
                    </AuthenticatedLayout>
                }>
                    <Route path="/main" element={<Main/>}/>
                    <Route path="/chats" element={<Chats/>}/>
                    <Route path="/metrics" element={<Metrics/>}/>
                    <Route path="/mytasks" element={<MyTasks/>}/>
                </Route>

                <Route path="*" element={<div>404 Not Found</div>}/>
            </Routes>

        </>
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