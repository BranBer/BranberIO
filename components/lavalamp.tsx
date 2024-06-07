// import Goo from "gooey-react";
import React from "react";
import styles from "../styles/lavalamp.module.scss";

const Lavalamp = () => {
  return (
    <div className={styles.lavaContainer}>
      <div className={styles.lava}>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
        <div className={styles.blob}> </div>
      </div>
      <div className={styles.backdrop} />
    </div>
  );
};

export default Lavalamp;
