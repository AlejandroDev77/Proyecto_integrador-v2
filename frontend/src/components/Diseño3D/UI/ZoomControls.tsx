type Props = {
  zoomIn: () => void;
  zoomOut: () => void;
};

export default function ZoomControls({ zoomIn, zoomOut }: Props) {
  return (
    <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-2">
      <button
        onClick={zoomIn}
        className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow flex items-center justify-center hover:scale-105 transition-transform"
        title="Acercar"
      >
        -
      </button>
      <button
        onClick={zoomOut}
        className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow flex items-center justify-center hover:scale-105 transition-transform"
        title="Alejar"
      >
        +
      </button>
    </div>
  );
}
