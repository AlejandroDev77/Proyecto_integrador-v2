import { Link } from "react-router-dom";
import { useSignUp } from "../../hooks/auth/useSignUp";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function SignUpForm() {
  const {
    userData,
    handleChange,
    handleSubmit,
    showPassword,
    toggleShowPassword,
    errorMessage,
    successMessage,
  } = useSignUp();

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Regresar
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-5 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
              Registro
            </h1>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Usuario */}
                <div>
                  <Label>
                    Usuario<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="nom_usu"
                    value={userData.nom_usu}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email_usu"
                    value={userData.email_usu}
                    onChange={handleChange}
                    placeholder="Ingresa tu email"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <Label>
                    Contraseña<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="pas_usu"
                      value={userData.pas_usu}
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                    />
                    <span
                      onClick={toggleShowPassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Mensajes */}
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                {successMessage && <div className="text-green-500">{successMessage}</div>}

                {/* Botón */}
                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-orange-500 shadow-theme-xs hover:bg-orange-600"
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/signin"
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
