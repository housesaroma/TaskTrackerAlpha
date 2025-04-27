import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import styles from "../Auth.module.scss";
import {Divider} from "primereact/divider";
import {Link, useNavigate} from "react-router-dom";


const Register = () => {

    const navigate = useNavigate();
    const handleRegister = () => {
        navigate('/main');
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Добро пожаловать</h1>
            <p className={styles.subtitle}>Сперва зарегистрируйтесь</p>

            <div className="p-fluid">
                <p className={styles.inputSubtitle}>Введите ФИО</p>
                <div className={styles.inputWrapper}>
                    <InputText placeholder="Иванов Иван Иванович" type={"text"} pt={{
                        root: {
                            style: {
                                borderRadius: '12px',

                            }
                        }
                    }}/>
                </div>

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
                    <Button onClick={handleRegister} label="Зарегистрироваться" pt={{root: {
                            style: {
                                borderRadius: '12px',

                            }
                        }}}/>
                </div>

                <Divider className={styles.divider}> </Divider>

                <div className={styles.bottomWrapper}>
                    <p className={styles.text}>Уже есть аккаунт?</p>
                    <Link to="/login" className={styles.loginLink}>
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;