import React from "react";
import TransitionButton from "./transitionButton";
import styles from "../styles/NavBar.module.scss";

const NavOptions = [
  {
    text: "Home",
    href: "",
    onClick: () => {},
  },
  {
    text: "Projects",
    href: "",
    onClick: () => {},
  },
  {
    text: "Skills",
    href: "",
    onClick: () => {},
  },
  {
    text: "Experience",
    href: "",
    onClick: () => {},
  },
  {
    text: "Contact",
    href: "",
    onClick: () => {},
  },
];

const NavBar = () => {
  return (
    <div className={styles.NavBarContainer}>
      {NavOptions.map((option, index) => {
        return (
          <TransitionButton
            text={option.text}
            href={option.href}
            onClick={option.onClick}
            key={`NavOption${option.text}${index}`}
          />
        );
      })}{" "}
    </div>
  );
};

export default NavBar;
