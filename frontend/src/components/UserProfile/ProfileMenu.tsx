import { useLocation, Link } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  /* Settings, */
  ChevronRight,
  FileText,
  ShoppingCart,
  Factory,
} from "lucide-react";

const menuItems = [
  { href: "/user-profile", label: "Perfil", icon: User },
  { href: "/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/pedidos", label: "Pedidos", icon: Package },
  { href: "/mis-producciones", label: "Producciones", icon: Factory },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/carrito", label: "Carrito", icon: ShoppingCart },
 /*  { href: "/settings", label: "Ajustes", icon: Settings }, */
];

export default function ProfileMenu() {
  const location = useLocation();

  return (
    <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#a67c52] to-[#7c5e3c] flex items-center justify-center shadow-inner">
          <User className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-base font-semibold text-[#7c5e3c]">Mi cuenta</h4>
      </div>

      
      <ul className="space-y-1">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = location.pathname === href;
          return (
            <li key={href}>
              <Link
                to={href}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-linear-to-r from-[#a67c52] to-[#8b6914] text-white shadow-md"
                      : "text-[#7c5e3c] hover:bg-[#f3e7d7] hover:translate-x-1"
                  }
                `}
              >
                <span
                  className={`
                  p-1.5 rounded-lg transition-all duration-300
                  ${
                    isActive
                      ? "bg-white/20"
                      : "bg-[#f3e7d7] group-hover:bg-[#e8d5c0] group-hover:scale-110"
                  }
                `}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 ${
                      !isActive && "group-hover:rotate-6"
                    }`}
                  />
                </span>
                <span className="flex-1">{label}</span>
                <ChevronRight
                  className={`
                  w-4 h-4 transition-all duration-300
                  ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }
                `}
                />
              </Link>
            </li>
          );
        })}
      </ul>

     
      
    </div>
  );
}
