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


    const [openCalendar, setOpenCalendar] = useState(false);

    const handleChoiseTrainerByID = () => {
        setOpenCalendar(!openCalendar);
    }

    useEffect(() => {
        if(userData?.roles[0].role_type !== 'ROLE_USER') {
            handleSelectTrainer();
            axios.get('http://localhost:8080/api/v1/clients/trainer', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        }
    }, [])

    const handleDeleteTrainer = (id) => {
        axios.delete(`http://localhost:8080/api/v1/trainers/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(() => {
            handleSelectTrainer();
        })
    };

    const [openCreateTrainer, setOpenCreateTrainer] = useState(false);
    const [trName, setTrName] = useState('');
    const [trSurame, setTrSurname] = useState('');
    const [trPhone, setTrPhone] = useState('');
    const [trMail, setTrMail] = useState('');
    const [trCost, setTrCost] = useState('');

    const handleCreateTrainer = () => {
        axios.post('http://localhost:8080/api/v1/trainers', {
            "id": 0,
            "first_name": trName,
            "last_name": trSurame,
            "phone_number": trPhone,
            "email": trMail,
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPimjNls1AGqHyZlxWvvrEhssfHMy-q8N5ftQubFyuFQ&s",
            "cost_per_session": trCost,
            "schedules": [
                {
                    "id": 0,
                    "start_time": "2024-05-15T18:37:18.258Z",
                    "end_time": "2024-05-15T18:37:18.258Z",
                    "training_type": {
                        "id": 0,
                        "name": "string"
                    }
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(() => {
            handleSelectTrainer();
        })
    }

    return (
        <div className={styles.profile}>
        {userData?.roles[0].role_type === 'ROLE_USER' ? (
            <>
                <>
                        {userData ? (
                            <div className={styles.profile_wrap}>
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
                            </div>
                        ) : (
                            <p>Загрузка...</p>
                        )}
                </>
                {trainers && trainers?.length ? (
                    <ul className={styles.trainer__wrap}>
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
        ) : (
            <div className={styles.profile}>
                <ul className={styles.adminTable}>
                    {trainers?.map((trainer) => (
                        <li className={styles.adminTrainer}>
                            <img src={trainer.photo}/>
                            <p>{trainer?.first_name + trainer?.last_name}</p>
                            <button onClick={() => handleChoiseTrainerByID(trainer.id)}>Поменять график</button>
                            <button onClick={() => handleDeleteTrainer(trainer.id)}>Удалить</button>
                        </li>
                    ))}
                    {openCalendar ? (
                        <div className={styles.adminTIMES}>
                            <div className={styles.adminCalendar}>
                                <span>Начало: </span>
                                <input type='date'/>
                                <input type='time'/>
                            </div>
                            <div className={styles.adminCalendar}>
                                <span>Конец: </span>
                                <input type='date'/>
                                <input type='time'/>
                            </div>
                            <button onClick={() => setOpenCalendar(false)}>Сохранить рассписание</button>
                        </div>
                    ) : null}
                </ul>
                <button onClick={() => setOpenCreateTrainer(true)}>создать тренера</button>
                {openCreateTrainer && (
                    <div className={styles.createTrainer}>
                        <input type='text' placeholder='имя тренера' value={trName} onChange={(e) => setTrName(e.target.value)} />
                        <input type='text' placeholder='фамилия тренера' value={trSurame} onChange={(e) => setTrSurname(e.target.value)} />
                        <input type='text' placeholder='номер телефона' value={trPhone} onChange={(e) => setTrPhone(e.target.value)} />
                        <input type='text' placeholder='почта тренера' value={trMail} onChange={(e) => setTrMail(e.target.value)} />
                        <input type='text' placeholder='цена за урок тренера' value={trCost} onChange={(e) => setTrCost(e.target.value)} />
                        <p>Рассписание тренера</p>
                        <div>
                            Начало:
                            <input type='date'/>
                            <input type='time'/>
                        </div>
                        <div>
                            Конец:
                            <input type='date' />
                            <input type='time' />
                        </div>
                        <button onClick={handleCreateTrainer}>Создать</button>
                    </div>
                )}
            </div>
        )}
        </div>
    )
}

export default ProfilePage;