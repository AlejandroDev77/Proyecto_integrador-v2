import { Navigate, useNavigate, useParams } from "react-router";
import RoomViewer from "../../components/Productos/RoomViewer";
import { CustomRoomConfig } from "../../components/Productos/RoomBuilder/CustomRoomModal";

const ROOM_NAMES: Record<string, string> = {
  "1": "Sala de estar",
  "2": "Dormitorio",
  "3": "Cocina",
  "4": "Oficina",
  "5": "Habitación infantil",
  "6": "Comedor",
};

function readCustomRoomConfig(): CustomRoomConfig | null {
  try {
    const saved = sessionStorage.getItem("room_designer_custom_config");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function RoomDesignerPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  if (!roomId || (roomId !== "custom" && !ROOM_NAMES[roomId])) {
    return <Navigate to="/products?tab=estancias" replace />;
  }

  const isCustomRoom = roomId === "custom";

  return (
    <main className="min-h-screen bg-[#e5e5e5] p-2 md:p-4 lg:p-6">
      <RoomViewer
        roomId={roomId}
        initialConfig={isCustomRoom ? readCustomRoomConfig() : null}
        roomName={isCustomRoom ? "Personalizada" : ROOM_NAMES[roomId]}
        onBack={() => navigate("/products?tab=estancias")}
      />
    </main>
  );
}
