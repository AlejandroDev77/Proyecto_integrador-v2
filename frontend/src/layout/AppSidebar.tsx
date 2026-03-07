import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { FaHistory } from "react-icons/fa";
import { FaStore } from "react-icons/fa";
// Iconos para el menú
import {
  FaUsers,
  FaWarehouse,
  FaShoppingCart,
  FaChartPie,
  FaCube,
} from "react-icons/fa";

import { ChevronDownIcon, HorizontaLDots } from "../icons";
import usePermissions from "../hooks/usePermissions";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  requiredPermisos?: string[]; // permisos globales para mostrar este item
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    requiredPermisos?: string[];
  }[];
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <FaChartPie className="w-5 h-5" />,
    path: "/dashboard",
    requiredPermisos: ["ver_dashboard"],
  },
  {
    name: "Negocio",
    icon: <FaStore className="w-5 h-5" />,
    path: "/negocio",
    requiredPermisos: ["ver_negocio"],
  },

  {
    name: "Gestión De Usuarios",
    icon: <FaUsers className="w-5 h-5" />,
    // Ejemplo de permisos: actualiza estos nombres conforme a tu backend
    subItems: [
      {
        name: "Usuarios",
        path: "/usuarios",
        pro: false,
        requiredPermisos: ["ver_usuarios"],
      },
      {
        name: "Clientes",
        path: "/clientes",
        pro: false,
        requiredPermisos: ["ver_clientes"],
      },
      {
        name: "Empleados",
        path: "/empleados",
        pro: false,
        requiredPermisos: ["ver_empleados"],
      },
      {
        name: "Proveedores",
        path: "/proveedores",
        pro: false,
        requiredPermisos: ["ver_proveedores"],
      },
      {
        name: "Roles",
        path: "/roles",
        pro: false,
        requiredPermisos: ["ver_roles"],
      },
      {
        name: "Permisos",
        path: "/permisos",
        pro: false,
        requiredPermisos: ["ver_permisos"],
      },
      {
        name: "Roles y Permisos",
        path: "/roles-permisos",
        pro: false,
        requiredPermisos: ["ver_roles_permisos"],
      },
    ],
  },
  {
    icon: <FaWarehouse className="w-5 h-5" />,
    name: "Inventario",
    subItems: [
      {
        name: "Materiales",
        path: "/materiales",
        pro: false,
        requiredPermisos: ["ver_materiales"],
      },
      {
        name: "Categorias Muebles",
        path: "/categorias-muebles",
        pro: false,
        requiredPermisos: ["ver_categorias_muebles"],
      },
      {
        name: "Muebles",
        path: "/muebles",
        pro: false,
        requiredPermisos: ["ver_muebles"],
      },
      {
        name: "Muebles Materiales",
        path: "/muebles-materiales",
        pro: false,
        requiredPermisos: ["ver_muebles_materiales"],
      },
      {
        name: "Compras Materiales",
        path: "/compras-materiales",
        pro: false,
        requiredPermisos: ["ver_compras_materiales"],
      },
      {
        name: "Detalles Compras",
        path: "/detalles-compras",
        pro: false,
        requiredPermisos: ["ver_detalles_compras"],
      },
      {
        name: "Diseños",
        path: "/diseños",
        pro: false,
        requiredPermisos: ["ver_diseños"],
      },
      {
        name: "Movimientos Inventario",
        path: "/movimientos-inventarios",
        pro: false,
        requiredPermisos: ["ver_movimientos_inventarios"],
      },
    ],
  },
  {
    icon: <FaShoppingCart className="w-5 h-5" />,
    name: "Ventas",
    subItems: [
      {
        name: "Ventas",
        path: "/ventas",
        pro: false,
        requiredPermisos: ["ver_ventas"],
      },
      {
        name: "Detalles Ventas",
        path: "/detalles-ventas",
        pro: false,
        requiredPermisos: ["ver_detalles_ventas"],
      },
      {
        name: "Pagos",
        path: "/pagos",
        pro: false,
        requiredPermisos: ["ver_pagos"],
      },
      {
        name: "Cotizaciones",
        path: "/admin-cotizaciones",
        pro: false,
        requiredPermisos: ["ver_cotizaciones"],
      },
      {
        name: "Detalles Cotizaciones",
        path: "/detalles-cotizaciones",
        pro: false,
        requiredPermisos: ["ver_detalles_cotizaciones"],
      },
      {
        name: "Costos Cotización",
        path: "/costos-cotizacion",
        pro: false,
        requiredPermisos: ["ver_costos_cotizacion"],
      },
      {
        name: "Devoluciones",
        path: "/devoluciones",
        pro: false,
        requiredPermisos: ["ver_devoluciones"],
      },
      {
        name: "Detalles Devoluciones",
        path: "/detalles-devoluciones",
        pro: false,
        requiredPermisos: ["ver_detalles_devoluciones"],
      },
    ],
  },
  {
    icon: <FaCube className="w-5 h-5" />,
    name: "Producción",
    subItems: [
      {
        name: "Producciones",
        path: "/producciones",
        pro: false,
        requiredPermisos: ["ver_producciones"],
      },
      {
        name: "Detalles Producciones",
        path: "/detalles-producciones",
        pro: false,
        requiredPermisos: ["ver_detalles_producciones"],
      },
      {
        name: "Etapas Producciones",
        path: "/etapas-producciones",
        pro: false,
        requiredPermisos: ["ver_etapas_producciones"],
      },
      {
        name: "Producciones Etapas",
        path: "/producciones-etapas",
        pro: false,
        requiredPermisos: ["ver_producciones_etapas"],
      },
      {
        name: "Evidencias Producción",
        path: "/evidencias-produccion",
        pro: false,
        requiredPermisos: ["ver_evidencias_produccion"],
      },
    ],
  },
  {
    icon: <FaHistory className="w-5 h-5" />,
    name: "Logs",
    path: "/logs",
    requiredPermisos: ["ver_logs"],
  },

  {
    name: "3D",
    icon: <FaCube className="w-5 h-5" />,
    subItems: [
      {
        name: "Diseño",
        path: "/prueba",
        pro: false,
        requiredPermisos: ["ver_diseños"],
      },
    ],
  },
];

const othersItems: NavItem[] = [
  /*{
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  }, */
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Obtener los permisos del usuario autenticado
  const { permissions, loading: loadingPermissions } = usePermissions();

  // Filtrar el menú según permisos (si no hay requiredPermisos se muestra por defecto)
  // Memoizado para evitar recálculos innecesarios que causan loops infinitos
  const filteredNavItems = useMemo(() => {
    if (loadingPermissions) return navItems;

    return navItems
      .map((item) => {
        // Si item tiene requiredPermisos, verificar que el usuario tenga al menos uno
        if (item.requiredPermisos && item.requiredPermisos.length > 0) {
          const allowed = item.requiredPermisos.some((p) =>
            permissions.includes(p)
          );
          if (!allowed) {
            return null; // no mostrar el item
          }
        }

        // Filtrar subitems por permisos
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter((sub) => {
            // Asume que subItems pueden contener requiredPermisos (debes actualizar navItems si quieres control granular)
            const req = (sub as any).requiredPermisos as string[] | undefined;
            if (!req || req.length === 0) return true;
            return req.some((p) => permissions.includes(p));
          });

          if (filteredSubItems.length === 0) {
            return null;
          }

          return { ...item, subItems: filteredSubItems };
        }

        return item;
      })
      .filter(Boolean) as NavItem[];
  }, [permissions, loadingPermissions]);

  // Sincronizar el submenú abierto con la ruta actual
  useEffect(() => {
    // Buscar si la ruta actual corresponde a algún subItem
    let matchedSubmenu: { type: "main" | "others"; index: number } | null =
      null;

    ["main", "others"].forEach((menuType) => {
      // Usar filteredNavItems para que los índices coincidan con el menú renderizado
      const items = menuType === "main" ? filteredNavItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              matchedSubmenu = {
                type: menuType as "main" | "others",
                index,
              };
            }
          });
        }
      });
    });

    // Solo actualizar el submenú si encontramos una coincidencia
    if (matchedSubmenu) {
      setOpenSubmenu(matchedSubmenu);
    }
  }, [location, isActive, filteredNavItems]);

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-orange-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
                alt="Logo"
                width={250}
                height={100}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
                alt="Logo"
                width={250}
                height={100}
              />
            </>
          ) : (
            <img
              src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
              alt="Logo"
              width={50}
              height={50}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-20px text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-20px text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
