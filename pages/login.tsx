import { NextPage } from "next";
import Lavalamp from "../components/lavalamp";
import styles from "../styles/Login.module.scss";
import NavBar from "../components/navBar";

const Login : NextPage = () => {
    return <> 
        <div className={styles.pageContainer}>
            <div className={styles.loginPage}>
                
                <div className={styles.loginContainer}>
                    <div className={styles.tab}>
                        <NavBar />                        
                    </div>

                    <form className = {styles.loginForm}>  

                        <div className={styles.fields}>
                            <div className = {styles.loginField}>
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email"/>
                            </div>
                            <div className = {styles.loginField}>
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" className={styles.sqPass}/>
                            </div>
                        </div>

                        <input type="submit"/>

                        <div className = {styles.errorMessage} style={{height: '30px'}}>
                            
                        </div>

                        
                    </form>

                    <div className = {styles.loginWith}>

                        </div>
                </div>
            </div>
        </div>
    </>
}

export default Login;