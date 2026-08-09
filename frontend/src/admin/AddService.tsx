
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function AddService() {
  const navigate = useNavigate();

  const [serviceName, setServiceName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [requiredDocuments, setRequiredDocuments] =
    useState<string[]>([]);

  const [saving, setSaving] =
    useState(false);

  const toggleDocument = (
    documentName: string
  ) => {
    setRequiredDocuments((previous) => {
      if (
        previous.includes(documentName)
      ) {
        return previous.filter(
          (item) =>
            item !== documentName
        );
      }

      return [
        ...previous,
        documentName,
      ];
    });
  };

  const handleSave = async () => {
    if (!serviceName.trim()) {
      alert("Please enter service name.");
      return;
    }

    if (!category) {
      alert("Please select category.");
      return;
    }

    if (
      price === "" ||
      Number(price) < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      requiredDocuments.length === 0
    ) {
      alert(
        "Please select at least one required document."
      );
      return;
    }

    try {
      setSaving(true);

      const {
        error,
      } = await supabase
        .from("services")
        .insert([
          {
            serviceName:
              serviceName.trim(),
            category,
            price: Number(price),
            requiredDocuments,
            active: true,
          },
        ]);

      if (error) {
        throw error;
      }

      alert(
        "Service added successfully."
      );

      navigate("/admin/services");
    } catch (err: any) {
      console.error(
        "Add Service Error:",
        err
      );

      alert(
        err?.message ||
          "Unable to add service."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Add New Service
            </h1>

            <p className="text-gray-500 mt-2">
              Create a new service for VERIXA customers.
            </p>
          </div>

          <Link
            to="/admin/services"
            className="inline-flex items-center justify-center bg-white border border-gray-200 text-slate-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-50"
          >
            ← Back to Services
          </Link>

        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

          {/* Basic Information */}
          <div className="mb-10">

            <h2 className="text-2xl font-bold text-slate-800">
              Service Information
            </h2>

            <p className="text-gray-500 mt-1 mb-6">
              Enter the basic details of the service.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Service Name */}
              <div className="md:col-span-2">

                <label className="block font-semibold text-slate-700 mb-2">
                  Service Name
                </label>

                <input
                  value={serviceName}
                  onChange={(event) =>
                    setServiceName(
                      event.target.value
                    )
                  }
                  placeholder="Example: Aadhaar PVC Card"
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Category */}
              <div>

                <label className="block font-semibold text-slate-700 mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Identity">
                    Identity
                  </option>

                  <option value="Business">
                    Business
                  </option>

                  <option value="Government">
                    Government
                  </option>

                  <option value="Banking">
                    Banking
                  </option>

                </select>

              </div>

              {/* Price */}
              <div>

                <label className="block font-semibold text-slate-700 mb-2">
                  Service Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    placeholder="99"
                    className="w-full border border-gray-200 rounded-xl p-4 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Documents */}
          <div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Required Documents
                </h2>

                <p className="text-gray-500 mt-1">
                  Select documents the customer must submit.
                </p>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {
                  requiredDocuments.length
                }{" "}
                selected
              </span>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {documentList.map(
                (documentName) => {

                  const selected =
                    requiredDocuments.includes(
                      documentName
                    );

                  return (
                    <label
                      key={documentName}
                      className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleDocument(
                            documentName
                          )
                        }
                        className="w-5 h-5"
                      />

                      <span className="font-medium">
                        {
                          documentName
                        }
                      </span>

                    </label>
                  );
                }
              )}

            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-10 pt-6 border-t">

            <Link
              to="/admin/services"
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-center font-semibold text-slate-700"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400"
            >
              {saving
                ? "Saving Service..."
                : "Save Service"}
            </button>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default AddService;
