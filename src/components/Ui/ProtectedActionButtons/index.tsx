"use client";

import { SessionUser } from "WT/types";
import { usePermission } from "WT/hooks/usePermission";
import Button from "WT/components/Ui/Button";
import styles from "./ProtectedActionButtons.module.css";

interface ActionButtonConfig {
  icon: string;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  permission: string;
  className?: string;
  variant?: "view" | "edit" | "delete" | "custom";
  needPermission?: boolean;
}

interface ProtectedActionButtonsProps {
  user: SessionUser | null | undefined;
  actions: ActionButtonConfig[];
  className?: string;
}

const ProtectedActionButtons = ({
  user,
  actions,
  className = "",
}: ProtectedActionButtonsProps) => {
  const { hasPermission } = usePermission(user);

  const allowedActions = actions.filter((action) => {
    if (action.needPermission === false) {
      return true;
    }
    return hasPermission(action.permission);
  });

  if (allowedActions.length === 0) {
    return null;
  }

  const getVariantClass = (variant?: string) => {
    switch (variant) {
      case "view":
        return styles.btnView;
      case "edit":
        return styles.btnEdit;
      case "delete":
        return styles.btnDelete;
      default:
        return "";
    }
  };

  return (
    <div className={`${styles.actionButtons} ${className}`}>
      {allowedActions.map((action, index) => (
        <Button
          key={index}
          className={`${styles.btnAction} ${getVariantClass(action.variant)} ${
            action.className || ""
          }`}
          title={action.title}
          onClick={action.onClick}
        >
          <i className={action.icon}></i>
        </Button>
      ))}
    </div>
  );
};

export default ProtectedActionButtons;
