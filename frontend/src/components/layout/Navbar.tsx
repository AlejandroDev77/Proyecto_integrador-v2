import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { getUser, logout } from "../../services/authService";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUser();
  const isLoggedIn = Boolean(user);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
            alt="Logo"
            className="h-10 w-auto"
          />
          <span className="font-bold text-lg text-[#7c5e3c] hidden sm:block">
            Bosquejo
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <a href="#products" className="hover:text-[#a67c52] transition-colors">Productos</a>
          <a href="#benefits" className="hover:text-[#a67c52] transition-colors">Beneficios</a>
          <a href="#process" className="hover:text-[#a67c52] transition-colors">Proceso</a>
          <a href="#faq" className="hover:text-[#a67c52] transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-[#a67c52] transition-colors">Contacto</a>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-full shadow-sm">
                  <img
                    src={user?.img_cli || "/images/logo/SinPerfil.png"}
                    alt={user?.nom_usu}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-sm leading-tight">
                  <span className="font-bold text-[#7c5e3c] truncate max-w-[120px]">
                    {user?.nom_usu}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user?.email_usu}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href="/dashboard"
                  title="Panel de Administración"
                  className="p-2 text-gray-600 hover:text-[#a67c52] transition-colors"
                >
                  <LayoutDashboard size={20} />
                </a>
                <button
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <a
              href="/signin"
              className="bg-[#a67c52] hover:bg-[#7c5e3c] text-white px-5 py-2 rounded-full shadow-md transition-all transform hover:scale-105"
            >
              Iniciar sesión
            </a>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? (
            <X className="w-7 h-7 text-[#7c5e3c]" />
          ) : (
            <Menu className="w-7 h-7 text-[#7c5e3c]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col px-6 py-6 gap-4">
            <a href="#products" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Productos</a>
            <a href="#benefits" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Beneficios</a>
            <a href="#process" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Proceso</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">FAQ</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Contacto</a>

            <div className="pt-4 border-t border-gray-100">
              {isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.img_cli || "/images/logo/SinPerfil.png"}
                      alt={user?.nom_usu}
                      className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{user?.nom_usu}</span>
                      <span className="text-xs text-gray-500">{user?.email_usu}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} /> Panel
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg font-medium"
                    >
                      <LogOut size={18} /> Salir
                    </button>
                  </div>
                </div>
              ) : (
                <a
                  href="/signin"
                  className="block w-full text-center bg-[#a67c52] text-white px-4 py-3 rounded-xl font-bold shadow-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
