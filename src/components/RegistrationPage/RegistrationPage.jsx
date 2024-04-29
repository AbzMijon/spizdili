import { useEffect, useState } from 'react';
import styles from './RegistrationPage.module.css';

function RegistrationPage() {

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify([
            {
                role: 'user',
                email: 'user@gmail.com',
                password: 'sosi'
            },
            {
                role: 'admin',
                email: 'admin@gmail.com',
                password: 'sosi'
            }
        ]))
    }, [])

    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = () => {
        setError('');
        const users = JSON.parse(localStorage.getItem('users'));
        const isExistUser = users?.find((user) => user.email === mail);
        if(isExistUser) {
            const isRightpass = isExistUser?.password === password;
            if(isRightpass) {
                localStorage.setItem('isAuth', 'true');
            }   else {
                setError('Пароль неверный');
            }
        }   else {
            setError('Не существующая почта');
        }
    }

    return (
        <div className={styles.RegistrationPage}>
            <h2>Регистрация</h2>
            <div className={styles.RegistrationPage__form}>
                <input type='email' value={mail} onChange={(e) => setMail(e.target.value)} />
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={onSubmit}>Send</button>
            </div>
            {error ? <p className={styles.RegistrationPage__error}>{error}</p> : null}
        </div>
    )
}

export default RegistrationPage;