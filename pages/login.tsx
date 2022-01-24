import { GetStaticProps, NextPage } from "next";
import Lavalamp from "../components/lavalamp";
import styles from "../styles/Login.module.scss";
import NavBar from "../components/navBar";
import { useSession, getProviders, signIn } from "next-auth/react";
import { Provider } from "next-auth/providers";
import { GetServerSideProps } from "next";
import GlowButton from "../components/glowButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const Login = ({ providers }: { providers: Provider[] }) => {
  const { data: session } = useSession();

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.loginPage}>
          <div className={styles.loginContainer}>
            <div className={styles.tab}>
              <NavBar />
            </div>

            <div className={styles.loginContent}>
              {providers &&
                Object.values(providers).map((provider) => {
                  let providerIcon = null;

                  switch (provider.name.toLowerCase()) {
                    case "google":
                      providerIcon = faGoogle;
                      break;
                    case "facebook":
                      providerIcon = faFacebook;
                      break;
                  }

                  return (
                    <GlowButton
                      onClick={() => signIn(provider.id)}
                      key={provider.name}
                    >
                      <div className={styles.providerButtonContent}>
                        {providerIcon && (
                          <FontAwesomeIcon
                            icon={providerIcon}
                            className={styles.providerIcon}
                          />
                        )}
                        <span>Sign in with {provider.name} </span>
                      </div>
                    </GlowButton>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const getStaticProps: GetStaticProps = async (context) => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

export default Login;
export { getStaticProps };
