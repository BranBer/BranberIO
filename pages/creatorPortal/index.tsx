import type { NextPage } from "next";
import styles from "../../styles/CreatorPortal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faGithubSquare,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import NavBar from "../../components/navBar";
import TabMenu from "../../components/tabMenu";

const CreatorPortal: NextPage = () => {
  return (
    <div className={styles.CreatorPortalPage}>
      <TabMenu />
    </div>
  );
};

export default CreatorPortal;
