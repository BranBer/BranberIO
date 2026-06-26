/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Modal from "./modal";

interface CarouselProps {
  images: string[];
  captions?: Record<string, string>;
}

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "60%" : "-60%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "60%" : "-60%",
    opacity: 0,
    zIndex: 0,
  }),
};

const Carousel: React.FC<CarouselProps> = ({ images, captions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const goTo = (newIndex: number, dir: number) => {
    setDirection(dir);
    setCurrentIndex(newIndex);
  };

  const currentImage = images[currentIndex];
  const caption = captions?.[currentImage];

  return (
    <>
      {/* Carousel frame — glass tier-1 */}
      <div
        className="glass"
        style={{
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Image area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            cursor: "zoom-in",
          }}
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`Open image ${currentIndex + 1} of ${images.length} in lightbox`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setModalOpen(true);
            }
          }}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={caption || `Screenshot ${currentIndex + 1} of ${images.length}`}
              custom={direction}
              variants={shouldReduceMotion ? {} : carouselVariants}
              initial={shouldReduceMotion ? { opacity: 1 } : "enter"}
              animate={shouldReduceMotion ? { opacity: 1 } : "center"}
              exit={shouldReduceMotion ? { opacity: 1 } : "exit"}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                background: "var(--surface)",
              }}
            />
          </AnimatePresence>
        </div>

        {/* Controls row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            borderTop: "1px solid var(--glass-border)",
            gap: "1rem",
          }}
        >
          {/* Prev button */}
          <button
            onClick={() => hasPrev && goTo(currentIndex - 1, -1)}
            disabled={!hasPrev}
            aria-label="Previous image"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2rem",
              height: "2rem",
              borderRadius: "var(--radius-pill)",
              background: hasPrev ? "var(--glass-bg-chip)" : "transparent",
              border: "1px solid var(--glass-border)",
              color: hasPrev ? "var(--fg)" : "var(--fg-subtle)",
              cursor: hasPrev ? "pointer" : "default",
              opacity: hasPrev ? 1 : 0.4,
              padding: 0,
            }}
          >
            <ChevronLeftIcon />
          </button>

          {/* Caption / counter */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "var(--text-xs)",
              color: "var(--fg-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {caption || `${currentIndex + 1} / ${images.length}`}
          </div>

          {/* Next button */}
          <button
            onClick={() => hasNext && goTo(currentIndex + 1, 1)}
            disabled={!hasNext}
            aria-label="Next image"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2rem",
              height: "2rem",
              borderRadius: "var(--radius-pill)",
              background: hasNext ? "var(--glass-bg-chip)" : "transparent",
              border: "1px solid var(--glass-border)",
              color: hasNext ? "var(--fg)" : "var(--fg-subtle)",
              cursor: hasNext ? "pointer" : "default",
              opacity: hasNext ? 1 : 0.4,
              padding: 0,
            }}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Lightbox modal */}
      <Modal visible={modalOpen} onClose={() => setModalOpen(false)}>
        <img
          src={currentImage}
          alt={caption || `Screenshot ${currentIndex + 1} of ${images.length}`}
          style={{
            display: "block",
            maxWidth: "min(90vw, 1100px)",
            maxHeight: "80vh",
            objectFit: "contain",
          }}
        />
      </Modal>
    </>
  );
};

export default Carousel;
