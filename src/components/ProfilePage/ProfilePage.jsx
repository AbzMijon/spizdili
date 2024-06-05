import { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Schedule from '../schedule/Schedule';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';


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
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const handleChoiseTrainerByID = (id) => {
        setSelectedTeacher(id);
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
    const [openTrainers, setOpanTrainers] = useState(false);
    const [trName, setTrName] = useState('');
    const [trSurame, setTrSurname] = useState('');
    const [trPhone, setTrPhone] = useState('');
    const [trMail, setTrMail] = useState('');
    const [trCost, setTrCost] = useState('');
    const [trType, setTrTypr] = useState('');
    const [adminDataStartCreate, setAdminDataStartCreate] = useState(null);
    const [adminTimeStartCreate, setAdminTimeStartCreate] = useState(null);

    const [adminDataEndCreate, setAdminDataEndCreate] = useState(null);
    const [adminTimeEndCreate, setAdminTimeEndCreate] = useState(null);

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
                    "start_time": `${adminDataStartCreate}T${adminTimeStartCreate}.910Z`,
                    "end_time": `${adminDataEndCreate}T${adminTimeEndCreate}.910Z`,
                    "training_type": {
                        "id": 0,
                        "name": trType
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
                toast(JSON.parse(message.body).message);
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
    }, []);

    const [adminDataStart, setAdminDataStart] = useState(null);
    const [adminTimeStart, setAdminTimeStart] = useState(null);

    const [adminDataEnd, setAdminDataEnd] = useState(null);
    const [adminTimeEnd, setAdminTimeEnd] = useState(null);

    useEffect(() => {
        if(openCreateTrainer === false) {
            setTrName('');
            setTrSurname('');
            setTrPhone('');
            setTrMail('');
            setTrCost('');
            setTrTypr('');
        }
    }, [openCreateTrainer])

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
                                    <button onClick={() => {
                                        handleSelectTrainer();
                                        setOpanTrainers(!openTrainers);
                                    }}>Сменить тренера</button>
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
                                </div>
                            </div>
                        ) : (
                            <p>Загрузка...</p>
                        )}
                </>
                {openTrainers && trainers && trainers?.length ? (
                    <ul className={styles.trainer__wrap}>
                        {trainers?.map((trainer) => (
                            <li key={trainer.id} className={styles.trainer}>
                                <img src={trainer.photo} />
                                <div>
                                    <p>Имя: <span className={styles.profile_wrap__value}>{trainer?.first_name + trainer?.last_name}</span></p>
                                    <p>Телефон: <span className={styles.profile_wrap__value}>+{trainer?.phone_number}</span></p>
                                    <p>Цена: <span className={styles.profile_wrap__value}>{trainer?.cost_per_session} батонов</span></p>
                                </div>
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
            <>
                <button className={styles.profile__form_btn} onClick={handleLogout}>Выйти</button>
                <p className={styles.profileAdminTitle}>Тренера</p>
                <div className={styles.profileAdmin}>
                    <ul className={styles.adminTable}>
                        {trainers?.map((trainer) => (
                            <li key={trainer.id} >
                                <img src={trainer.photo} alt="" className={styles.adminTeacherImg} />
                                <h3>{trainer?.first_name + trainer?.last_name}</h3>
                                <button className={styles.adminAddTeacher} onClick={() => handleChoiseTrainerByID(trainer.schedules[0].id)}>Поменять график</button>
                                <button className={styles.adminTableDelete} onClick={() => handleDeleteTrainer(trainer.id)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                    <button className={styles.adminAddTeacher} onClick={() => setOpenCreateTrainer(true)}>+ создать тренера</button>
                    {openCalendar ? (
                        <div className={styles.adminTIMES} onClick={() => setOpenCalendar(false)}>
                            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                    <span>Начало: </span>
                                <div className={styles.adminCalendar}>
                                    <input type='date' onChange={(e) => setAdminDataStart(e.target.value)} />
                                    <input type='time' onChange={(e) => setAdminTimeStart(e.target.value)} />
                                </div>
                                    <span>Конец: </span>
                                <div className={styles.adminCalendar}>
                                    <input type='date' onChange={(e) => setAdminDataEnd(e.target.value)} />
                                    <input type='time' onChange={(e) => setAdminTimeEnd(e.target.value)} />
                                </div>
                                <button onClick={() => {
                                    if(adminDataStart && adminTimeStart) {

                                        axios.patch(`http://localhost:8080/api/v1/schedules/update-time-stamp?schedule_id=${selectedTeacher}&notify=true`, {
                                            start_time: dayjs(`${adminDataStart}T${adminTimeStart}`).toISOString(),
                                            end_time: dayjs(`${adminDataEnd}T${adminTimeEnd}`).toISOString(),
                                        }, {
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            }
                                        })

                                    }
                                    setOpenCalendar(false)
                                }}>Сохранить рассписание</button>
                            </div>
                        </div>
                    ) : null}
                    {openCreateTrainer && (
                        <div className={styles.adminTIMES} onClick={() => setOpenCreateTrainer(false)}>
                            <div className={styles.modalCreate} onClick={(e) => e.stopPropagation()}>
                                <h3>Создание тренера</h3>
                                <input type='text' placeholder='Имя' value={trName} onChange={(e) => setTrName(e.target.value)} />
                                <input type='text' placeholder='Фамилия' value={trSurame} onChange={(e) => setTrSurname(e.target.value)} />
                                <input type='text' placeholder='Номер телефона' value={trPhone} onChange={(e) => setTrPhone(e.target.value)} />
                                <input type='text' placeholder='Почта' value={trMail} onChange={(e) => setTrMail(e.target.value)} />
                                <input type='text' placeholder='Цена за урок' value={trCost} onChange={(e) => setTrCost(e.target.value)} />
                                <input type='text' placeholder='Тип занятия' value={trType} onChange={(e) => setTrTypr(e.target.value)} />
                                    <h3>Начало:</h3>
                                <div className={styles.modalCreate__time}>
                                    <input type='date' onChange={(e) => setAdminDataStartCreate(e.target.value)}/>
                                    <input type='time' onChange={(e) => setAdminTimeStartCreate(e.target.value)}/>
                                </div>
                                    <h3>Конец:</h3>
                                <div className={styles.modalCreate__time}>
                                    <input type='date' onChange={(e) => setAdminDataEndCreate(e.target.value)} />
                                    <input type='time' onChange={(e) => setAdminTimeEndCreate(e.target.value)} />
                                </div>
                                <button onClick={handleCreateTrainer}>Создать</button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )}
        </div>
    )
}

export default ProfilePage;