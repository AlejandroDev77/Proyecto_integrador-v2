import { Link } from "react-router-dom";
import { useSignUp } from "../../hooks/auth/useSignUp";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon, UserIcon, LockIcon, EnvelopeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

import { GoogleLogin } from "@react-oauth/google";

export default function SignUpForm() {
  const {
    userData,
    handleChange,
    handleSubmit,
    showPassword,
    toggleShowPassword,
    errorMessage,
    successMessage,
    passwordStrength,
    handleGoogleLogin
  } = useSignUp();

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up pb-8">
      <div className="mb-8">
        <div className="mb-6 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 group"
          >
            <ChevronLeftIcon className="size-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Volver a la tienda
          </Link>
        </div>
        
        <div className="text-center pt-2">
          <img
            src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
            alt="Bosquejo Logo"
            className="h-28 mx-auto mb-6 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Únete a Bosquejo y diseña tu espacio hoy mismo.
          </p>
        </div>
      </div>

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
                    icon={<UserIcon />}
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
                    icon={<EnvelopeIcon />}
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
                      icon={<LockIcon />}
                    />
                    <span
                      onClick={toggleShowPassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5 hover:text-orange-500 transition-colors" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5 hover:text-orange-500 transition-colors" />
                      )}
                    </span>
                  </div>
                  
                  {/* Medidor de Fuerza de Contraseña */}
                  {userData.pas_usu.length > 0 && (
                    <div className="mt-2 text-sm">
                      <div className="flex gap-1 h-1.5 mt-2 rounded overflow-hidden">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level} 
                            className={`flex-1 ${
                              passwordStrength >= level 
                                ? passwordStrength === 1 ? "bg-red-500" 
                                : passwordStrength === 2 ? "bg-orange-400" 
                                : passwordStrength === 3 ? "bg-yellow-400" 
                                : "bg-green-500"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {passwordStrength === 1 && "Contraseña muy débil"}
                        {passwordStrength === 2 && "Contraseña débil"}
                        {passwordStrength === 3 && "Contraseña aceptable"}
                        {passwordStrength === 4 && "Contraseña fuerte"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mensajes */}
                {errorMessage && <div className="text-red-500 text-sm font-medium">{errorMessage}</div>}
                {successMessage && <div className="text-green-500 text-sm font-medium">{successMessage}</div>}

                {/* Botón */}
                <div>
                  <button
                    type="submit"
                    disabled={passwordStrength < 3 && userData.pas_usu.length > 0}
                    className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs ${
                      passwordStrength < 3 && userData.pas_usu.length > 0
                       ? "bg-gray-400 cursor-not-allowed" 
                       : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    Registrarse
                  </button>
                </div>

                <div className="flex items-center my-6">
                  <div className="grow border-t border-gray-300 dark:border-gray-600"></div>
                  <span className="px-3 text-sm text-gray-400 dark:text-gray-500">O regístrate con</span>
                  <div className="grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                
                <div className="flex justify-center mb-6">
                  <GoogleLogin
                      text="signup_with"
                      shape="pill"
                      width="100%"
                      size="large"
                      onSuccess={(credentialResponse) => {
                        if (credentialResponse.credential) {
                          handleGoogleLogin(credentialResponse.credential);
                        }
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                  />
                </div>

              </div>
            </form>

            <div className="mt-6 text-sm text-center text-gray-700 dark:text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/signin"
                className="font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400"
              >
                Iniciar sesión
              </Link>
            </div>
    </div>
  );
}
