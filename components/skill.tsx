import React from "react";
import { IconType } from "react-icons";
import styles from "../styles/skills.module.scss";
import { motion } from "framer-motion";
interface styleProps {
  Icon: IconType;
  iconText: string;
}

const Skill: React.FC<styleProps> = ({ Icon, iconText }) => {
  return (
    <>
      <motion.div className={styles.skillContainer}>
        <div className={styles.skillIconContainer}>
          <div className={styles.skillIcon}>
            <Icon />
          </div>
          <h3>{iconText}</h3>
        </div>
      </motion.div>
    </>
  );
};

export default Skill;
