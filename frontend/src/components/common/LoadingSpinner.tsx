export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-600 border-t-orange-500 dark:border-t-orange-400 rounded-full animate-spin"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">Cargando datos...</p>
      </div>
    </div>
  );
}
