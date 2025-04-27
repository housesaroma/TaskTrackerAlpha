// validation.ts
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
export const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]{2,}$/ // Минимум 2 символа, только буквы, пробелы и дефисы

export interface ValidationErrors {
	fullName?: string
	email: string
	password: string
}

export const validateFullName = (name: string): string => {
	if (!name) return 'ФИО обязательно'
	if (!nameRegex.test(name))
		return 'ФИО должно содержать только буквы и быть не короче 2 символов'
	return ''
}

export const validateEmail = (email: string): string => {
	if (!email) return 'Email обязателен'
	if (!emailRegex.test(email)) return 'Введите корректный email'
	return ''
}

export const validatePassword = (password: string): string => {
	if (!password) return 'Пароль обязателен'
	if (!passwordRegex.test(password)) {
		return 'Пароль должен содержать минимум 8 символов, включая буквы и цифры'
	}
	return ''
}

export const validateForm = (
	email: string,
	password: string
): Omit<ValidationErrors, 'fullName'> => {
	return {
		email: validateEmail(email),
		password: validatePassword(password),
	}
}

export const validateRegisterForm = (
	fullName: string,
	email: string,
	password: string
): ValidationErrors => {
	return {
		fullName: validateFullName(fullName),
		email: validateEmail(email),
		password: validatePassword(password),
	}
}
