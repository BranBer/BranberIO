import Goo from "gooey-react";
import React from "react";
import styles from "../styles/lavalamp.module.scss";

const Lavalamp = () => {
  return (
    <div className={styles.page}>
      <Goo className={styles.lava} intensity="strong">
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
      </Goo>
    </div>
  );
};

export default Lavalamp;
