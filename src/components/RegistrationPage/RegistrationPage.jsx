import { useState } from 'react';
import styles from './RegistrationPage.module.css';
import axios from 'axios';

function RegistrationPage() {

    const [mail, setMail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmitRegistration = () => {
        axios.post('YOUR URL', {
            name: name,
            email: mail,
            password: password,
        }).then((res) => {
            localStorage.setItem('beererToken', res.data);
        }).catch((err) => {
            setError(err.detail.message);
        })
        setMail('');
        setName('');
        setPassword('');
    }

    const onSubmitLogin = () => {
        axios.post('YOUR URL', {
            name: name,
            email: mail,
            password: password,
        }).then((res) => {
            localStorage.setItem('beererToken', res.data);
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
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                <input type='email' value={mail} onChange={(e) => setMail(e.target.value)} />
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={onSubmitRegistration}>Send</button>
            </div>
            {error ? <p className={styles.RegistrationPage__error}>{error}</p> : null}

            <h2>Войти в аккаунт</h2>
            <div className={styles.RegistrationPage__form}>
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                <input type='email' value={mail} onChange={(e) => setMail(e.target.value)} />
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={onSubmitLogin}>Send</button>
            </div>
            {error ? <p className={styles.RegistrationPage__error}>{error}</p> : null}
        </div>
    )
}

export default RegistrationPage;