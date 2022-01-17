import { NextPage } from "next";
import Lavalamp from "../components/lavalamp";
import styles from "../styles/Login.module.scss";
import NavBar from "../components/navBar";
import { useSession, getProviders, signIn } from "next-auth/react";
import { Provider } from "next-auth/providers";
import { GetServerSideProps } from "next";
import GlowButton from "../components/glowButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

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
              <form className={styles.loginForm}>
                <div className={styles.fields}>
                  <div className={styles.loginField}>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" />
                  </div>
                  <div className={styles.loginField}>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      className={styles.sqPass}
                    />
                  </div>
                </div>

                <input type="submit" />

                <div
                  className={styles.errorMessage}
                  style={{ height: "30px" }}
                ></div>
              </form>

              <div className={styles.loginWith}>
                {providers &&
                  Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                      <GlowButton onClick={() => signIn(provider.id)}>
                        <div className={styles.providerButtonContent}>
                          <FontAwesomeIcon icon={faFacebook} />
                          <span>Sign in with {provider.name} </span>
                        </div>
                      </GlowButton>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

export default Login;
export { getServerSideProps };
