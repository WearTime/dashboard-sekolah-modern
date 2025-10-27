import styles from "../Form.module.css";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

export const FormField = ({
  label,
  required,
  children,
  error,
}: FormFieldProps) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
