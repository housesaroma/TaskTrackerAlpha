import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import styles from '../Auth.module.scss';
import { Divider } from 'primereact/divider';
import { Link, useNavigate } from 'react-router-dom';
import {useRef, useState} from 'react';
import { Toast } from 'primereact/toast';
import { authService } from '../../../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация полей
        if (!formData.username.trim()) {
            setError('Введите имя пользователя');
            return;
        }

        if (!formData.password) {
            setError('Введите пароль');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const { token } = await authService.login({
                username: formData.username,
                password: formData.password
            });

            localStorage.setItem('token', token);

            toast.current?.show({
                severity: 'success',
                summary: 'Успешный вход',
                detail: 'Добро пожаловать!',
                life: 3000
            });

            navigate('/');
        } catch (error) {
            console.error('Login error:', error);

            // Более дружелюбные сообщения об ошибках
            let errorMessage = 'Произошла ошибка при входе';

            if (error instanceof Error) {
                errorMessage = error.message;

                // Дополнительная обработка конкретных ошибок
                if (error.message.includes('Нет соединения')) {
                    errorMessage = 'Нет соединения с сервером. Проверьте интернет-соединение.';
                }
            }

            setError(errorMessage);
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка входа',
                detail: errorMessage,
                life: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>С возвращением</h1>
            <p className={styles.subtitle}>Войдите чтобы продолжить</p>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} className="p-fluid">
                <p className={styles.inputSubtitle}>Имя пользователя</p>
                <div className={styles.inputWrapper}>
                    <InputText
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Имя"
                        pt={{ root: { style: { borderRadius: '12px' } }}}
                        disabled={isSubmitting}
                    />
                </div>

                <p className={styles.inputSubtitle}>Введите пароль</p>
                <div className={styles.inputWrapper}>
                    <Password
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Пароль"
                        toggleMask
                        feedback={false}
                        disabled={isSubmitting}
                        pt={{
                            input: { className: styles.passwordInput, style: { borderRadius: '12px' } },
                            root: { style: { borderRadius: '12px' } }
                        }}
                    />
                </div>

                <div className={styles.buttonWrapper}>
                    <Button
                        type="submit"
                        label={isSubmitting ? 'Вход...' : 'Войти'}
                        disabled={isSubmitting}
                        pt={{ root: { style: { borderRadius: '12px' } }}}
                    />
                </div>
            </form>

            {/*<Divider className={styles.divider} />*/}

            {/*<div className={styles.bottomWrapper}>*/}
            {/*    <p className={styles.text}>Еще нет аккаунта?</p>*/}
            {/*    <Link to="/register" className={styles.loginLink}>*/}
            {/*        Регистрация*/}
            {/*    </Link>*/}
            {/*</div>*/}

            <Toast ref={toast} />
        </div>
    );
};

export default Login;