import { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Schedule from '../schedule/Schedule';

function ProfilePage() {

    const token = localStorage.getItem('beererToken');

    const [userData, setUserData] = useState(null);
    const [trainers, setTrainers] = useState(null);
    const [openShedule, setOpenShedule] = useState(false);
    const navigate = useNavigate();

    const fetchData = () => {
        axios.get('http://localhost:8080/api/v1/clients/info', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            setUserData(res?.data);
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('beererToken');
        navigate('/registration');
    }

    const handleSelectTrainer = () => {
        axios.get(`http://localhost:8080/api/v1/trainers`).then((res) => {
            if(res?.data) {
                setTrainers(res?.data);
            }
        })
    };

    const handleChangeTrainer = (id) => {
        axios.put(`http://localhost:8080/api/v1/clients/${id}/trainers`, {},  {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            console.log('res', res);
            fetchData();
            setTrainers(null);
        })
    };

    const handleSelectShedule = () => {
        setOpenShedule(true);
    };


    const [trainerUsers, setTrainerUsers] = useState(null);

    const handleChoiseTrainerByID = (id) => {
        setTrainerUsers(null);
    }

            return (
                <div className={styles.profile}>
                {userData?.roles[0].role_type === 'ROLE_USER' ? (
                    <>
                    <div className={styles.profile_wrap}>
                            {userData ? (
                                <>
                                    <div className={styles.profile__form}>
                                        <p>Информация о пользователе</p>
                                        <p>Почта: {userData?.email}</p>
                                        <p>Имя: {userData?.first_name}</p>
                                        <p>Фамилия: {userData?.last_name}</p>
                                        <p>Ник: @{userData?.username}</p>
                                        <button onClick={handleLogout}>Выйти</button>
                                    </div>
                                    <div className={styles.profile__form}>
                                        <p>Тренер: </p>
                                        <p>Почта: {userData?.trainer?.email}</p>
                                        <p>Имя: {userData?.trainer?.first_name}</p>
                                        <p>Фамилия: {userData?.trainer?.last_name}</p>
                                        <button onClick={handleSelectTrainer}>Сменить тренера</button>
                                    </div>
                                    <div className={styles.profile__form}>
                                        <p>Рассписание: </p>
                                        <ul>
                                        {userData?.schedules && userData?.schedules?.length ? userData?.schedules?.map((el) => (
                                            <li>
                                                <p>{new Date(el.start_time).toLocaleString('default', { month: 'long' })} {new Date(el.start_time).getDate()}, {new Date(el.start_time).getFullYear()}</p>
                                                -
                                                <p>{new Date(el.end_time).toLocaleString('default', { month: 'long' })} {new Date(el.start_time).getDate()}, {new Date(el.start_time).getFullYear()}</p>
                                                Тип тренировки: {el.training_type.name}
                                            </li>
                                        )) : null}
                                        </ul>
                                        <button onClick={handleSelectShedule}>Сменить рассписание</button>
                                    </div>
                                </>
                            ) : (
                                <p>Загрузка...</p>
                            )}
                    </div>
                    {trainers && trainers?.length ? (
                        <ul className={styles.profile}>
                            {trainers?.map((trainer) => (
                                <li key={trainer.id} className={styles.trainer}>
                                    <img src={trainer.photo} />
                                    <p>Имя: {trainer?.first_name + trainer?.last_name}</p>
                                    <p>Телефон: {trainer?.phone_number}</p>
                                    <p>Цена: {trainer?.cost_per_session} отсосов</p>
                                    <button
                                        onClick={() => handleChangeTrainer(trainer.id)}
                                        disabled={userData?.trainer?.id === trainer?.id}
                                    >
                                        Выбрать
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    </>
                    </div>
                ) : (

                )}
            )
        <div className={styles.profile}>
            <ul>
                {[]?.map((trainer) => (
                    <li>
                        <p onClick={() => handleChoiseTrainerByID(trainer.id)}>{trainer.username}</p>
                        {trainerUsers && trainerUsers?.length ? (
                            <>
                                sdadsa
                            </>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
}

export default ProfilePage;