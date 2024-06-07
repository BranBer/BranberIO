import styles from "../styles/page.module.scss";
import AnimatedPage from "./animatedPage";

interface pageProps {
  children: React.ReactNode;
}

const Page: React.FC<pageProps> = ({ children }) => {
  return <div className={styles.pageContent}>{children}</div>;
};

export default Page;
