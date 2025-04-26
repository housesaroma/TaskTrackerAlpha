import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import styles from '../Auth.module.scss'
import { Divider } from 'primereact/divider'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Message } from 'primereact/message'
import {
	validateEmail,
	validatePassword,
	validateForm,
	ValidationErrors,
} from '../Validation'

const Login = () => {
	// Состояния для полей формы и ошибок
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<ValidationErrors>({
		email: '',
		password: '',
	})

	// Обработчики валидации полей
	const handleEmailBlur = () => {
		setErrors(prev => ({ ...prev, email: validateEmail(email) }))
	}

	const handlePasswordBlur = () => {
		setErrors(prev => ({ ...prev, password: validatePassword(password) }))
	}

	// Обработчик отправки формы
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const validationErrors = validateForm(email, password)
		setErrors(validationErrors)

		if (!validationErrors.email && !validationErrors.password) {
			// Здесь можно выполнить вход
			console.log('Форма валидна, выполняем вход', { email, password })
			// Дальнейшая логика входа...
		}
	}

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>С возвращением</h1>
			<p className={styles.subtitle}>Войдите чтобы продолжить</p>

			<div className='p-fluid'>
				<form onSubmit={handleSubmit}>
					<p className={styles.inputSubtitle}>Введите E-mail</p>
					<div className={styles.inputWrapper}>
						<InputText
							placeholder='pochtа@mail.ru'
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							onBlur={handleEmailBlur}
							pt={{
								root: {
									style: {
										borderRadius: '12px',
									},
								},
							}}
						/>
						{errors.email && (
							<Message
								severity='error'
								text={errors.email}
								className={styles.errorMessage}
							/>
						)}
					</div>

					<p className={styles.inputSubtitle}>Введите пароль</p>
					<div className={styles.inputWrapper}>
						<Password
							placeholder='Пароль'
							toggleMask
							feedback={false}
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							onBlur={handlePasswordBlur}
							pt={{
								input: {
									className: styles.passwordInput,
									style: { borderRadius: '12px' },
								},
								showIcon: { className: styles.showIcon },
								hideIcon: { className: styles.hideIcon },
								root: {
									style: {
										borderRadius: '12px',
									},
								},
							}}
						/>
						{errors.password && (
							<Message
								severity='error'
								text={errors.password}
								className={styles.errorMessage}
							/>
						)}
					</div>

					<div className={styles.buttonWrapper}>
						<Button
							label='Войти'
							type='submit'
							pt={{
								root: {
									style: {
										borderRadius: '12px',
										color: 'var(--surface-900)',
										backgroundColor: 'var(--surface-500)',
										borderColor: 'var(--surface-500)',
									},
								},
							}}
						/>
					</div>
				</form>

				<Divider className={styles.divider}> </Divider>

				<div className={styles.bottomWrapper}>
					<p className={styles.text}>Еще нет аккаунта?</p>
					<Link to='/register' className={styles.loginLink}>
						Регистрация
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Login
