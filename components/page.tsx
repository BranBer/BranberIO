import styles from "../styles/page.module.scss";
import AnimatedPage from "./animatedPage";

interface pageProps {
  children: React.ReactNode;
}

const Page: React.FC<pageProps> = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.page}>
        <AnimatedPage className={styles.pageContent}>{children}</AnimatedPage>
      </div>
    </div>
  );
};

export default Page;
