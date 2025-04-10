import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import './styles/globals.scss'
import App from './App.tsx'
import './styles/typography.scss';
// import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';

import '@fontsource/poppins/300.css'; // Light
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/500.css'; // Medium
import '@fontsource/poppins/600.css'; // SemiBold
import '@fontsource/poppins/700.css'; // Bold

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)
