import styles from "./auth.module.css";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBody}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
