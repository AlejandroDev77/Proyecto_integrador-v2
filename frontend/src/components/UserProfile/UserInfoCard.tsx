// Modales removidos: solo mostramos botones estáticos
import { useCliente } from "../../hooks/useUserAddress";

type Props = {
  forceLight?: boolean;
};

export default function UserInfoCard({ forceLight = false }: Props) {
  const { usuario, loading, error } = useCliente();
  return (
    <div
      className={`p-5 border border-gray-200 rounded-2xl lg:p-6 ${
        forceLight ? "bg-white text-gray-800" : "dark:border-gray-800"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4
            className={`${
              forceLight
                ? "text-lg font-semibold text-gray-800 lg:mb-6"
                : "text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6"
            }`}
          >
            Información del Usuario
          </h4>
          {loading ? (
            <div
              className="flex items-center gap-2"
              role="status"
              aria-live="polite"
            >
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span className="text-sm text-gray-500">
                Cargando información del usuario...
              </span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : usuario ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p
                  className={`${
                    forceLight
                      ? "mb-2 text-xs leading-normal text-gray-500"
                      : "mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Nombre de usuario
                </p>
                <p
                  className={`${
                    forceLight
                      ? "text-sm font-medium text-gray-800"
                      : "text-sm font-medium text-gray-800 dark:text-white/90"
                  }`}
                >
                  {usuario.nom_usu}
                </p>
              </div>
              <div>
                <p
                  className={`${
                    forceLight
                      ? "mb-2 text-xs leading-normal text-gray-500"
                      : "mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Email
                </p>
                <p
                  className={`${
                    forceLight
                      ? "text-sm font-medium text-gray-800"
                      : "text-sm font-medium text-gray-800 dark:text-white/90"
                  }`}
                >
                  {usuario.email_usu}
                </p>
              </div>
              <div>
                <p
                  className={`${
                    forceLight
                      ? "mb-2 text-xs leading-normal text-gray-500"
                      : "mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Código de usuario
                </p>
                <p
                  className={`${
                    forceLight
                      ? "text-sm font-medium text-gray-800"
                      : "text-sm font-medium text-gray-800 dark:text-white/90"
                  }`}
                >
                  {usuario.cod_usu}
                </p>
              </div>
              <div>
                <p
                  className={`${
                    forceLight
                      ? "mb-2 text-xs leading-normal text-gray-500"
                      : "mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Estado
                </p>
                <p
                  className={`${
                    forceLight
                      ? "text-sm font-medium text-gray-800"
                      : "text-sm font-medium text-gray-800 dark:text-white/90"
                  }`}
                >
                  {usuario.est_usu ? "Activo" : "Inactivo"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin datos de usuario</p>
          )}
        </div>

        <button
          onClick={() => console.log("Editar (modal eliminado)")}
          className={`flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto ${
            forceLight
              ? ""
              : "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          }`}
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      {/* Modal eliminado — botón Edit permanece visible pero sin acción */}
    </div>
  );
}
