import { FormField } from "../FormField";
import styles from "../Form.module.css";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export const FormInput = ({
  label,
  required,
  error,
  ...props
}: FormInputProps) => {
  return (
    <FormField label={label} required={required} error={error}>
      <input className={styles.input} {...props} />
    </FormField>
  );
};
