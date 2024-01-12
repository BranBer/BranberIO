import React from "react";
import TransitionButton from "./transitionButton";
import styles from "../styles/NavBar.module.scss";
import Link from "next/link";

const NavBar = () => {
  const NavOptions = [
    {
      text: "Home",
      href: "/",
      onClick: () => {},
    },
    {
      text: "Projects",
      href: "/projects",
      onClick: () => {},
    },
    {
      text: "Skills",
      href: "/skills",
      onClick: () => {},
    },
    {
      text: "About",
      href: "/about",
      onClick: () => {},
    },
  ];

  return (
    <div className={styles.NavBarContainer}>
      {NavOptions.map((option, index) => {
        return (
          <Link key={`navLink${index}`} passHref href={option.href}>
            <TransitionButton
              onClick={option.onClick}
              key={`NavOption${option.text}${index}`}
            >
              {option.text}
            </TransitionButton>
          </Link>
        );
      })}{" "}
    </div>
  );
};

export default NavBar;
