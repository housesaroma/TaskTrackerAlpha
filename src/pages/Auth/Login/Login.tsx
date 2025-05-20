import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import styles from '../Auth.module.scss';
import { Divider } from 'primereact/divider';
import { Link, useNavigate } from 'react-router-dom';
import {useRef, useState} from 'react';
import { Toast } from 'primereact/toast';

const Login = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Сбрасываем ошибку перед новым запросом
        console.log('Submitting form with:', formData);
        try {
            console.log('Dispatching login action...');
            // const result = await dispatch(login(formData.email, formData.password));

            // Проверяем, был ли успешный login (проверяем наличие токена в состоянии)
            const token = localStorage.getItem('token');
            if (token) {
                console.log('Login successful, navigating to /main');

                console.log('Login successful, token:', token);

                // Показываем токен в тосте (временное сообщение)
                toast.current?.show({
                    severity: 'success',
                    summary: 'Успешный вход',
                    detail: `Токен: ${token.substring(0, 15)}...`, // Показываем первые 15 символов
                    life: 5000
                });

                navigate('/');
            } else {
                console.log('Login failed, not navigating');
                setError('Неверные учетные данные'); // Устанавливаем сообщение об ошибке
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'Произошла ошибка при входе');
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
                <p className={styles.inputSubtitle}>Введите E-mail</p>
                <div className={styles.inputWrapper}>
                    <InputText
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="pochtа@mail.ru"
                        // type="email"
                        pt={{ root: { style: { borderRadius: '12px' } }}}
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
                        pt={{
                            input: { className: styles.passwordInput, style: { borderRadius: '12px' } },
                            root: { style: { borderRadius: '12px' } }
                        }}
                    />
                </div>

                <div className={styles.buttonWrapper}>
                    <Button
                        type="submit"
                        label="Войти"
                        pt={{ root: { style: { borderRadius: '12px' } }}}
                    />
                </div>
            </form>

            <Divider className={styles.divider} />

            <div className={styles.bottomWrapper}>
                <p className={styles.text}>Еще нет аккаунта?</p>
                <Link to="/register" className={styles.loginLink}>
                    Регистрация
                </Link>
            </div>
        </div>
    );
};

export default Login;