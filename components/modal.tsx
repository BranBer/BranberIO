/* eslint-disable react-hooks/exhaustive-deps */
import { AiFillCloseSquare } from "react-icons/ai";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/modal.module.scss";
import { AnimatePresence, motion } from "framer-motion";

interface modalProps {
  children: JSX.Element | JSX.Element[];
  visible: boolean;
  onClose: () => void;
}

const Modal: React.FC<modalProps> = ({ children, visible, onClose }) => {
  const [modalIsVisible, setModalIsVisible] = useState(visible);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setModalIsVisible(visible);
    console.log(`visible: ${visible}`);
  }, [visible]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted
    ? createPortal(
        <AnimatePresence>
          {modalIsVisible ? (
            <motion.div
              className={styles.modalContainer}
              key="modalContainer"
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              <div
                className={styles.modalBackground}
                onClick={() => onClose()}
              />
              <div className={styles.modalContainer}>
                <div className={styles.modalContent}>
                  <div className={styles.closeModal} onClick={() => onClose()}>
                    <AiFillCloseSquare />
                  </div>
                  {children}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.getElementById("modal-root") as Element
      )
    : null;
};

export default Modal;
