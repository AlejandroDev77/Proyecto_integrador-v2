import { usePermissionsContext } from "../context/PermissionsContext";

export default function usePermissions() {
  return usePermissionsContext();
}
