import {Routes, Route, Link, Navigate, BrowserRouter} from 'react-router-dom';
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Main from "./pages/Main.tsx";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/login">Login</Link> |
                <Link to="/register">Register</Link>
            </nav>

            <Routes>
                <Route path="/main" element={<Main/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={<Navigate to="/main"/>}/>
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;