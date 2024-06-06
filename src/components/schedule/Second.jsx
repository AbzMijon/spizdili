import dayjs from "dayjs";
import styles from "./schedule.module.css";

const Second = ({ data }) => {

  function getDaysTillDate(isoDate) {
    const currentDate = new Date();
    const targetDate = new Date(isoDate);
    const timeDiff = targetDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  const daysTill = getDaysTillDate(data?.schedules?.[0]?.end_time);

  console.log('daysTill', daysTill);


  const formattedData = dayjs(data?.schedules?.[0]?.start_time).format('YYYY-MM-DD HH:mm');

  const formattedDataEnd = dayjs(data?.schedules?.[0]?.end_time).format('YYYY-MM-DD HH:mm');

  return (
    <div className={`${styles.second}`}>
      <div>
        <h2>Подробное Рассписание</h2>
      </div>
      <div className={styles.schedule}>
        <div className={styles.days}>
          <h5>Понидельник</h5>
          <h5>Вторник</h5>
          <h5>Среда</h5>
          <h5>Четверг</h5>
          <h5>Пятница</h5>
          <h5>Суббота</h5>
          <h5>Воскресенье</h5>
        </div>
        <div className={styles.colums}>
          {daysTill > 0 ? (
            <div>
            <h4>{data?.schedules?.[0]?.training_type?.name}</h4>
            <p>{formattedData?.split(' ')[1]} - {formattedDataEnd?.split(' ')[1]}</p>
            <p>Robert Cage</p>
          </div>
          ) : (
            <div></div>
          )}
          {daysTill > 1 ? (
            <div>
            <h4>{data?.schedules?.[0]?.training_type?.name}</h4>
            <p>{formattedData?.split(' ')[1]} - {formattedDataEnd?.split(' ')[1]}</p>
            <p>Robert Cage</p>
          </div>
          ) : (
            <div></div>
          )}
          {daysTill > 2 ? (
            <div>
            <h4>{data?.schedules?.[0]?.training_type?.name}</h4>
            <p>{formattedData?.split(' ')[1]} - {formattedDataEnd?.split(' ')[1]}</p>
            <p>Robert Cage</p>
          </div>
          ) : (
            <div></div>
          )}
          {daysTill > 3 ? (
            <div>
            <h4>{data?.schedules?.[0]?.training_type?.name}</h4>
            <p>{formattedData?.split(' ')[1]} - {formattedDataEnd?.split(' ')[1]}</p>
            <p>Robert Cage</p>
          </div>
          ) : (
            <div></div>
          )}
          {daysTill > 4 ? (
            <div>
            <h4>{data?.schedules?.[0]?.training_type?.name}</h4>
            <p>{formattedData?.split(' ')[1]} - {formattedDataEnd?.split(' ')[1]}</p>
            <p>Robert Cage</p>
          </div>
          ) : (
            <div></div>
          )}
          {daysTill > 5 ? (
            <div>
            <h4>{data?.schedules?.[0]?.training_type?.name}</h4>
            <p>{formattedData?.split(' ')[1]} - {formattedDataEnd?.split(' ')[1]}</p>
            <p>Robert Cage</p>
          </div>
          ) : (
            <div></div>
          )}
          {daysTill > 6 ? (
            <div>
            <h4>{data?.schedules?.[0]?.training_type?.name}</h4>
            <p>{formattedData?.split(' ')[1]} - {formattedDataEnd?.split(' ')[1]}</p>
            <p>Robert Cage</p>
          </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Second;
