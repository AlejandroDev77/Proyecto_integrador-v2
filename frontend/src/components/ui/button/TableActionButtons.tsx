import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

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

// ── Toggle switch estilo iOS ──────────────────────────────────────────────────
function ToggleSwitch({ isActive, title, onClick }: {
  isActive: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-2 group/toggle"
    >
      {/* Pill */}
      <span
        className={`
          relative inline-flex items-center w-10 h-5 rounded-full
          transition-all duration-300 ease-in-out shadow-inner
          ${isActive
            ? "bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/40"
            : "bg-gray-300 dark:bg-gray-600"
          }
        `}
      >
        {/* Círculo deslizante */}
        <span
          className={`
            absolute inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm
            transition-all duration-300 ease-in-out
            ${isActive ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </span>
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getActionIcon = (type: ActionType): React.ReactNode => {
  const iconProps = { size: 15, strokeWidth: 2.2 };
  switch (type) {
    case "view":   return <Eye   {...iconProps} />;
    case "edit":   return <Pencil {...iconProps} />;
    case "delete": return <Trash2 {...iconProps} />;
    default:       return null;
  }
};

const getActionColors = (type: ActionType) => {
  switch (type) {
    case "view":
      return {
        bg: "bg-blue-50 dark:bg-blue-500/10",
        text: "text-blue-500 dark:text-blue-400",
        hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-500/20",
      };
    case "edit":
      return {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        text: "text-amber-500 dark:text-amber-400",
        hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-500/20",
      };
    case "delete":
      return {
        bg: "bg-red-50 dark:bg-red-500/10",
        text: "text-red-500 dark:text-red-400",
        hoverBg: "hover:bg-red-100 dark:hover:bg-red-500/20",
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-white/5",
        text: "text-gray-500 dark:text-gray-400",
        hoverBg: "hover:bg-gray-100 dark:hover:bg-white/10",
      };
  }
};

const getDefaultTitle = (type: ActionType, isActive?: boolean): string => {
  switch (type) {
    case "view":   return "Ver";
    case "edit":   return "Editar";
    case "delete": return "Eliminar";
    case "toggle": return isActive ? "Dar de Baja" : "Dar de Alta";
    default:       return "";
  }
};

const getDefaultLabel = (
  type: ActionType,
  isActive?: boolean,
  activeLabel?: string,
  inactiveLabel?: string
): string => {
  switch (type) {
    case "view":   return "Ver";
    case "edit":   return "Editar";
    case "delete": return "Eliminar";
    case "toggle": return isActive ? activeLabel || "Baja" : inactiveLabel || "Alta";
    default:       return "";
  }
};

// ── Componente principal ──────────────────────────────────────────────────────

export default function TableActionButtons({
  actions,
  compact = true,
}: TableActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action, index) => {
        // Toggle usa su propio componente visual
        if (action.type === "toggle") {
          return (
            <ToggleSwitch
              key={index}
              isActive={!!action.isActive}
              onClick={action.onClick}
              title={action.title || getDefaultTitle("toggle", action.isActive)}
            />
          );
        }

        const colors =
          action.type === "custom" && action.customColors
            ? action.customColors
            : getActionColors(action.type);

        const icon =
          action.type === "custom"
            ? action.customIcon
            : getActionIcon(action.type);

        const title = action.title || getDefaultTitle(action.type, action.isActive);

        const label = action.label || getDefaultLabel(
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
