import { useState } from 'react';
import styles from './RegistrationPage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

function RegistrationPage() {

    const navigate = useNavigate();

    //registr

    const [username, setUserame] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');


    //login

    const [usernameLogin, setUserameLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    const onSubmitRegistration = () => {
        axios.post('http://localhost:8080/api/auth/register', {
            username: username,
            first_name: name,
            last_name: surname,
            email: mail,
            password: password,
            confirm_password: confirmPassword
        }).catch((err) => {
            setError(err.detail.message);
        })
        
        setMail('');
        setName('');
        setPassword('');
    }

    const onSubmitLogin = () => {
        axios.post('http://localhost:8080/api/auth/login', {
            username: usernameLogin,
            password: passwordLogin,
        }).then((res) => {
            localStorage.setItem('beererToken', res.data.token);
            navigate('/');
        }).catch((err) => {
            setError(err.detail.message);
        })
        setMail('');
        setName('');
        setPassword('');
    }

    return (
        <div className={styles.RegistrationPage}>
            <h2>Регистрация</h2>
            <div className={styles.RegistrationPage__form}>
                <input type='text' value={username} onChange={(e) => setUserame(e.target.value)} placeholder='Ник' />
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Имя' />
                <input type='text' value={surname} onChange={(e) => setSurname(e.target.value)} placeholder='Фамилия' />
                <input type='email' value={mail} onChange={(e) => setMail(e.target.value)} placeholder='Почта' />
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Пароль' />
                <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Повторите пароль' />
                <button onClick={onSubmitRegistration}>Отправить</button>
            </div>
            {error ? <p className={styles.RegistrationPage__error}>{error}</p> : null}

            <h2>Войти в аккаунт</h2>
            <div className={styles.RegistrationPage__form}>
                <input type='text' value={usernameLogin} onChange={(e) => setUserameLogin(e.target.value)} placeholder='Ник' />
                <input type='password' value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} placeholder='Пароль' />
                <button onClick={onSubmitLogin}>Отправить</button>
            </div>
            {error ? <p className={styles.RegistrationPage__error}>{error}</p> : null}
        </div>
    )
}

export default RegistrationPage;