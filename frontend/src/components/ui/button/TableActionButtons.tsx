import React from "react";
import { Eye, Pencil, Trash2, Check, X } from "lucide-react";

/**
 * Action type defines the type of action button to render
 */
export type ActionType = "view" | "edit" | "delete" | "toggle" | "custom";

/**
 * Configuration for a single action button
 */
export interface ActionButton {
  type: ActionType;
  onClick: () => void;
  label?: string;
  title?: string;
  /** Only used for toggle type - determines visual state */
  isActive?: boolean;
  /** Labels for toggle action */
  activeLabel?: string;
  inactiveLabel?: string;
  /** Custom icon for custom action type */
  customIcon?: React.ReactNode;
  /** Custom colors for custom action type */
  customColors?: {
    bg: string;
    text: string;
    hoverBg: string;
  };
  /** Whether to show the label text next to the icon */
  showLabel?: boolean;
}

interface TableActionButtonsProps {
  actions: ActionButton[];
  /** Whether to use compact style (icon only) or full style (icon + label) */
  compact?: boolean;
}

/**
 * Get the icon for a specific action type
 */
const getActionIcon = (
  type: ActionType,
  isActive?: boolean
): React.ReactNode => {
  const iconProps = { size: 20, strokeWidth: 2.2 };

  switch (type) {
    case "view":
      return <Eye {...iconProps} />;
    case "edit":
      return <Pencil {...iconProps} />;
    case "delete":
      return <Trash2 {...iconProps} />;
    case "toggle":
      return isActive ? <X {...iconProps} /> : <Check {...iconProps} />;
    default:
      return null;
  }
};

/**
 * Get the default colors for each action type
 * Uses pastel colors matching the Clientes.tsx design
 */
const getActionColors = (type: ActionType, isActive?: boolean) => {
  switch (type) {
    case "view":
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        hoverBg: "hover:bg-blue-200",
      };
    case "edit":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        hoverBg: "hover:bg-yellow-200",
      };
    case "delete":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        hoverBg: "hover:bg-red-200",
      };
    case "toggle":
      // Active state uses red (to deactivate), inactive uses green (to activate)
      return isActive
        ? {
            bg: "bg-red-100",
            text: "text-red-700",
            hoverBg: "hover:bg-red-200",
          }
        : {
            bg: "bg-green-100",
            text: "text-green-700",
            hoverBg: "hover:bg-green-200",
          };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        hoverBg: "hover:bg-gray-200",
      };
  }
};

/**
 * Get the default title/tooltip for each action type
 */
const getDefaultTitle = (type: ActionType, isActive?: boolean): string => {
  switch (type) {
    case "view":
      return "Ver";
    case "edit":
      return "Editar";
    case "delete":
      return "Eliminar";
    case "toggle":
      return isActive ? "Dar de Baja" : "Dar de Alta";
    default:
      return "";
  }
};

/**
 * Get default label for each action type
 */
const getDefaultLabel = (
  type: ActionType,
  isActive?: boolean,
  activeLabel?: string,
  inactiveLabel?: string
): string => {
  switch (type) {
    case "view":
      return "Ver";
    case "edit":
      return "Editar";
    case "delete":
      return "Eliminar";
    case "toggle":
      return isActive ? activeLabel || "Baja" : inactiveLabel || "Alta";
    default:
      return "";
  }
};

/**
 * Reusable table action buttons component
 * Provides consistent styling for common table actions (view, edit, delete, toggle)
 */
export default function TableActionButtons({
  actions,
  compact = true,
}: TableActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => {
        const colors =
          action.type === "custom" && action.customColors
            ? action.customColors
            : getActionColors(action.type, action.isActive);

        const icon =
          action.type === "custom"
            ? action.customIcon
            : getActionIcon(action.type, action.isActive);

        const title =
          action.title || getDefaultTitle(action.type, action.isActive);

        const label =
          action.label ||
          getDefaultLabel(
            action.type,
            action.isActive,
            action.activeLabel,
            action.inactiveLabel
          );

        const showLabel = action.showLabel ?? !compact;

        return (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-2 rounded-lg ${colors.bg} ${colors.text} ${colors.hoverBg} transition-colors flex items-center gap-1`}
            title={title}
          >
            {icon}
            {showLabel && <span className="text-sm font-medium">{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
