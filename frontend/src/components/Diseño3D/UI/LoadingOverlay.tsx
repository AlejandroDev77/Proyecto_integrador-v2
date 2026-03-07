import { Loader2, Box } from "lucide-react";

type Props = {
  isLoading?: boolean;
  hasModel?: boolean;
};

export default function LoadingOverlay({
  isLoading = false,
  hasModel = false,
}: Props) {
  if (!isLoading && hasModel) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-gray-50/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
      <div className="text-center space-y-4">
        {isLoading ? (
          <>
            <div className="relative inline-flex">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-ping opacity-25" />
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Cargando modelo...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Esto puede tomar unos segundos
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto">
              <Box className="w-10 h-10 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Visualizador 3D
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Carga un modelo para comenzar
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                .GLB
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                .GLTF
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
