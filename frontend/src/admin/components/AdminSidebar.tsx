
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  FolderOpen,
  BarChart3,
  LogOut,
} from "lucide-react";

function AdminSidebar() {
  return (
    <div className="relative h-full min-h-screen bg-slate-900 text-white">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-blue-400">
          VERIXA
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Admin Panel
        </p>
      </div>

      <div className="flex flex-col p-4 gap-2">

        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
        >
          <LayoutDashboard size={22} />
          Dashboard
        </Link>

        <Link
          to="/admin/applications"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
        >
          <FileText size={22} />
          Applications
        </Link>

        <Link
          to="/admin/customers"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
        >
          <Users size={22} />
          Customers
        </Link>

        <Link
          to="/admin/services"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
        >
          <FolderOpen size={22} />
          Services
        </Link>

        <Link
          to="/admin/payments"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
        >
          <CreditCard size={22} />
          Payments
        </Link>

        <Link
          to="/admin/reports"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
        >
          <BarChart3 size={22} />
          Reports
        </Link>

      </div>

      <div className="absolute bottom-8 left-4">
        <button
          type="button"
          className="flex items-center gap-3 text-red-400 hover:text-red-300"
        >
          <LogOut size={22} />
          Logout
        </button>
      </div>

    </div>
  );
}

export default AdminSidebar;
