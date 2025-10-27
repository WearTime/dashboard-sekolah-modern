import { FormField } from "../FormField";
import styles from "../Form.module.css";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect = ({
  label,
  required,
  error,
  options,
  ...props
}: FormSelectProps) => {
  return (
    <FormField label={label} required={required} error={error}>
      <select className={styles.select} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};
