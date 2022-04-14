/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/Carousel.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./modal";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const carouselVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
  };

  const handleClickLeftControl = () => {
    const previousIndex = currentImageIndex - 1;
    if (previousIndex >= 0) {
      setCurrentImageIndex(previousIndex);
    }
    setDirection(-1);
  };

  const handleClickRightControl = () => {
    const nextIndex = currentImageIndex + 1;
    if (nextIndex < images.length) {
      setCurrentImageIndex(nextIndex);
    }
    setDirection(1);
  };

  return (
    <>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselControls}>
          <div
            className={styles.carouselButtonLeft}
            onClick={handleClickLeftControl}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={styles.carouselDirection}
            />
          </div>

          <div
            className={styles.carouselButtonRight}
            onClick={handleClickRightControl}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className={styles.carouselDirection}
            />
          </div>
        </div>

        <AnimatePresence custom={direction} exitBeforeEnter>
          <motion.img
            className={styles.carouselImage}
            onClick={() => setModalOpen(true)}
            key={images[currentImageIndex]}
            src={`url(${images[currentImageIndex]})`}
            style={{
              background: `url(${images[currentImageIndex]})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
            custom={direction}
            variants={carouselVariants}
            animate="center"
            exit="exit"
            initial="enter"
            transition={{
              ease: "linear",
              duration: 0.25,
            }}
          />
          ) );
        </AnimatePresence>
      </div>
      <Modal visible={modalOpen} onClose={() => setModalOpen(false)}>
        <img
          className={styles.projectImageFull}
          alt="current project image"
          src={images[currentImageIndex]}
          style={{ objectFit: "contain" }}
        />
      </Modal>
    </>
  );
};

export default Carousel;
