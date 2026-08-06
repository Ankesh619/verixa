import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

function Services() {
const [showEdit, setShowEdit] = useState(false);
const [services, setServices] = useState<any[]>([]);

useEffect(() => {
  loadServices();
}, []);

const loadServices = async () => {
  const querySnapshot = await getDocs(collection(db, "services"));

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setServices(data);
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

  {services.map((service) => (

    <tr key={service.id} className="border-t">

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
          onClick={() => setShowEdit(true)}
          className="text-blue-600 mr-4"
        >
          Edit
        </button>

        <button className="text-red-600">
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
        className="w-full border rounded-xl p-4 mb-4"
        defaultValue="PAN Card"
      />

      <input
        className="w-full border rounded-xl p-4 mb-4"
        defaultValue="199"
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowEdit(false)}
          className="px-5 py-3 rounded-xl bg-gray-200"
        >
          Cancel
        </button>

        <button
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