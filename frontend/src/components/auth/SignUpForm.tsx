import { Link } from "react-router-dom";
import { useSignUp } from "../../hooks/auth/useSignUp";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon, UserIcon, LockIcon, EnvelopeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";

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
    <div className="w-full pb-0">
      <div className="mb-4">
        <div className="mb-3 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-[#a67c52] dark:text-gray-400 dark:hover:text-[#d4b48f] group bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700"
          >
            <ChevronLeftIcon className="size-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Volver
          </Link>
        </div>
        
        <div className="pt-0 text-center">
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-1">
            Crea tu cuenta
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">
            Únete a Bosquejo y diseña tu espacio hoy mismo.
          </p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          {/* Usuario */}
          <div className="group">
            <Label>Usuario<span className="text-red-500">*</span></Label>
            <div className="transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(166,124,82,0.2)] rounded-lg">
              <Input type="text" name="nom_usu" value={userData.nom_usu} onChange={handleChange} placeholder="Ingresa tu usuario" icon={<UserIcon />} />
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <Label>Email<span className="text-red-500">*</span></Label>
            <div className="transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(166,124,82,0.2)] rounded-lg">
              <Input type="email" name="email_usu" value={userData.email_usu} onChange={handleChange} placeholder="Ingresa tu email" icon={<EnvelopeIcon />} />
            </div>
          </div>

          {/* Contraseña */}
          <div className="group">
            <Label>Contraseña<span className="text-red-500">*</span></Label>
            <div className="relative transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(166,124,82,0.2)] rounded-lg">
              <Input type={showPassword ? "text" : "password"} name="pas_usu" value={userData.pas_usu} onChange={handleChange} placeholder="Ingresa tu contraseña" icon={<LockIcon />} />
              <span onClick={toggleShowPassword} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 p-1">
                {showPassword ? <EyeIcon className="fill-gray-400 size-5 hover:fill-[#a67c52] transition-colors" /> : <EyeCloseIcon className="fill-gray-400 size-5 hover:fill-[#a67c52] transition-colors" />}
              </span>
            </div>
            
            {/* Medidor de Fuerza de Contraseña */}
            {userData.pas_usu.length > 0 && (
              <div className="mt-1 text-xs">
                <div className="flex gap-1 h-1 mt-1 rounded overflow-hidden">
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} className={`flex-1 transition-all duration-300 ${passwordStrength >= level ? passwordStrength === 1 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : passwordStrength === 2 ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" : passwordStrength === 3 ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" : "bg-[#a67c52] shadow-[0_0_8px_rgba(166,124,82,0.5)]" : "bg-gray-200 dark:bg-gray-700"}`} />
                  ))}
                </div>
                <p className="mt-1 font-semibold text-gray-500 dark:text-gray-400 text-[10px]">
                  {passwordStrength === 1 && <span className="text-red-500">Contraseña muy débil</span>}
                  {passwordStrength === 2 && <span className="text-orange-400">Contraseña débil</span>}
                  {passwordStrength === 3 && <span className="text-yellow-500">Contraseña aceptable</span>}
                  {passwordStrength === 4 && <span className="text-[#a67c52]">Contraseña fuerte</span>}
                </p>
              </div>
            )}
          </div>

          {/* Mensajes */}
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-semibold text-center bg-red-50 py-1.5 rounded-lg">{errorMessage}</motion.div>
          )}
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[#a67c52] text-sm font-semibold text-center bg-[#a67c52]/10 py-1.5 rounded-lg">{successMessage}</motion.div>
          )}

          {/* Botón */}
          <div className="pt-2">
            <button type="submit" disabled={passwordStrength < 3 && userData.pas_usu.length > 0} className={`w-full relative overflow-hidden text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-bold text-base group ${passwordStrength < 3 && userData.pas_usu.length > 0 ? "bg-gray-400 cursor-not-allowed opacity-70" : "bg-gradient-to-r from-[#3a2f22] to-[#5c4a36] shadow-[0_8px_20px_rgba(166,124,82,0.3)] hover:shadow-[0_8px_25px_rgba(166,124,82,0.5)] hover:-translate-y-0.5"}`}>
              <span className="relative z-10">Registrarse</span>
              {!(passwordStrength < 3 && userData.pas_usu.length > 0) && (
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              )}
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-transparent">O regístrate con</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          
          <div className="flex justify-center mb-4 drop-shadow-sm hover:drop-shadow-md transition-shadow">
            <GoogleLogin text="signup_with" shape="pill" size="medium" onSuccess={(res) => res.credential && handleGoogleLogin(res.credential)} onError={() => console.log('Login Failed')} />
          </div>

        </div>
      </motion.form>

      <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
        ¿Ya tienes una cuenta? <Link to="/signin" className="font-bold text-[#a67c52] hover:text-[#8b6842] dark:text-[#d4b48f] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#a67c52] hover:after:w-full after:transition-all">Iniciar sesión</Link>
      </div>
    </div>
  );
}
