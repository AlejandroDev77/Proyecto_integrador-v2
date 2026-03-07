import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export interface Cliente {
  id_cli: number;
  nom_cli: string;
  ap_pat_cli: string;
  ap_mat_cli: string;
  cel_cli: string;
  dir_cli: string;
  fec_nac_cli: string;
  ci_cli: string;
  img_cli: string;
  est_cli: boolean;
  cod_cli: string;
  id_usu: number;
  nom_usu?: string;
  usuario?: {
    nom_usu?: string;
    email_usu?: string;
    cod_usu?: string;
    est_usu?: boolean;
  };
}
export interface Usuario {
  id_usu: number;
  nom_usu: string;
  email_usu: string;
  cod_usu: string;
  est_usu: boolean;
}

export function useCliente() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [missingCliente, setMissingCliente] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCliente = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMissingCliente(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const decoded: any = jwtDecode(token);
      const id_usu = decoded.id_usu;
      // Key para cachear que el usuario no tiene datos de cliente y evitar fetchs repetidos
      const missingKey = `missingCliente_${id_usu}`;
      const cachedMissing = localStorage.getItem(missingKey) === "true";

      // Llamamos al endpoint combinado /api/usuarios/{id}/perfil
      const resPerfil = await fetch(`http://localhost:8000/api/usuarios/${id_usu}/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resPerfil.ok) {
        // Si el perfil falla, fallback a la lógica anterior: marcar como missing y usar token
        setMissingCliente(cachedMissing);
        setUsuario(decoded || null);
        setCliente(null);
        return;
      }

      const perfil = await resPerfil.json();

      // perfil siempre contiene los campos de usuario: nom_usu, email_usu, est_usu, cod_usu
      setUsuario({
        id_usu: id_usu,
        nom_usu: perfil.nom_usu,
        email_usu: perfil.email_usu,
        cod_usu: perfil.cod_usu,
        est_usu: perfil.est_usu ?? true,
      });

      // Si el perfil contiene campos de cliente, los seteamos; si no, marcamos missingCliente
      if (perfil.nom_cli) {
        setCliente({
          id_cli: 0,
          nom_cli: perfil.nom_cli,
          ap_pat_cli: perfil.ap_pat_cli,
          ap_mat_cli: perfil.ap_mat_cli,
          cel_cli: perfil.cel_cli,
          dir_cli: perfil.dir_cli,
          fec_nac_cli: perfil.fec_nac_cli,
          ci_cli: perfil.ci_cli,
          img_cli: perfil.img_cli,
          est_cli: perfil.est_cli ?? true,
          cod_cli: perfil.cod_cli,
          id_usu: id_usu,
        });
        setMissingCliente(false);
        try { localStorage.removeItem(missingKey); } catch (e) {}
      } else {
        setCliente(null);
        setMissingCliente(true);
        try { localStorage.setItem(missingKey, "true"); } catch (e) {}
      }
    } catch (err: any) {
      setError(err.message);
      setMissingCliente(false);
      setCliente(null);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCliente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Note: updateCliente removed — this hook only performs GET operations (read-only)

  return { cliente, usuario, loading, error, missingCliente, fetchCliente };
}
