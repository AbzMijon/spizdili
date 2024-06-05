import React from 'react';
import styles from './SimulatorsPage.module.css';
import { allOurSimulatorsData } from '../../data/data';
import { Link } from 'react-router-dom';

function Simulators() {
    return (
        <div className={`${styles["all-trainers"]} container sections-padding`}>
          <div className={styles["trainers-text"]}>
            <p className="paragraph">Наши тренажеры</p>
            <h2>Мы учим вас только на качественном</h2>
          </div>
          <div className={styles.classes}>
            {allOurSimulatorsData && allOurSimulatorsData.map((ele) => {
              return (
                <div key={ele.id} data-aos="fade-right">
                    <img src={ele.image} alt="" />
                    <h3>{ele.title}</h3>
                    <p>{ele.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
}

export default Simulators