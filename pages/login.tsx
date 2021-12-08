import { NextPage } from "next";
import Lavalamp from "../components/lavalamp";
import styles from "../styles/Login.module.scss";
import NavBar from "../components/navBar";

const Login : NextPage = () => {
    return <> 
        <Lavalamp/>
        <div className={styles.pageContainer}>
            <div className={styles.loginPage}>
                
                <div className={styles.loginContainer}>
                    <div className={styles.tab}>
                        <NavBar />                        
                    </div>

                    <form className = {styles.loginForm}>  

                        <div className = {styles.loginField}>
                            <label>Email</label>
                            <input type="text"/>
                        </div>

                        <div className = {styles.loginField}>
                            <label>Password</label>
                            <input type="password"/>
                        </div>

                        <input type="submit"/>

                        <div className = {styles.errorMessage} style={{height: '30px'}}>
                            
                        </div>
                    </form>

                    
                </div>
            </div>
        </div>
    </>
}

export default Login;