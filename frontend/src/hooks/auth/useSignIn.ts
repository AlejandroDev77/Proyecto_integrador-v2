import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getRedirectRoute } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export function useSignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setIsLoading(true);

    try {
      // Paso 1: login → obtiene token, id_usu, id_rol
      const { token, id_usu, id_rol } = await login(username, password);

      // Paso 2: guardar en contexto
      setUser(id_usu, id_rol, token);

      // Paso 3: obtener ruta de redirección del backend
      const route = await getRedirectRoute(id_rol);
      navigate(route);
    } catch (error: any) {
      setErrors(error.message || "Error al iniciar sesión");
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    errors,
    isLoading,
    handleLogin,
  };
}
