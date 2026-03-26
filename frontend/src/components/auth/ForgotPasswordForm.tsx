import { Link } from "react-router-dom";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function ForgotPasswordForm() {
  const { email, setEmail, message, error, isLoading, handleSubmit } = useForgotPassword();

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-6" />
          Volver a iniciar sesión
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-7">
          <h1 className="mb-5 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
            Recupera tu contraseña
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Correo Electrónico <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {message && <p className="text-sm text-green-500 text-center">{message}</p>}

              <div className="pt-2">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 border-none" size="sm" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
            ¿Recordaste tu contraseña?{" "}
            <Link
              to="/signin"
              className="text-orange-500 hover:text-orange-600 dark:text-orange-400 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
