import styles from "./SimulatorsPage.module.css";

const HeroSection = () => {
  return (
    <div
      className={`${styles["hero-section"]} margin-sections main-background`}
      data-aos="zoom-out-down">
      <h1 className="main-heading">Тренажеры</h1>
    </div>
  );
};

export default HeroSection;
