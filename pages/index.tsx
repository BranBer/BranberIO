import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import TransitionButton from "../components/transitionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faGithubSquare,
  faLinkedin,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import NavBar from "../components/navBar";
import Lavalamp from "../components/lavalamp";

interface ICircleStyle {
  dim: number;
  dur: number;
  duration: number;
  initRotate: number;
}

const Home: NextPage = () => {
  let profileCircleCount = 15;

  const renderOrbitals = () => {
    let orbitals = [];
    let dec = 0.2;
    let dim: number = 15;
    let dur = 10;

    let orbitalCount = +styles.orbitalCount;
    for (let i = 0; i < orbitalCount; i++) {
      dim += dec;
      dur += 5;

      let rotate = styles[`rotate${i}`] ? styles[`rotate${i}`] : styles.rotate;
      let animDir = i % 2 == 0 ? "normal" : "reverse";

      let circleStyle = {
        animation: `${rotate}`,
        animationIterationCount: "infinite",
        animationTimingFunction: "linear",
        animationDuration: `${dur}s`,
        animationDirection: animDir,
      };

      orbitals.push(
        <div
          className={styles[`halfCircle${i}`]}
          key={`profileOrbit${i}`}
          style={circleStyle}
        />
      );
    }

    return orbitals;
  };

  return (
    <>
      <Lavalamp />
      <div className={styles.pageContainer}>
        <div className={styles.page}>
          <h2>BRANBER.IO</h2>

          <div className={styles.profilePicContainer}>
            <div className={styles.profilePic} />
            {renderOrbitals()}
          </div>

          <div className={styles.socialMediaContainer}>
            <FontAwesomeIcon icon={faFacebookSquare} className={styles.icon} />
            <FontAwesomeIcon icon={faGithubSquare} className={styles.icon} />
            <FontAwesomeIcon icon={faLinkedin} className={styles.icon} />
          </div>

          <NavBar />
        </div>
      </div>
    </>
  );
};

export default Home;
