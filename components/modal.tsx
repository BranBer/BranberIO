import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface modalProps {
  children: JSX.Element | JSX.Element[];
  visible: boolean;
  onClose: () => void;
}

const Modal: React.FC<modalProps> = ({ children, visible, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Store the element that opened the modal so we can restore focus on close */
  useEffect(() => {
    if (visible) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      /* Move focus to the close button once the dialog is open */
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [visible]);

  /* Esc-to-close */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }

      /* Basic focus trap — keep Tab/Shift+Tab inside the dialog */
      if (e.key === "Tab") {
        const dialog = e.currentTarget;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    },
    [onClose]
  );

  return mounted
    ? createPortal(
        <AnimatePresence>
          {visible ? (
            <motion.div
              key="modalContainer"
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              /* a11y: dialog role + modal semantics */
              role="dialog"
              aria-modal="true"
              aria-label="Image lightbox"
              onKeyDown={handleKeyDown}
            >
              {/* Backdrop — click closes */}
              <div
                onClick={onClose}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgb(11 16 32 / 0.75)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  cursor: "pointer",
                }}
              />

              {/* Content panel — glass-strong tier */}
              <div
                className="glass-strong"
                style={{
                  position: "relative",
                  zIndex: 1,
                  maxWidth: "min(90vw, 1100px)",
                  maxHeight: "90vh",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Close button */}
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Close lightbox"
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    zIndex: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--glass-bg-chip)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--fg)",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>

                {/* Children (image content) */}
                <div style={{ overflow: "auto", maxHeight: "85vh" }}>
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
