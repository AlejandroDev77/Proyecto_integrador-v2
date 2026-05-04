import { BrowserRouter as Router, Routes, Route } from "react-router";
import { PermissionsProvider } from "./context/PermissionsContext";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/Cart/CartDrawer";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import Usuarios from "./pages/Tables/Usuarios";
import Clientes from "./pages/Tables/Clientes";
import Empleados from "./pages/Tables/Empleados";
import Materiales from "./pages/Tables/Materiales";
import Categorias_Muebles from "./pages/Tables/Categorias_Muebles";
import Muebles_Materiales from "./pages/Tables/Muebles_Materiales";
import Proveedores from "./pages/Tables/Proveedores";
import Muebles from "./pages/Tables/Muebles";
import Prueba from "./pages/Tables/PruebaModificacion3D";
import Compras_Materiales from "./pages/Tables/Compras_Materiales";
import Ventas from "./pages/Tables/Ventas";
import Detalles_Compras from "./pages/Tables/Detalles_Compras";
import Detalles_Ventas from "./pages/Tables/Detalles_Ventas";
import Pagos from "./pages/Tables/Pagos";
import Detalles_Cotizaciones from "./pages/Tables/Detalles_Cotizaciones";
import Cotizaciones from "./pages/Tables/Cotizaciones";
import Detalles_Devoluciones from "./pages/Tables/Detalles_Devoluciones";
import Etapas_Producciones from "./pages/Tables/Etapas_Producciones";
import Producciones_Etapas from "./pages/Tables/Producciones_Etapas";
import Detalles_Producciones from "./pages/Tables/Detalles_Producciones";
import Devoluciones from "./pages/Tables/Devoluciones";
import Logs from "./components/tables/BasicTables/Logs";
import Producciones from "./pages/Tables/Producciones";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import ClientPortalLayout from "./layout/ClientPortalLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Landing from "./pages/Landing/Landing";
import Products from "./pages/Products/Products";
import UserPublicProfile from "./pages/UserPublicProfile";
import Permisos from "./pages/Tables/Permisos";
import Roles from "./pages/Tables/Roles";
import Roles_Permiso from "./pages/Tables/Roles_Permisos";
import PermissionRoute from "./components/PermissionRoute";
import Diseños from "./pages/Tables/Diseños";
import Movimientos_Inventarios from "./pages/Tables/Movimientos_Inventarios";
import Negocio from "./pages/Tables/Negocio";
import CostosCotizacion from "./pages/Tables/CostosCotizacion";
import EvidenciasProduccion from "./pages/Tables/EvidenciasProduccion";

// Client Portal Pages
import MisCotizaciones from "./pages/ClientPortal/MisCotizaciones";
import MisPedidos from "./pages/ClientPortal/MisPedidos";
import SolicitarCotizacion from "./pages/ClientPortal/SolicitarCotizacion";
import MisFavoritos from "./pages/ClientPortal/MisFavoritos";
import MiCarrito from "./pages/ClientPortal/MiCarrito";
import MisProducciones from "./pages/ClientPortal/MisProducciones";

import Home from "./pages/Dashboard/Home";
import Chatbot from "./components/ui/chatbot/Chatbot";

import { GoogleOAuthProvider } from "@react-oauth/google"; // autenticacion con google

export default function App() {
  return (
    <GoogleOAuthProvider clientId="828039070580-33kssas6vujhm90ofclcundsc8ko0fsj.apps.googleusercontent.com">
      <PermissionsProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <CartDrawer />
            <Chatbot />
            <Routes>
              {/* Rutas publicas */}
              <Route path="/products" element={<Products />} />
              <Route path="/" element={<Landing />} />

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                {/* Perfil publico (independiente, sin layout de admin) */}
                <Route path="/user-profile" element={<UserPublicProfile />} />

                {/* Rutas del portal de clientes - Anidadas bajo ClientPortalLayout */}
                <Route element={<ClientPortalLayout />}>
                  <Route path="/cotizaciones" element={<MisCotizaciones />} />
                  <Route path="/pedidos" element={<MisPedidos />} />
                  <Route
                    path="/solicitar-cotizacion"
                    element={<SolicitarCotizacion />}
                  />
                  <Route path="/favoritos" element={<MisFavoritos />} />
                  <Route path="/carrito" element={<MiCarrito />} />
                  <Route
                    path="/mis-producciones"
                    element={<MisProducciones />}
                  />
                </Route>

                {/* Dashboard/Admin Layout */}
                <Route element={<AppLayout />}>
                  {/* <Route index path="/home" element={<Home />} />*/}

                  {/* <Route element={<PermissionRoute permiso="ver_permiso" />}>
                  <Route path="/permisos" element={<Permisos />} />
                </Route> */}
                  <Route path="/permisos" element={<Permisos />} />
                  <Route path="/roles" element={<Roles />} />

                  <Route path="/roles-permisos" element={<Roles_Permiso />} />

                  {/* Others Page */}
                  <Route path="/profile" element={<UserProfiles />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/blank" element={<Blank />} />
                  <Route path="/dashboard" element={<Home />} />

                  {/* Forms */}
                  <Route path="/form-elements" element={<FormElements />} />

                  <Route path="/negocio" element={<Negocio />} />

                  {/* Tables */}
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/empleados" element={<Empleados />} />
                  <Route path="/materiales" element={<Materiales />} />
                  <Route
                    path="/categorias-muebles"
                    element={<Categorias_Muebles />}
                  />
                  <Route path="/diseños" element={<Diseños />} />
                  <Route
                    path="/movimientos-inventarios"
                    element={<Movimientos_Inventarios />}
                  />
                  <Route path="/muebles" element={<Muebles />} />
                  <Route
                    path="/muebles-materiales"
                    element={<Muebles_Materiales />}
                  />
                  <Route path="/proveedores" element={<Proveedores />} />
                  <Route path="/prueba" element={<Prueba />} />
                  <Route
                    path="/compras-materiales"
                    element={<Compras_Materiales />}
                  />
                  <Route path="/ventas" element={<Ventas />} />
                  <Route
                    path="/detalles-compras"
                    element={<Detalles_Compras />}
                  />
                  <Route
                    path="/detalles-ventas"
                    element={<Detalles_Ventas />}
                  />
                  <Route path="/pagos" element={<Pagos />} />
                  <Route
                    path="/detalles-cotizaciones"
                    element={<Detalles_Cotizaciones />}
                  />
                  <Route
                    path="/detalles-devoluciones"
                    element={<Detalles_Devoluciones />}
                  />

                  <Route
                    path="/admin-cotizaciones"
                    element={<Cotizaciones />}
                  />
                  <Route
                    path="/detalles-producciones"
                    element={<Detalles_Producciones />}
                  />
                  <Route path="/devoluciones" element={<Devoluciones />} />
                  <Route
                    path="/etapas-producciones"
                    element={<Etapas_Producciones />}
                  />
                  <Route
                    path="/producciones-etapas"
                    element={<Producciones_Etapas />}
                  />
                  <Route path="/producciones" element={<Producciones />} />
                  <Route
                    path="/costos-cotizacion"
                    element={<CostosCotizacion />}
                  />
                  <Route
                    path="/evidencias-produccion"
                    element={<EvidenciasProduccion />}
                  />
                  <Route
                    path="/logs"
                    element={
                      <PermissionRoute permiso="ver_logs">
                        <Logs />
                      </PermissionRoute>
                    }
                  />

                  {/* Tables with Role Based Access Control */}
                  {/* <Route path="/diseños" element={<Diseños />} /> */}
                  {/* <Route path="/movimientos-inventarios" element={<Movimientos_Inventarios />} /> */}

                  {/* 3D Modelling */}
                  {/* <Route path="/prueba-modificacion-3d" element={<PruebaModificacion3D />} /> */}

                  {/* Basic Tables */}
                  {/* <Route path="/compras-materiales" element={<Compras_Materiales />} /> */}
                  {/* <Route path="/detalles-compras" element={<Detalles_Compras />} /> */}
                  {/* <Route path="/detalles-ventas" element={<Detalles_Ventas />} /> */}

                  {/* Tables with Role Based Access Control 
            
            

           
            <Route path="/diseños" element={<Diseños />} />
            <Route path="/movimientos-inventarios" element={<Movimientos_Inventarios />} />
            
                */}
                  {/* 3D Modelling */}

                  {/* Basic Tables */}

                  {/* <Route path="/compras-materiales" element={<Compras_Materiales />} /> */}
                  {/* <Route path="/detalles-compras" element={<Detalles_Compras />} /> */}
                  {/* <Route path="/detalles-ventas" element={<Detalles_Ventas />} /> */}
                  {/* <Route path="/prueba" element={<Prueba />} /> */}

                  {/* 3D Modelling */}
                  {/* <Route path="/prueba-modificacion-3d" element={<PruebaModificacion3D />} /> */}

                  {/* <Route path="/muebles-materiales" element={<Muebles_Materiales />} /> */}
                  {/* <Route path="/muebles-materiales" element={<Muebles_Materiales />} /> */}

                  {/* Basic Tables */}

                  {/* Ui Elements */}
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/avatars" element={<Avatars />} />
                  <Route path="/badge" element={<Badges />} />
                  <Route path="/buttons" element={<Buttons />} />
                  <Route path="/images" element={<Images />} />
                  <Route path="/videos" element={<Videos />} />

                  {/* Charts */}
                  <Route path="/line-chart" element={<LineChart />} />
                  <Route path="/bar-chart" element={<BarChart />} />
                </Route>
              </Route>

              {/* Auth Layout */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </CartProvider>
      </PermissionsProvider>
    </GoogleOAuthProvider>
  );
}
