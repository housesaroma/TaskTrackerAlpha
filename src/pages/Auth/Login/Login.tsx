import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import styles from "../Auth.module.scss";
import {Divider} from "primereact/divider";
import {Link, useNavigate} from "react-router-dom";


const Register = () => {

    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/main');
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>С возвращением</h1>
            <p className={styles.subtitle}>Войдите чтобы продолжить</p>

            <div className="p-fluid">
                <p className={styles.inputSubtitle}>Введите E-mail</p>
                <div className={styles.inputWrapper}>
                    <InputText placeholder="pochtа@mail.ru" type={"email"} pt={{
                        root: {
                            style: {
                                borderRadius: '12px',

                            }
                        }
                    }}/>
                </div>

                <p className={styles.inputSubtitle}>Введите пароль</p>
                <div className={styles.inputWrapper}>
                    <Password placeholder="Пароль" toggleMask feedback={false} type={"password"}
                              pt={{
                                  input: {className: styles.passwordInput, style: {borderRadius: '12px'}},
                                  showIcon: {className: styles.showIcon},
                                  hideIcon: {className: styles.hideIcon},
                                  root: {
                                      style: {
                                          borderRadius: '12px',

                                      }
                                  }
                              }}/>
                </div>


                <div className={styles.buttonWrapper}>
                    <Button onClick={handleLogin} label="Войти" pt={{
                        root: {
                            style: {
                                borderRadius: '12px',

                            }
                        }
                    }}/>
                </div>

                <Divider className={styles.divider}> </Divider>

                <div className={styles.bottomWrapper}>
                    <p className={styles.text}>Еще нет аккаунта?</p>
                    <Link to="/register" className={styles.loginLink}>
                        Регистрация
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;