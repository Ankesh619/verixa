import type { ReactNode } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

type Props = {
  children: ReactNode;
};

function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>

      </div>

    </div>
  );
}

export default AdminLayout;