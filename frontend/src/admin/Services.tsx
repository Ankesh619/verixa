import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../supabase";

function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false);

  const [editingId, setEditingId] = useState("");

  const [serviceName, setServiceName] = useState("");

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setServices(data || []);
  };

  const openEdit = (service: any) => {
    setEditingId(service.id);

    setServiceName(service.serviceName);

    setCategory(service.category);

    setPrice(String(service.price));

    setShowEdit(true);
  };

  const saveService = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("services")
      .update({
        serviceName,
        category,
        price: Number(price),
      })
      .eq("id", editingId);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Service Updated Successfully");

    setShowEdit(false);

    loadServices();
  };

  const deleteService = async (id: string) => {
    const ok = window.confirm(
      "Delete this service?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Service Deleted Successfully");

    loadServices();
  };

  return (
    <AdminLayout>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Services Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all VERIXA services
          </p>

        </div>

        <Link
          to="/admin/add-service"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          + Add New Service
        </Link>

      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-5">
                Service
              </th>

              <th className="text-left p-5">
                Category
              </th>

              <th className="text-left p-5">
                Price
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-left p-5">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {services.map((service) => (

              <tr key={service.id}>

                <td className="p-5">
                  {service.serviceName}
                </td>

                <td className="p-5">
                  {service.category}
                </td>

                <td className="p-5">
                  ₹{service.price}
                </td>

                <td className="p-5">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Active
                  </span>

                </td>

                <td className="p-5">

                  <button
                    onClick={() => openEdit(service)}
                    className="text-blue-600 font-semibold mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showEdit && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-2xl p-8 w-[500px]">

            <h2 className="text-3xl font-bold mb-6">
              Edit Service
            </h2>

            <input
              value={serviceName}
              onChange={(e) =>
                setServiceName(e.target.value)
              }
              className="w-full border rounded-xl p-4 mb-4"
              placeholder="Service Name"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border rounded-xl p-4 mb-4"
            >

              <option value="">
                Select Category
              </option>

              <option>
                Identity
              </option>

              <option>
                Business
              </option>

              <option>
                Government
              </option>

              <option>
                Banking
              </option>

            </select>

            <input
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full border rounded-xl p-4 mb-5"
              placeholder="Price"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowEdit(false)}
                className="px-5 py-3 rounded-xl bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={saveService}
                className="px-5 py-3 rounded-xl bg-blue-600 text-white"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}

export default Services;