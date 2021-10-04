import React from "react";
import styles from "../styles/TransitionButton.module.scss";

interface TransitionButtonProps {
  text?: string;
  href?: string | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function TransitionButton(props: TransitionButtonProps) {
  return (
    <div>
      <button className={styles.transitionButton} onClick={props.onClick}>
        {props.text}
        <div
          className={`${styles.wall} ${styles.horWall} ${styles.topWall}`}
        ></div>
        <div
          className={`${styles.wall} ${styles.verWall} ${styles.leftWall}`}
        ></div>
        <div
          className={`${styles.wall} ${styles.horWall} ${styles.botWall}`}
        ></div>
        <div
          className={`${styles.wall} ${styles.verWall} ${styles.rightWall}`}
        ></div>
      </button>
    </div>
  );
}
