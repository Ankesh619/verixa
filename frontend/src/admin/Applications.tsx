import AdminLayout from "./AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";

type Application = {
  id: string;
  customerName: string;
  mobile: string;
  serviceId: string;
  serviceName: string;
  category: string | null;
  price: number;
  documents: Record<string, string>;
  status: string;
  createdAt: string;
};

type ApplicationNumber = {
  applicationId: string;
  applicationNo: string;
  createdAt?: string;
};

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Processing",
  "Completed",
  "Rejected",
];

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [applicationNumbers, setApplicationNumbers] =
    useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: applicationData,
        error: applicationError,
      } = await supabase
        .from("applications")
        .select("*")
        .order("createdAt", { ascending: false });

      if (applicationError) {
        throw applicationError;
      }

      const {
        data: numberData,
        error: numberError,
      } = await supabase
        .from("applicationNumbers")
        .select("*");

      if (numberError) {
        throw numberError;
      }

      const numberMap: Record<string, string> = {};

      (numberData || []).forEach(
        (item: ApplicationNumber) => {
          numberMap[item.applicationId] =
            item.applicationNo;
        }
      );

      setApplicationNumbers(numberMap);
      setApplications(
        (applicationData || []) as Application[]
      );
    } catch (err: any) {
      console.error(
        "Applications Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getStatusClass = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const filteredApplications =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return applications.filter(
        (application) => {
          const applicationNo =
            (
              applicationNumbers[
                application.id
              ] || ""
            ).toLowerCase();

          const customerName =
            (
              application.customerName ||
              ""
            ).toLowerCase();

          const mobile =
            application.mobile || "";

          const serviceName =
            (
              application.serviceName ||
              ""
            ).toLowerCase();

          const matchesSearch =
            !searchText ||
            applicationNo.includes(
              searchText
            ) ||
            customerName.includes(
              searchText
            ) ||
            mobile.includes(
              searchText
            ) ||
            serviceName.includes(
              searchText
            );

          const matchesStatus =
            statusFilter === "All" ||
            (
              application.status ||
              "Pending"
            ).toLowerCase() ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      applications,
      applicationNumbers,
      search,
      statusFilter,
    ]);

  const updateStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      setUpdatingStatus(true);
      setError("");

      const {
        error: updateError,
      } = await supabase
        .from("applications")
        .update({
          status: newStatus,
        })
        .eq("id", applicationId);

      if (updateError) {
        throw updateError;
      }

      setApplications(
        (previous) =>
          previous.map(
            (application) =>
              application.id ===
              applicationId
                ? {
                    ...application,
                    status: newStatus,
                  }
                : application
          )
      );

      setSelectedApplication(
        (previous) =>
          previous
            ? {
                ...previous,
                status: newStatus,
              }
            : null
      );
    } catch (err: any) {
      console.error(
        "Status Update Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getDocumentEntries = (
    documents: Record<string, string>
  ) => {
    if (
      !documents ||
      typeof documents !==
        "object"
    ) {
      return [];
    }

    return Object.entries(
      documents
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-xl font-semibold text-gray-600">
            Loading applications...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Applications
            </h1>

            <p className="text-gray-500 mt-2">
              Manage customer service applications
            </p>
          </div>

          <button
            type="button"
            onClick={loadApplications}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold"
          >
            ↻ Refresh
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-xl">
            <p className="font-semibold">
              Error
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>
        )}

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">
              Total Applications
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {applications.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {
                applications.filter(
                  (item) =>
                    (
                      item.status ||
                      "Pending"
                    ).toLowerCase() ===
                    "pending"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">
              Processing
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {
                applications.filter(
                  (item) =>
                    (
                      item.status ||
                      ""
                    ).toLowerCase() ===
                    "processing"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">
              Completed
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {
                applications.filter(
                  (item) =>
                    (
                      item.status ||
                      ""
                    ).toLowerCase() ===
                    "completed"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Search + Filter */}

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div className="lg:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Applications
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search by application number, customer, mobile or service..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

            </div>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-800">
              {
                filteredApplications.length
              }
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">
              {applications.length}
            </span>{" "}
            applications
          </div>

        </div>

        {/* No Applications */}

        {applications.length ===
          0 && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-5xl mb-4">
              📋
            </div>

            <h2 className="text-2xl font-bold">
              No Applications Found
            </h2>

            <p className="text-gray-500 mt-2">
              Submitted applications will appear here.
            </p>

          </div>
        )}

        {/* Search No Result */}

        {applications.length >
          0 &&
          filteredApplications.length ===
            0 && (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

              <div className="text-5xl mb-4">
                🔍
              </div>

              <h2 className="text-2xl font-bold">
                No Matching Applications
              </h2>

              <p className="text-gray-500 mt-2">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        {/* Applications Table */}

        {filteredApplications.length >
          0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Application No.
                    </th>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Customer
                    </th>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Mobile
                    </th>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Service
                    </th>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Price
                    </th>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Status
                    </th>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Created
                    </th>

                    <th className="text-left p-5 text-sm font-bold text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredApplications.map(
                    (application) => (
                      <tr
                        key={
                          application.id
                        }
                        className="border-t hover:bg-gray-50 transition"
                      >

                        {/* Application Number */}

                        <td className="p-5">

                          <span className="font-bold text-blue-600">
                            {
                              applicationNumbers[
                                application.id
                              ] || "-"
                            }
                          </span>

                        </td>

                        {/* Customer */}

                        <td className="p-5">

                          <div className="font-semibold text-gray-900">
                            {
                              application.customerName
                            }
                          </div>

                          <div className="text-sm text-gray-500 mt-1">
                            {
                              application.category ||
                              "-"
                            }
                          </div>

                        </td>

                        {/* Mobile */}

                        <td className="p-5">

                          <a
                            href={`tel:${application.mobile}`}
                            className="text-blue-600 hover:underline"
                          >
                            {
                              application.mobile
                            }
                          </a>

                        </td>

                        {/* Service */}

                        <td className="p-5">

                          <div className="font-semibold">
                            {
                              application.serviceName
                            }
                          </div>

                        </td>

                        {/* Price */}

                        <td className="p-5 font-semibold">

                          ₹
                          {Number(
                            application.price ||
                              0
                          )}

                        </td>

                        {/* Status */}

                        <td className="p-5">

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {
                              application.status ||
                              "Pending"
                            }
                          </span>

                        </td>

                        {/* Created */}

                        <td className="p-5 text-gray-600 text-sm">

                          {formatDate(
                            application.createdAt
                          )}

                        </td>

                        {/* Action */}

                        <td className="p-5">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedApplication(
                                application
                              )
                            }
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* Total */}

        {applications.length >
          0 && (
          <div className="text-gray-500">

            Total Applications:{" "}

            <span className="font-bold text-gray-900">
              {applications.length}
            </span>

          </div>
        )}

      </div>

      {/* Application Details Modal */}

      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedApplication(
              null
            )
          }
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="p-6 border-b flex items-start justify-between gap-4">

              <div>

                <p className="text-sm text-gray-500">
                  Application Number
                </p>

                <h2 className="text-2xl font-bold text-blue-600 mt-1">
                  {
                    applicationNumbers[
                      selectedApplication
                        .id
                    ] || "-"
                  }
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
                className="text-gray-500 hover:text-gray-900 text-2xl"
              >
                ×
              </button>

            </div>

            <div className="p-6 space-y-6">

              {/* Customer Details */}

              <div>

                <h3 className="text-lg font-bold mb-4">
                  Customer Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Customer Name
                    </p>

                    <p className="font-semibold mt-1">
                      {
                        selectedApplication.customerName
                      }
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Mobile
                    </p>

                    <a
                      href={`tel:${selectedApplication.mobile}`}
                      className="font-semibold text-blue-600 hover:underline mt-1 block"
                    >
                      {
                        selectedApplication.mobile
                      }
                    </a>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Category
                    </p>

                    <p className="font-semibold mt-1">
                      {
                        selectedApplication.category ||
                        "-"
                      }
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Service
                    </p>

                    <p className="font-semibold mt-1">
                      {
                        selectedApplication.serviceName
                      }
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Price
                    </p>

                    <p className="font-semibold mt-1">
                      ₹
                      {Number(
                        selectedApplication.price ||
                          0
                      )}
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Created
                    </p>

                    <p className="font-semibold mt-1">
                      {formatDate(
                        selectedApplication.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* Status */}

              <div>

                <h3 className="text-lg font-bold mb-4">
                  Application Status
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">

                  <select
                    value={
                      selectedApplication.status ||
                      "Pending"
                    }
                    disabled={
                      updatingStatus
                    }
                    onChange={(e) =>
                      updateStatus(
                        selectedApplication.id,
                        e.target.value
                      )
                    }
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                  </select>

                  {updatingStatus && (
                    <div className="flex items-center text-gray-500">
                      Updating...
                    </div>
                  )}

                </div>

              </div>

              {/* Documents */}

              <div>

                <h3 className="text-lg font-bold mb-4">
                  Uploaded Documents
                </h3>

                {getDocumentEntries(
                  selectedApplication.documents
                ).length >
                0 ? (

                  <div className="space-y-3">

                    {getDocumentEntries(
                      selectedApplication.documents
                    ).map(
                      ([
                        documentName,
                        documentUrl,
                      ]) => (

                        <div
                          key={
                            documentName
                          }
                          className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >

                          <div>

                            <p className="font-semibold">
                              {
                                documentName
                              }
                            </p>

                            <p className="text-xs text-gray-400 mt-1 break-all">
                              {
                                documentUrl
                              }
                            </p>

                          </div>

                          <a
                            href={
                              documentUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-center"
                          >
                            View Document
                          </a>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="bg-gray-50 rounded-xl p-5 text-gray-500 text-center">
                    No documents uploaded.
                  </div>

                )}

              </div>

            </div>

            {/* Modal Footer */}

            <div className="p-6 border-t flex justify-end">

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}
    </AdminLayout>
  );
}

export default Applications;