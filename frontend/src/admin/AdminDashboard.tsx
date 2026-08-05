import AdminLayout from "./AdminLayout";

function AdminDashboard() {
  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome to VERIXA Admin Panel
      </p>

      <div className="grid md:grid-cols-4 gap-6 mt-10">

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-gray-500">Total Applications</h2>

          <h1 className="text-4xl font-bold mt-3">
            0
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-gray-500">Pending</h2>

          <h1 className="text-4xl font-bold mt-3 text-orange-500">
            0
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-gray-500">Completed</h2>

          <h1 className="text-4xl font-bold mt-3 text-green-600">
            0
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-gray-500">Revenue</h2>

          <h1 className="text-4xl font-bold mt-3 text-blue-600">
            ₹0
          </h1>
        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;