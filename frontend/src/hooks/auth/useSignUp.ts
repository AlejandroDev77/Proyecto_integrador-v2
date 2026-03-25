import { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { RegisterRequest } from "../../types/auth";

export function useSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<RegisterRequest>({
    nom_usu: "",
    email_usu: "",
    pas_usu: "",
    id_rol: 2,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await register(userData);
      setSuccessMessage("Usuario registrado correctamente.");
      // Redirigir al login después de un registro exitoso
      setTimeout(() => navigate("/signin"), 1500); 
    } catch (error: any) {
      setErrorMessage(
        error.message || "Hubo un error al registrar el usuario.",
      );
    }
  };

  // Función para calcular la fuerza de la contraseña (0 a 4)
  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length > 0) strength += 1; 
    if (password.length >= 8) strength += 1; 
    if (/[A-Z]/.test(password)) strength += 1; 
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 1; 
    return Math.min(4, Math.max(0, strength));
  };

  const passwordStrength = calculateStrength(userData.pas_usu);

  const handleGoogleLogin = async (credential: string) => {
    setErrorMessage(null);
    try {
      const { loginWithGoogle, getRedirectRoute } = await import("../../services/authService");
      const { useAuth } = await import("../../context/AuthContext");
      
      const response = await loginWithGoogle(credential);
      if ("requires_2fa" in response && response.requires_2fa) {
        setErrorMessage("Debes iniciar sesión normal para verificar el 2FA.");
        return; 
      }
      const { token, id_usu, id_rol } = response as import("../../types/auth").LoginResponse;
      localStorage.setItem("token", token);
      const route = await getRedirectRoute(id_rol);
      navigate(route);
      setTimeout(() => window.location.reload(), 100);
    } catch (error: any) {
      setErrorMessage(error.message || "Error al completar el registro con Google");
    }
  };

  return {
    userData,
    handleChange,
    handleSubmit,
    showPassword,
    toggleShowPassword,
    errorMessage,
    successMessage,
    passwordStrength,
    handleGoogleLogin
  };
}

