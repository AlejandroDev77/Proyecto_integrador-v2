import { Sun, Moon, Sparkles, Lightbulb } from "lucide-react";

export type LightPreset = "studio" | "natural" | "dramatic" | "soft";

type Props = {
  currentPreset: LightPreset;
  onPresetChange: (preset: LightPreset) => void;
};

const presets: {
  id: LightPreset;
  name: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "studio",
    name: "Estudio",
    icon: <Lightbulb className="w-4 h-4" />,
    description: "Iluminación profesional equilibrada",
  },
  {
    id: "natural",
    name: "Natural",
    icon: <Sun className="w-4 h-4" />,
    description: "Luz de día cálida",
  },
  {
    id: "dramatic",
    name: "Dramático",
    icon: <Moon className="w-4 h-4" />,
    description: "Alto contraste teatral",
  },
  {
    id: "soft",
    name: "Suave",
    icon: <Sparkles className="w-4 h-4" />,
    description: "Sombras difusas",
  },
];

export default function LightPresets({ currentPreset, onPresetChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-white">Iluminación</h3>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
              currentPreset === preset.id
                ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-orange-400 dark:border-orange-500"
                : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                currentPreset === preset.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
              }`}
            >
              {preset.icon}
            </div>
            <span
              className={`text-sm font-medium ${
                currentPreset === preset.id
                  ? "text-orange-700 dark:text-orange-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {preset.name}
            </span>
          </button>
        ))}
      </div>

      {/* Current preset description */}
      <div className="px-4 pb-4">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
          {presets.find((p) => p.id === currentPreset)?.description}
        </p>
      </div>
    </div>
  );
}
