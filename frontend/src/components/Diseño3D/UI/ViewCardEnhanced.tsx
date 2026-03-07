import { Eye, Grid3X3, Box, Sun, Moon, Sliders } from "lucide-react";

type Props = {
  showWireframe: boolean;
  shading: "flat" | "smooth";
  showDimensions: boolean;
  showGrid: boolean;
  showAxes: boolean;
  toggleWireframe: () => void;
  toggleShading: () => void;
  toggleDimensions: () => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
};

export default function ViewCardEnhanced({
  showWireframe,
  shading,
  showDimensions,
  showGrid,
  showAxes,
  toggleWireframe,
  toggleShading,
  toggleDimensions,
  toggleGrid,
  toggleAxes,
}: Props) {
  const toggles = [
    {
      id: "wireframe",
      label: "Wireframe",
      icon: <Box className="w-4 h-4" />,
      active: showWireframe,
      onToggle: toggleWireframe,
      color: "blue",
    },
    {
      id: "shading",
      label: shading === "flat" ? "Plano" : "Suave",
      icon:
        shading === "flat" ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        ),
      active: shading === "flat",
      onToggle: toggleShading,
      color: "purple",
    },
    {
      id: "dimensions",
      label: "Cotas",
      icon: <Sliders className="w-4 h-4" />,
      active: showDimensions,
      onToggle: toggleDimensions,
      color: "green",
    },
    {
      id: "grid",
      label: "Grilla",
      icon: <Grid3X3 className="w-4 h-4" />,
      active: showGrid,
      onToggle: toggleGrid,
      color: "cyan",
    },
    {
      id: "axes",
      label: "Ejes",
      icon: <Box className="w-4 h-4" />,
      active: showAxes,
      onToggle: toggleAxes,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string, active: boolean) => {
    const colors: Record<string, { bg: string; text: string; ring: string }> = {
      blue: {
        bg: active ? "bg-blue-100 dark:bg-blue-900/30" : "",
        text: active
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400",
        ring: "focus:ring-blue-500",
      },
      purple: {
        bg: active ? "bg-purple-100 dark:bg-purple-900/30" : "",
        text: active
          ? "text-purple-600 dark:text-purple-400"
          : "text-gray-600 dark:text-gray-400",
        ring: "focus:ring-purple-500",
      },
      green: {
        bg: active ? "bg-green-100 dark:bg-green-900/30" : "",
        text: active
          ? "text-green-600 dark:text-green-400"
          : "text-gray-600 dark:text-gray-400",
        ring: "focus:ring-green-500",
      },
      cyan: {
        bg: active ? "bg-cyan-100 dark:bg-cyan-900/30" : "",
        text: active
          ? "text-cyan-600 dark:text-cyan-400"
          : "text-gray-600 dark:text-gray-400",
        ring: "focus:ring-cyan-500",
      },
      orange: {
        bg: active ? "bg-orange-100 dark:bg-orange-900/30" : "",
        text: active
          ? "text-orange-600 dark:text-orange-400"
          : "text-gray-600 dark:text-gray-400",
        ring: "focus:ring-orange-500",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-white">Visualización</h3>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {toggles.map((toggle) => {
          const colors = getColorClasses(toggle.color, toggle.active);
          return (
            <button
              key={toggle.id}
              onClick={toggle.onToggle}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${colors.bg} hover:bg-gray-50 dark:hover:bg-gray-700/50`}
            >
              <div
                className={`p-2 rounded-lg ${
                  toggle.active ? colors.bg : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <span className={colors.text}>{toggle.icon}</span>
              </div>
              <span
                className={`text-sm font-medium flex-1 text-left ${colors.text}`}
              >
                {toggle.label}
              </span>
              <div
                className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                  toggle.active
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    toggle.active ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
