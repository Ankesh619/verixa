
import AdminLayout from "./AdminLayout";
import { useEffect, useMemo, useState } from "react";
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

type Service = {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  requiredDocuments: string[];
  active: boolean;
  createdAt?: string;
};

const categories = [
  "All",
  "Identity",
  "Business",
  "Government",
  "Banking",
];

function Services() {
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const loadServices = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const {
        data,
        error: servicesError,
      } = await supabase
        .from("services")
        .select("*")
        .order("createdAt", {
          ascending: false,
        });

      if (servicesError) {
        throw servicesError;
      }

      setServices((data || []) as Service[]);
    } catch (err: any) {
      console.error("Services Load Error:", err);

      setError(
        err?.message ||
          "Unable to load services."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const activeServices = services.filter(
    (service) => service.active !== false
  ).length;

  const inactiveServices = services.filter(
    (service) => service.active === false
  ).length;

  const totalServiceValue = services.reduce(
    (total, service) =>
      total + Number(service.price || 0),
    0
  );

  const filteredServices = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !searchText ||
        service.serviceName
          ?.toLowerCase()
          .includes(searchText) ||
        service.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        service.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, categoryFilter]);

  const openEdit = (service: Service) => {
    setEditingId(service.id);

    setServiceName(
      service.serviceName || ""
    );

    setCategory(
      service.category || ""
    );

    setPrice(
      String(service.price ?? "")
    );

    if (
      Array.isArray(
        service.requiredDocuments
      )
    ) {
      setRequiredDocuments(
        service.requiredDocuments
      );
    } else {
      setRequiredDocuments([]);
    }

    setShowEdit(true);
    setError("");
  };

  const closeEdit = () => {
    if (saving) {
      return;
    }

    setShowEdit(false);
    setEditingId("");
    setServiceName("");
    setCategory("");
    setPrice("");
    setRequiredDocuments([]);
  };

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

  const saveService = async () => {
    if (!editingId) {
      return;
    }

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
        error: updateError,
      } = await supabase
        .from("services")
        .update({
          serviceName:
            serviceName.trim(),
          category,
          price: Number(price),
          requiredDocuments,
        })
        .eq("id", editingId);

      if (updateError) {
        throw updateError;
      }

      alert(
        "Service updated successfully."
      );

      closeEdit();
      await loadServices();
    } catch (err: any) {
      console.error(
        "Service Update Error:",
        err
      );

      alert(
        err?.message ||
          "Unable to update service."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (
    service: Service
  ) => {
    try {
      setUpdatingId(service.id);

      const newStatus =
        service.active === false;

      const {
        data,
        error: updateError,
      } = await supabase
        .from("services")
        .update({
          active: newStatus,
        })
        .eq("id", service.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setServices((previous) =>
          previous.map((item) =>
            item.id === service.id
              ? {
                  ...item,
                  active:
                    data.active,
                }
              : item
          )
        );
      }
    } catch (err: any) {
      console.error(
        "Service Status Error:",
        err
      );

      alert(
        err?.message ||
          "Unable to update service status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const deleteService = async (
    id: string,
    name: string
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${name}" service?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(id);

      const {
        error: deleteError,
      } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      setServices((previous) =>
        previous.filter(
          (service) =>
            service.id !== id
        )
      );

      alert(
        "Service deleted successfully."
      );
    } catch (err: any) {
      console.error(
        "Service Delete Error:",
        err
      );

      alert(
        err?.message ||
          "Unable to delete service."
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Services
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all VERIXA services
            </p>
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() =>
                loadServices(true)
              }
              disabled={refreshing}
              className="bg-white border border-gray-200 text-slate-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

            <Link
              to="/admin/add-service"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              + Add New Service
            </Link>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5">

            <p className="font-bold">
              Services Error
            </p>

            <p className="mt-1">
              {error}
            </p>

          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500">
              Total Services
            </p>

            <p className="text-4xl font-bold mt-3 text-slate-800">
              {loading
                ? "..."
                : services.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500">
              Active
            </p>

            <p className="text-4xl font-bold mt-3 text-green-600">
              {loading
                ? "..."
                : activeServices}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500">
              Inactive
            </p>

            <p className="text-4xl font-bold mt-3 text-red-600">
              {loading
                ? "..."
                : inactiveServices}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500">
              Total Service Value
            </p>

            <p className="text-4xl font-bold mt-3 text-blue-600">
              {loading
                ? "..."
                : `₹${totalServiceValue}`}
            </p>
          </div>

        </div>

        {/* Search / Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-5">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div className="lg:col-span-2 relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔎
              </span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search service by name or category..."
                className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="p-12 text-center">

              <div className="text-4xl mb-4">
                ⏳
              </div>

              <p className="text-gray-500">
                Loading services...
              </p>

            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                🛠️
              </div>

              <h2 className="text-xl font-bold text-slate-800">
                No Services Found
              </h2>

              <p className="text-gray-500 mt-2">
                {search ||
                categoryFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Add your first service to get started."}
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

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
                      Documents
                    </th>

                    <th className="text-left p-5">
                      Status
                    </th>

                    <th className="text-left p-5">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredServices.map(
                    (service) => {

                      const documents =
                        Array.isArray(
                          service.requiredDocuments
                        )
                          ? service.requiredDocuments
                          : [];

                      const isUpdating =
                        updatingId ===
                        service.id;

                      const isActive =
                        service.active !==
                        false;

                      return (
                        <tr
                          key={service.id}
                          className="border-t hover:bg-gray-50"
                        >

                          {/* Service */}
                          <td className="p-5">

                            <div className="font-bold text-slate-800">
                              {
                                service.serviceName ||
                                  "-"
                              }
                            </div>

                            <div className="text-xs text-gray-400 mt-1">
                              ID:{" "}
                              {service.id}
                            </div>

                          </td>

                          {/* Category */}
                          <td className="p-5">

                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                              {
                                service.category ||
                                  "-"
                              }
                            </span>

                          </td>

                          {/* Price */}
                          <td className="p-5">

                            <span className="font-bold text-blue-600">
                              ₹
                              {Number(
                                service.price ||
                                  0
                              )}
                            </span>

                          </td>

                          {/* Documents */}
                          <td className="p-5">

                            {documents.length >
                            0 ? (
                              <div>
                                <span className="font-semibold text-slate-700">
                                  {
                                    documents.length
                                  }{" "}
                                  document
                                  {documents.length !==
                                  1
                                    ? "s"
                                    : ""}
                                </span>

                                <div className="text-xs text-gray-400 mt-1 max-w-[230px] truncate">
                                  {
                                    documents.join(
                                      ", "
                                    )
                                  }
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">
                                No documents
                              </span>
                            )}

                          </td>

                          {/* Status */}
                          <td className="p-5">

                            <button
                              type="button"
                              disabled={
                                isUpdating
                              }
                              onClick={() =>
                                toggleActive(
                                  service
                                )
                              }
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                isActive
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              } disabled:opacity-50`}
                            >
                              {isUpdating
                                ? "Updating..."
                                : isActive
                                ? "Active"
                                : "Inactive"}
                            </button>

                          </td>

                          {/* Actions */}
                          <td className="p-5">

                            <div className="flex items-center gap-4">

                              <button
                                type="button"
                                onClick={() =>
                                  openEdit(
                                    service
                                  )
                                }
                                className="text-blue-600 font-semibold hover:underline"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  deleteService(
                                    service.id,
                                    service.serviceName
                                  )
                                }
                                className="text-red-600 font-semibold hover:underline disabled:opacity-50"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

          {!loading &&
            filteredServices.length >
              0 && (
              <div className="border-t bg-slate-50 px-5 py-4 text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {
                    filteredServices.length
                  }
                </span>{" "}
                services out of{" "}
                <span className="font-bold text-slate-700">
                  {services.length}
                </span>
              </div>
            )}

        </div>

      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">

            <div className="flex items-center justify-between p-6 border-b">

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Edit Service
                </h2>

                <p className="text-gray-500 mt-1">
                  Update service information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              {/* Service Name */}
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
                className="w-full border border-gray-200 rounded-xl p-4 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Service Name"
              />

              {/* Category */}
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
                className="w-full border border-gray-200 rounded-xl p-4 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* Price */}
              <label className="block font-semibold text-slate-700 mb-2">
                Price
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) =>
                  setPrice(
                    event.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl p-4 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Price"
              />

              {/* Documents */}
              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Required Documents
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Select documents required from customers.
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {
                    requiredDocuments.length
                  }{" "}
                  selected
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">

                {documentList.map(
                  (documentName) => (

                    <label
                      key={documentName}
                      className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer ${
                        requiredDocuments.includes(
                          documentName
                        )
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={requiredDocuments.includes(
                          documentName
                        )}
                        onChange={() =>
                          toggleDocument(
                            documentName
                          )
                        }
                        className="w-4 h-4"
                      />

                      <span className="text-sm">
                        {
                          documentName
                        }
                      </span>

                    </label>

                  )
                )}

              </div>

            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveService}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </AdminLayout>
  );
}

export default Services;