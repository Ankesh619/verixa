import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Application = {
  id: string;
  customerName: string;
  mobile: string;
  serviceId: string;
  serviceName: string;
  category: string;
  price: number;
  documents: Record<string, string>;
  status: string;
  createdAt: string;
};

type ApplicationNumber = {
  applicationId: string;
  applicationNo: string;
};

const STATUS_OPTIONS = [
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

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /*
   * Load Applications
   */
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Get applications
       */
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

      /*
       * Get application numbers
       */
      const {
        data: numberData,
        error: numberError,
      } = await supabase
        .from("applicationNumbers")
        .select("*");

      if (numberError) {
        throw numberError;
      }

      /*
       * Create application number map
       */
      const numberMap: Record<string, string> = {};

      (numberData || []).forEach(
        (item: ApplicationNumber) => {
          numberMap[item.applicationId] =
            item.applicationNo;
        }
      );

      setApplicationNumbers(numberMap);
      setApplications(applicationData || []);
    } catch (err: any) {
      console.error(
        "Applications Load Error:",
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

  /*
   * Initial Load
   */
  useEffect(() => {
    loadApplications();
  }, []);

  /*
   * Format Date
   */
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

  /*
   * Status Color
   */
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  /*
   * Update Application Status
   */
  const updateStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      setError("");
      setUpdatingId(applicationId);

      /*
       * Update Supabase
       */
      const {
        data,
        error: updateError,
      } = await supabase
        .from("applications")
        .update({
          status: newStatus,
        })
        .eq("id", applicationId)
        .select()
        .single();

      if (updateError) {
        console.error(
          "Status Update Error:",
          updateError
        );

        throw updateError;
      }

      /*
       * Update local state
       */
      if (data) {
        setApplications((previous) =>
          previous.map((application) =>
            application.id === applicationId
              ? {
                  ...application,
                  status: data.status,
                }
              : application
          )
        );
      }
    } catch (err: any) {
      console.error(
        "Application Status Update Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /*
   * Loading Screen
   */
  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">
              ⏳
            </div>

            <p className="text-xl font-semibold text-gray-600">
              Loading applications...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
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
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold transition"
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

            {error.includes(
              "row-level security"
            ) && (
              <p className="mt-3 text-sm">
                Please check the UPDATE policy
                for the applications table in
                Supabase.
              </p>
            )}

          </div>
        )}

        {/* No Applications */}
        {!error &&
          applications.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

              <div className="text-5xl mb-4">
                📋
              </div>

              <h2 className="text-2xl font-bold">
                No Applications Found
              </h2>

              <p className="text-gray-500 mt-2">
                Submitted applications will
                appear here.
              </p>

            </div>
          )}

        {/* Applications Table */}
        {applications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1300px]">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="text-left p-5">
                      Application No.
                    </th>

                    <th className="text-left p-5">
                      Customer
                    </th>

                    <th className="text-left p-5">
                      Mobile
                    </th>

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
                      Created
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {applications.map(
                    (application) => {

                      const documents =
                        application.documents &&
                        typeof application.documents ===
                          "object"
                          ? application.documents
                          : {};

                      const documentEntries =
                        Object.entries(
                          documents
                        );

                      const isUpdating =
                        updatingId ===
                        application.id;

                      return (
                        <tr
                          key={application.id}
                          className="border-t hover:bg-gray-50"
                        >

                          {/* Application Number */}
                          <td className="p-5">

                            <span className="font-bold text-blue-600">
                              {applicationNumbers[
                                application.id
                              ] || "-"}
                            </span>

                          </td>

                          {/* Customer */}
                          <td className="p-5">

                            <div className="font-semibold text-slate-800">
                              {
                                application.customerName
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

                          {/* Category */}
                          <td className="p-5">

                            {application.category ||
                              "-"}

                          </td>

                          {/* Price */}
                          <td className="p-5 font-semibold">

                            ₹
                            {Number(
                              application.price ||
                                0
                            )}

                          </td>

                          {/* Documents */}
                          <td className="p-5">

                            {documentEntries.length >
                            0 ? (
                              <div className="space-y-2">

                                {documentEntries.map(
                                  ([
                                    name,
                                    url,
                                  ]) => (
                                    <div
                                      key={name}
                                      className="flex flex-col"
                                    >

                                      <span className="text-xs text-gray-500">
                                        {name}
                                      </span>

                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm font-semibold"
                                      >
                                        View Document
                                      </a>

                                    </div>
                                  )
                                )}

                              </div>
                            ) : (
                              <span className="text-gray-400">
                                No documents
                              </span>
                            )}

                          </td>

                          {/* Status */}
                          <td className="p-5">

                            <div className="flex flex-col gap-2">

                              <select
                                value={
                                  application.status ||
                                  "Pending"
                                }
                                disabled={
                                  isUpdating
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateStatus(
                                    application.id,
                                    event.target
                                      .value
                                  )
                                }
                                className={`border-0 rounded-full px-4 py-2 text-sm font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500 ${getStatusClass(
                                  application.status ||
                                    "Pending"
                                )} ${
                                  isUpdating
                                    ? "opacity-50 cursor-wait"
                                    : ""
                                }`}
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

                              {isUpdating && (
                                <span className="text-xs text-blue-600">
                                  Updating...
                                </span>
                              )}

                            </div>

                          </td>

                          {/* Created */}
                          <td className="p-5 text-gray-600 whitespace-nowrap">

                            {formatDate(
                              application.createdAt
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* Total */}
        {applications.length > 0 && (
          <div className="text-gray-500">

            Total Applications:{" "}

            <span className="font-bold text-gray-800">
              {applications.length}
            </span>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default Applications;