import React, { ReactComponentElement } from "react";
import styles from "../styles/GlowButton.module.scss";

const GlowButton = (props: any) => {
     return (<button className={styles.glowButton} {...props}>{props.children}</button>)
}
export default GlowButton;