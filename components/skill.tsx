import React, { useState } from "react";
import { IconType } from "react-icons";
import styles from "../styles/skills.module.scss";
import Modal from "./modal";

interface styleProps {
  Icon: IconType;
  iconText: string;
  proficiency: string;
  description: string;
}

const Skill: React.FC<styleProps> = ({
  Icon,
  iconText,
  proficiency,
  description,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <div
        className={styles.skillContainer}
        onClick={() => setModalVisible(true)}
      >
        <div className={styles.skillIconContainer}>
          <div className={styles.skillIcon}>
            <Icon />
          </div>
          <h3>{iconText}</h3>
        </div>
      </div>
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <div className={styles.skillDescriptionContainer}>
          <h3>{iconText}</h3>
          <span className={styles.skillProficiency}>
            <span>Proficiency: </span>
            <span className={styles.proficiency}>{proficiency}</span>
          </span>
          <div className={styles.skillDescription}>
            <p></p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Skill;
