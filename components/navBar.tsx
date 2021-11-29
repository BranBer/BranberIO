import React from "react";
import TransitionButton from "./transitionButton";
import styles from "../styles/NavBar.module.scss";
import Link from "next/link";

const NavOptions = [
  {
    text: "Home",
    href: "",
    onClick: () => {},
  },
  {
    text: "Projects",
    href: "projects",
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

// const ForwardedTransitionButton = React.forwardRef(
//   (props, ref) => (
//   <TransitionButton ref={ref} {...props} />
// ));

const NavBar = () => {
  return (
    <div className={styles.NavBarContainer}>
      {NavOptions.map((option, index) => {
        console.log(option.href);
        return (
          <Link key={`navLink${index}`} passHref href={option.href}>
            <a>
              <TransitionButton
                text={option.text}
                onClick={option.onClick}
                key={`NavOption${option.text}${index}`}
              />
            </a>
          </Link>
        );
      })}{" "}
    </div>
  );
};

export default NavBar;
