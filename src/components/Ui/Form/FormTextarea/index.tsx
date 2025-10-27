import { FormField } from "../FormField";
import styles from "../Form.module.css";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export const FormTextarea = ({
  label,
  required,
  error,
  ...props
}: FormTextareaProps) => {
  return (
    <FormField label={label} required={required} error={error}>
      <textarea className={styles.textarea} {...props} />
    </FormField>
  );
};
