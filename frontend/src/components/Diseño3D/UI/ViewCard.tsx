import { Eye } from "lucide-react";

type Props = {
  showWireframe: boolean;
  shading: "flat" | "smooth";
  showDimensions: boolean;
  toggleWireframe: () => void;
  toggleShading: () => void;
  toggleDimensions: () => void;
};

export default function ViewCard({
  showWireframe,
  shading,
  showDimensions,
  toggleWireframe,
  toggleShading,
  toggleDimensions,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          Vista
        </h3>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={showWireframe}
            onChange={toggleWireframe}
            className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-gray-800 dark:text-gray-200">
            Wireframe
          </span>
        </label>
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={shading === "flat"}
            onChange={toggleShading}
            className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-gray-800 dark:text-gray-200">
            Sombreado Plano
          </span>
        </label>
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={toggleDimensions}
            className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-gray-800 dark:text-gray-200">
            Dimensiones
          </span>
        </label>
      </div>
    </div>
  );
}

