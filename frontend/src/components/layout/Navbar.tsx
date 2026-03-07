import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { getUser } from "../../services/authService";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUser();
  const isLoggedIn = Boolean(user);
  // Usar el JWT decodificado (getUser) como fuente de información del usuario
    const tokenUser = user; // Keep this line for context
  const [remoteUser, setRemoteUser] = useState<any | null>(null);
    // leer token una vez (string primitivo) para usar en dep del useEffect y evitar re-fetch infinito
    const token = localStorage.getItem("token");
    const id_usu = tokenUser?.id_usu;

    useEffect(() => {
      // Si no hay token o id en el token, no hacemos la petición
      if (!token || !id_usu) return;
      // Si ya cargamos remoteUser, no volver a pedir
      if (remoteUser) return;

      let mounted = true;

      fetch(`http://localhost:8000/api/usuarios/simple/${id_usu}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (!mounted) return;
          // Guardar solo los campos que necesitamos
          if (data) {
            setRemoteUser({
              nom_usu: data.nom_usu,
              email_usu: data.email_usu,
              img_cli: data.img_cli || data.avatar || null,
            });
          } else {
            setRemoteUser({ nom_usu: tokenUser?.nom_usu, email_usu: tokenUser?.email_usu, img_cli: tokenUser?.img_cli || null });
          }
        })
        .catch(() => {
          if (!mounted) return;
          setRemoteUser({ nom_usu: tokenUser?.nom_usu, email_usu: tokenUser?.email_usu, img_cli: tokenUser?.img_cli || null });
        });

      return () => {
        mounted = false;
      };
      // dependemos de token (string), id_usu (number/primitive) y remoteUser
    }, [token, id_usu, remoteUser, tokenUser?.nom_usu, tokenUser?.email_usu, tokenUser?.img_cli]);

    const displayedUser = remoteUser || (tokenUser ? { nom_usu: tokenUser.nom_usu, email_usu: tokenUser.email_usu, img_cli: tokenUser.img_cli || null } : null);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#hero" className="flex items-center gap-2">
          <img
            src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
            alt="Logo"
            className="h-10 w-auto"
          />
          <span className="font-bold text-lg text-[#7c5e3c] hidden sm:block">
            Bosquejo
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <a href="#products" className="hover:text-[#a67c52]">
            Productos
          </a>
          <a href="#benefits" className="hover:text-[#a67c52]">
            Beneficios
          </a>
          <a href="#process" className="hover:text-[#a67c52]">
            Proceso
          </a>
          <a href="#faq" className="hover:text-[#a67c52]">
            FAQ
          </a>
          <a href="#contact" className="hover:text-[#a67c52]">
            Contacto
          </a>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                    <img
                      src={
                        (displayedUser && (displayedUser.img_cli || displayedUser.avatar)) || 
                        "/images/logo/SinPerfil.png"
                      }
                      alt={displayedUser?.nom_cli ?? displayedUser?.nom_usu ?? "user"}
                      className="w-full h-full object-cover"
                    />
                </div>
                <div className="hidden sm:flex flex-col text-sm">
                  <span className="font-medium text-[#7c5e3c]">
                      {displayedUser?.nom_usu ?? "Usuario"}
                  </span>
                  <span className="text-xs text-gray-600">
                      {displayedUser?.email_usu ?? ""}
                  </span>
                </div>
              </div>
              <a
                href="/dashboard"
                className="ml-2 bg-[#a67c52] hover:bg-[#7c5e3c] text-white px-4 py-2 rounded-lg shadow transition"
              >
                Administrar
              </a>
            </div>
          ) : (
            <a
              href="/signin"
              className="ml-2 bg-[#a67c52] hover:bg-[#7c5e3c] text-white px-4 py-2 rounded-lg shadow transition"
            >
              Iniciar sesión
            </a>
          )}
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? (
            <X className="w-7 h-7 text-[#7c5e3c]" />
          ) : (
            <Menu className="w-7 h-7 text-[#7c5e3c]" />
          )}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col px-6 py-4 gap-3">
            {[
              { href: "#products", label: "Productos" },
              { href: "#benefits", label: "Beneficios" },
              { href: "#process", label: "Proceso" },
              { href: "#faq", label: "FAQ" },
              { href: "#contact", label: "Contacto" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2"
              >
                {l.label}
              </a>
            ))}
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2 border-b border-gray-100">
                  <div className="w-12 h-12 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                      <img
                        src={
                          (displayedUser && (displayedUser.img_cli || displayedUser.avatar)) || 
                          "/images/logo/SinPerfil.png"
                        }
                        alt={displayedUser?.nom_cli ?? displayedUser?.nom_usu ?? "user"}
                      className="w-full h-full object-cover"
                    />
                  </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">{tokenUser?.nom_usu ?? "Usuario"}</span>
            <span className="text-xs text-gray-500">{tokenUser?.email_usu ?? ""}</span>
          </div>
                </div>
                <a
                  href="/dashboard"
                  className="bg-[#a67c52] text-white px-4 py-2 rounded-lg shadow"
                  onClick={() => setMenuOpen(false)}
                >
                  Administrar
                </a>
              </>
            ) : (
              <a
                href="/signin"
                className="bg-[#a67c52] text-white px-4 py-2 rounded-lg shadow"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
