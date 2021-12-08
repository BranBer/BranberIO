import type { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faGithubSquare,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import NavBar from "../components/navBar";
import Lavalamp from "../components/lavalamp";
import Link from 'next/link';

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
            <a
              href="https://www.facebook.com/brandon.berke.3/"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon
                icon={faFacebookSquare}
                className={styles.icon}
              />
            </a>

            <a
              href="https://github.com/BranBer"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faGithubSquare} className={styles.icon} />
            </a>

            <a
              href="https://www.linkedin.com/in/brandon-berke-84111b199/"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} className={styles.icon} />
            </a>
          </div>

          <NavBar />
        </div>
      </div>
    </>
  );
};

export default Home;
