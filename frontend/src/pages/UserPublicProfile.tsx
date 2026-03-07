import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import ProductsHeader from "../components/Productos/ProductsHeader";
import ProfileMenu from "../components/UserProfile/ProfileMenu";

export default function UserPublicProfile() {
  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      <PageMeta
        title="Perfil público | Bosquejo"
        description="Perfil público del usuario — sin la interfaz de administrador"
      />

      {/* Reusar el mismo navbar que en Products */}
      <ProductsHeader />

      {/* BreadCrumb y contenido con menú lateral */}
      <div className="px-6 md:px-10 lg:px-12 py-8">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Menú lateral público (componente) */}
          <aside className="order-2 md:order-1">
            <ProfileMenu />
          </aside>

          {/* Contenido principal */}
          <main className="order-1 md:order-2 md:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7">
                Mi perfil
              </h3>
              <div className="space-y-6">
                <UserMetaCard forceLight />
                <UserInfoCard forceLight />
                <UserAddressCard forceLight />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
