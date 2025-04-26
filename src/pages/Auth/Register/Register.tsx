import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import styles from '../Auth.module.scss'
import { Divider } from 'primereact/divider'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Message } from 'primereact/message'
import {
	validateFullName,
	validateEmail,
	validatePassword,
	validateRegisterForm,
	ValidationErrors,
} from '../Validation'

const Register = () => {
	// Состояния для полей формы и ошибок
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<ValidationErrors>({
		fullName: '',
		email: '',
		password: '',
	})

	// Обработчики валидации полей
	const handleFullNameBlur = () => {
		setErrors(prev => ({ ...prev, fullName: validateFullName(fullName) }))
	}

	const handleEmailBlur = () => {
		setErrors(prev => ({ ...prev, email: validateEmail(email) }))
	}

	const handlePasswordBlur = () => {
		setErrors(prev => ({ ...prev, password: validatePassword(password) }))
	}

	// Обработчик отправки формы
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const validationErrors = validateRegisterForm(fullName, email, password)
		setErrors(validationErrors)

		if (
			!validationErrors.fullName &&
			!validationErrors.email &&
			!validationErrors.password
		) {
			// Дальнейшая логика регистрации
			console.log('Форма валидна, выполняем регистрацию', {
				fullName,
				email,
				password,
			})
		}
	}

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>Добро пожаловать</h1>
			<p className={styles.subtitle}>Сперва зарегистрируйтесь</p>

			<div className='p-fluid'>
				<form onSubmit={handleSubmit}>
					<p className={styles.inputSubtitle}>Введите ФИО</p>
					<div className={styles.inputWrapper}>
						<InputText
							placeholder='Иванов Иван Иванович'
							type='text'
							value={fullName}
							onChange={e => setFullName(e.target.value)}
							onBlur={handleFullNameBlur}
							pt={{
								root: {
									style: {
										borderRadius: '12px',
									},
								},
							}}
						/>
						{errors.fullName && (
							<Message
								severity='error'
								text={errors.fullName}
								className={styles.errorMessage}
							/>
						)}
					</div>

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
							label='Зарегистрироваться'
							type='submit'
							pt={{
								root: {
									style: {
										borderRadius: '12px',
										color: 'var(--surface-900)',
										backgroundColor: 'var(--surface-500)',
										borderColor: 'var(--surface-500)',
									},
                                }
							}}
						/>
					</div>
				</form>

				<Divider className={styles.divider}> </Divider>

				<div className={styles.bottomWrapper}>
					<p className={styles.text}>Уже есть аккаунт?</p>
					<Link to='/login' className={styles.loginLink}>
						Войти
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Register
