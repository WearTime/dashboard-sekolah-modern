import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", disabled = false, ...props }, ref) => {
    return (
      <button ref={ref} disabled={disabled} className={className} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
