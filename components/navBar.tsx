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
      text: "Experience",
      href: "/",
      onClick: () => {},
    },
    {
      text: "Contact",
      href: "/",
      onClick: () => {},
    },
  ];

  return (
    <div className={styles.NavBarContainer}>
      {NavOptions.map((option, index) => {
        return (
          <Link key={`navLink${index}`} passHref href={option.href}>
            <a>
              <TransitionButton
                onClick={option.onClick}
                key={`NavOption${option.text}${index}`}
              >
                {option.text}
              </TransitionButton>
            </a>
          </Link>
        );
      })}{" "}
    </div>
  );
};

export default NavBar;
