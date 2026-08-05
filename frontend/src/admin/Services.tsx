import AdminLayout from "./AdminLayout";

function Services() {
  return (
    <AdminLayout>

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold">
            Services
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all VERIXA services
          </p>

        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
          + Add Service
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-lg mt-10 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-5">Service</th>

              <th className="text-left p-5">Category</th>

              <th className="text-left p-5">Price</th>

              <th className="text-left p-5">Status</th>

              <th className="text-left p-5">Action</th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-t">

              <td className="p-5">
                New PAN Card
              </td>

              <td className="p-5">
                Identity
              </td>

              <td className="p-5">
                ₹199
              </td>

              <td className="p-5">

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                  Active

                </span>

              </td>

              <td className="p-5">

                <button className="text-blue-600 mr-4">
                  Edit
                </button>

                <button className="text-red-600">
                  Delete
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}

export default Services;