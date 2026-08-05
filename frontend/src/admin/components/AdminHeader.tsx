import { Bell, Search, UserCircle } from "lucide-react";

function AdminHeader() {
  return (
    <div className="bg-white shadow-md h-20 px-8 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <Search className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="outline-none text-lg"
        />

      </div>

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell size={24} />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">

            3

          </span>

        </button>

        <div className="flex items-center gap-3">

          <UserCircle
            size={42}
            className="text-blue-600"
          />

          <div>

            <h3 className="font-bold">
              Admin
            </h3>

            <p className="text-gray-500 text-sm">
              Super Admin
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminHeader;