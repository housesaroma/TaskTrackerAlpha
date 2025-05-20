import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from 'react-router-dom'
import { PrimeReactContext, PrimeReactProvider } from 'primereact/api'
import { useContext } from 'react'
import Login from './pages/Auth/Login/Login.tsx'
import Register from './pages/Auth/Register/Register.tsx'
import Main from './pages/Main/Main.tsx'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { RootState, store, toggleTheme } from './store.ts'
import 'primeicons/primeicons.css'
import Chats from './pages/Chats/Chats.tsx'
import Metrics from './pages/Metrics/Metrics.tsx'
import MyTasks from './pages/MyTasks/MyTasks.tsx'
import AuthenticatedLayout from './components/AuthenticatedLayout/AuthenticatedLayout.tsx'
import EisenhowerMatrix from './components/Matrix/matrix.tsx'
import GanttChart from "./components/GanttChart/GanttChart.tsx";

function AppContent() {
	const dispatch = useDispatch()
	const currentTheme = useSelector(
		(state: RootState) => state.theme.currentTheme
	)
	const { changeTheme } = useContext(PrimeReactContext)

	const handleThemeChange = () => {
		dispatch(toggleTheme())
		changeTheme!(
			`bootstrap4-${currentTheme}-purple`,
			`bootstrap4-${currentTheme === 'dark' ? 'light' : 'dark'}-purple`,
			'app-theme'
		)
	}

	return (
		<>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/' element={<Navigate to='/1/main/1' replace />} />

				{/* Общий layout для всех страниц */}
				<Route element={
					<AuthenticatedLayout onThemeToggle={handleThemeChange}>
						<Outlet />
					</AuthenticatedLayout>
				}>
					{/* Основные маршруты с проектами */}
					<Route path='/:projectId/main/:boardId' element={<Main />} />
					<Route path='/chats' element={<Chats />} />
					<Route path='/mytasks' element={<MyTasks />} />

					{/* Маршруты, привязанные к проекту и доске */}
					<Route path='/:projectId/gantt/:boardId' element={<GanttChart />} />
					<Route path='/:projectId/matrix/:boardId' element={<EisenhowerMatrix />} />
					<Route path='/:projectId/metrics/:boardId' element={<Metrics />} />
				</Route>

				<Route path='*' element={<div>404 Not Found</div>} />
			</Routes>
		</>
	)
}

function App() {
	return (
		<Provider store={store}>
			<PrimeReactProvider>
				<BrowserRouter>
					<AppContent />
				</BrowserRouter>
			</PrimeReactProvider>
		</Provider>
	)
}

export default App
