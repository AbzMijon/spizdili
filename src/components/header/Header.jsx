import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { headerLinksData } from "../../data/data";

import styles from "./header.module.css";
import logo from "../../assets/Icon.png";

const Header = () => {
  const navigate = useNavigate();

  const [active, setActive] = useState(false);
  const isAuth = JSON.parse(localStorage.getItem('isAuth'));

  const menuHandler = () => {
    setActive(!active);
  };

  return (
    <header>
      <div className={`${styles.header_content} container`}>
        <div className={styles.logo_holder} onClick={() => navigate("/")}>
          <div className={styles.image_holder}>
            <img src={logo} alt="Logo" />
          </div>
          Strengthy
        </div>
        <ul className={active ? `${styles.activeList}` : ""}>
          {headerLinksData.map((link) => {
            return (
              <li key={link.id}>
                <Link to={link.to}>{link.title}</Link>
              </li>
            );
          })}

          <li>
            {isAuth ? (
              <button onClick={() => navigate("/profile")}>Profile</button>
            ) : (
              <button onClick={() => navigate("/registration")}>Sign up</button>
            )}
          </li>
        </ul>
        <div className={styles.menu} onClick={() => menuHandler()}>
          <i className={`fas ${active ? "fa-times" : "fa-bars"} open-list`}></i>
        </div>
        <div
          className={`${styles.menu_overlay} ${
            active ? `${styles.active_overlay}` : ""
          }`}
          onClick={() => menuHandler()}></div>
      </div>
    </header>
  );
};

export default Header;
