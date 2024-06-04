import { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Schedule from '../schedule/Schedule';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


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

    const isAuth = localStorage.getItem('beererToken');

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
    };


    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        if(isAuth) {
            // Connect to WebSocket
            const ws = new SockJS('http://localhost:8080/ws');
            const client = Stomp.over(ws);
    
            client.connect({ 'Authorization': `Bearer ${token}` }, () => {
            console.log('Connected to WebSocket');
    
            // Subscribe to the specific topic
            client.subscribe('/user/specific', (message) => {
                alert(JSON.parse(message.body).message);
                console.log('message', message);
            }, { 'Authorization': `Bearer ${token}` });
    
            setStompClient(client);
            });
    
            // Clean up the WebSocket connection on component unmount
            return () => {
                if (stompClient) {
                    stompClient.disconnect();
                }
            };
        }
    }, [token]);

    return (
        <div className={styles.profile}>
        {userData?.roles[0].role_type === 'ROLE_USER' ? (
            <>
                <>
                        {userData ? (
                            <div className={styles.profile_wrap}>
                                <div className={styles.profile__form}>
                                    <p className={styles.profile__form__title}>Информация о пользователе</p>
                                    <p>Почта: <span className={styles.profile_wrap__value}>{userData?.email}</span></p>
                                    <p>Имя: <span className={styles.profile_wrap__value}>{userData?.first_name}</span></p>
                                    <p>Фамилия: <span className={styles.profile_wrap__value}>{userData?.last_name}</span></p>
                                    <p>Ник: <span className={styles.profile_wrap__value}>@{userData?.username}</span></p>
                                    <button className={styles.profile__form_btn} onClick={handleLogout}>Выйти</button>
                                </div>
                                <div className={styles.profile__form}>
                                    <p className={styles.profile__form__title}>Тренер </p>
                                    <p>Почта: <span className={styles.profile_wrap__value}>{userData?.trainer?.email}</span></p>
                                    <p>Имя: <span className={styles.profile_wrap__value}>{userData?.trainer?.first_name}</span></p>
                                    <p>Фамилия: <span className={styles.profile_wrap__value}>{userData?.trainer?.last_name}</span></p>
                                    <button onClick={handleSelectTrainer}>Сменить тренера</button>
                                </div>
                                <div className={styles.profile__form}>
                                    <p className={styles.profile__form__title}>Рассписание </p>
                                    <ul>
                                    {userData?.schedules && userData?.schedules?.length ? userData?.schedules?.map((el) => (
                                        <li>
                                            <div className={styles.profile_wrap__shedule_name}>
                                                <p>{new Date(el.start_time).toLocaleString('default', { month: 'long' })} {new Date(el.start_time).getDate()}, {new Date(el.start_time).getFullYear()}</p>
                                                -
                                                <p>{new Date(el.end_time).toLocaleString('default', { month: 'long' })} {new Date(el.start_time).getDate()}, {new Date(el.start_time).getFullYear()}</p>
                                            </div>
                                            Тип тренировки: <span className={styles.profile_wrap__value}>{el.training_type.name}</span>
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
                                <p>Цена: {trainer?.cost_per_session} батонов</p>
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