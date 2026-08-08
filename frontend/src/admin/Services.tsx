import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../supabase";

const documentList = [
  "Aadhaar Front",
  "Aadhaar Back",
  "PAN Card",
  "Passport Photo",
  "Signature",
  "Bank Passbook",
  "Electricity Bill",
  "10th Marksheet",
  "Income Certificate",
  "Caste Certificate",
  "Domicile Certificate",
  "Birth Certificate",
];

function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false);

  const [editingId, setEditingId] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);

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

    setServiceName(service.serviceName || "");
    setCategory(service.category || "");
    setPrice(String(service.price ?? ""));

    // Supabase jsonb से documents array लेना
    if (Array.isArray(service.requiredDocuments)) {
      setRequiredDocuments(service.requiredDocuments);
    } else {
      setRequiredDocuments([]);
    }

    setShowEdit(true);
  };

  const toggleDocument = (documentName: string) => {
    if (requiredDocuments.includes(documentName)) {
      setRequiredDocuments(
        requiredDocuments.filter(
          (item) => item !== documentName
        )
      );
    } else {
      setRequiredDocuments([
        ...requiredDocuments,
        documentName,
      ]);
    }
  };

  const saveService = async () => {
    if (!editingId) return;

    if (!serviceName.trim()) {
      alert("Please enter service name.");
      return;
    }

    if (!category) {
      alert("Please select category.");
      return;
    }

    if (!price) {
      alert("Please enter price.");
      return;
    }

    if (requiredDocuments.length === 0) {
      alert("Please select at least one required document.");
      return;
    }

    const { error } = await supabase
      .from("services")
      .update({
        serviceName: serviceName.trim(),
        category,
        price: Number(price),
        requiredDocuments,
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

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center overflow-y-auto p-4">

          <div className="bg-white rounded-2xl p-8 w-full max-w-[600px] my-8">

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
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full border rounded-xl p-4 mb-6"
              placeholder="Price"
            />

            <h3 className="text-2xl font-bold mb-4">
              Required Documents
            </h3>

            <div className="grid md:grid-cols-2 gap-3 mb-8">

              {documentList.map((documentName) => (

                <label
                  key={documentName}
                  className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-gray-50"
                >

                  <input
                    type="checkbox"
                    checked={requiredDocuments.includes(
                      documentName
                    )}
                    onChange={() =>
                      toggleDocument(documentName)
                    }
                  />

                  <span>
                    {documentName}
                  </span>

                </label>

              ))}

            </div>

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