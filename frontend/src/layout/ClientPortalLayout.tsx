import { Outlet } from "react-router-dom";
import ProductsHeader from "../components/Productos/ProductsHeader";
import ProfileMenu from "../components/UserProfile/ProfileMenu";

export default function ClientPortalLayout() {
  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      {/* Header */}
      <ProductsHeader />

      {/* Content with sidebar */}
      <div className="px-6 md:px-10 lg:px-12 py-8">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar menu */}
          <aside className="order-2 md:order-1">
            <ProfileMenu />
          </aside>

          {/* Main content - renders child routes */}
          <main className="order-1 md:order-2 md:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
