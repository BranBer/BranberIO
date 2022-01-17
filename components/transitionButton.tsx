import React, { ReactChildren } from "react";
import styles from "../styles/TransitionButton.module.scss";

interface TransitionButtonProps {
  href?: string | undefined;
  children: JSX.Element | JSX.Element[] | string | string[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function TransitionButton(props: TransitionButtonProps) {
  return (
    <div>
      <button className={styles.transitionButton} onClick={props.onClick}>
        {props.children}
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
