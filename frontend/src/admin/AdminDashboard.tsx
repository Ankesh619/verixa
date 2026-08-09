import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

type Application = {
  id: string;
  customerName: string;
  mobile: string;
  serviceName: string;
  category: string;
  price: number;
  status: string;
  createdAt: string;
};

type ApplicationNumber = {
  applicationId: string;
  applicationNo: string;
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
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

function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [applicationNumbers, setApplicationNumbers] =
    useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Load Applications
       */
      const {
        data: applicationData,
        error: applicationsError,
      } = await supabase
        .from("applications")
        .select(
          "id, customerName, mobile, serviceName, category, price, status, createdAt"
        )
        .order("createdAt", {
          ascending: false,
        });

      if (applicationsError) {
        throw applicationsError;
      }

      /*
       * Load Application Numbers
       */
      const {
        data: numberData,
        error: numberError,
      } = await supabase
        .from("applicationNumbers")
        .select("applicationId, applicationNo");

      if (numberError) {
        console.error(
          "Application Number Error:",
          numberError
        );
      }

      /*
       * Create Application Number Map
       */
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
        "Admin Dashboard Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial Load
   */
  useEffect(() => {
    loadDashboard();
  }, []);

  /*
   * Statistics
   */
  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() ===
        "pending"
    ).length;

  const processingApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() ===
        "processing"
    ).length;

  const completedApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() ===
        "completed"
    ).length;

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() ===
        "rejected"
    ).length;

  const revenue = applications.reduce(
    (total, application) =>
      total +
      Number(application.price || 0),
    0
  );

  /*
   * Format Date
   */
  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /*
   * Show only recent 5 applications
   */
  const recentApplications =
    applications.slice(0, 5);

  return (
    <AdminLayout>
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to VERIXA Admin Panel
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-xl mt-6">
          <p className="font-semibold">
            Dashboard Error
          </p>

          <p className="mt-1">
            {error}
          </p>
        </div>
      )}

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mt-10">

        {/* Total */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">
            Total Applications
          </p>

          <h2 className="text-4xl font-bold mt-3 text-slate-800">
            {loading
              ? "..."
              : totalApplications}
          </h2>

          <Link
            to="/admin/applications"
            className="inline-block mt-4 text-blue-600 font-semibold text-sm hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Pending */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">
            Pending
          </p>

          <h2 className="text-4xl font-bold mt-3 text-orange-500">
            {loading
              ? "..."
              : pendingApplications}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Waiting for action
          </p>
        </div>

        {/* Processing */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">
            Processing
          </p>

          <h2 className="text-4xl font-bold mt-3 text-blue-600">
            {loading
              ? "..."
              : processingApplications}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Currently processing
          </p>
        </div>

        {/* Completed */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">
            Completed
          </p>

          <h2 className="text-4xl font-bold mt-3 text-green-600">
            {loading
              ? "..."
              : completedApplications}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Successfully completed
          </p>
        </div>

        {/* Rejected */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">
            Rejected
          </p>

          <h2 className="text-4xl font-bold mt-3 text-red-600">
            {loading
              ? "..."
              : rejectedApplications}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Rejected applications
          </p>
        </div>

        {/* Revenue */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">
            Revenue
          </p>

          <h2 className="text-4xl font-bold mt-3 text-blue-600">
            {loading
              ? "..."
              : `₹${revenue}`}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Application service value
          </p>
        </div>
      </div>

      {/* Recent Applications */}

      <div className="bg-white rounded-2xl shadow-lg mt-10 overflow-hidden">

        {/* Section Header */}

        <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Recent Applications
            </h2>

            <p className="text-gray-500 mt-1">
              Latest customer applications
            </p>
          </div>

          <Link
            to="/admin/applications"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All Applications →
          </Link>
        </div>

        {/* Loading */}

        {loading && (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-gray-500">
              Loading applications...
            </p>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          recentApplications.length === 0 && (
            <div className="p-10 text-center">
              <div className="text-5xl mb-4">
                📋
              </div>

              <h3 className="text-xl font-bold text-slate-800">
                No Applications Found
              </h3>

              <p className="text-gray-500 mt-2">
                New applications will appear here.
              </p>
            </div>
          )}

        {/* Table */}

        {!loading &&
          recentApplications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">

                <thead className="bg-slate-100">
                  <tr>

                    <th className="text-left p-5 text-sm font-semibold text-slate-600">
                      Application No.
                    </th>

                    <th className="text-left p-5 text-sm font-semibold text-slate-600">
                      Customer
                    </th>

                    <th className="text-left p-5 text-sm font-semibold text-slate-600">
                      Service
                    </th>

                    <th className="text-left p-5 text-sm font-semibold text-slate-600">
                      Price
                    </th>

                    <th className="text-left p-5 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="text-left p-5 text-sm font-semibold text-slate-600">
                      Created
                    </th>

                    <th className="text-left p-5 text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {recentApplications.map(
                    (application) => (
                      <tr
                        key={application.id}
                        className="border-t hover:bg-gray-50 transition"
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

                          <div className="text-sm text-gray-500 mt-1">
                            {application.mobile}
                          </div>
                        </td>

                        {/* Service */}

                        <td className="p-5">
                          <div className="font-semibold">
                            {
                              application.serviceName
                            }
                          </div>

                          {application.category && (
                            <div className="text-sm text-gray-500 mt-1">
                              {
                                application.category
                              }
                            </div>
                          )}
                        </td>

                        {/* Price */}

                        <td className="p-5 font-semibold text-blue-600">
                          ₹
                          {Number(
                            application.price || 0
                          )}
                        </td>

                        {/* Status */}

                        <td className="p-5">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                              application.status ||
                                "Pending"
                            )}`}
                          >
                            {application.status ||
                              "Pending"}
                          </span>
                        </td>

                        {/* Created */}

                        <td className="p-5 text-gray-600 whitespace-nowrap">
                          {formatDate(
                            application.createdAt
                          )}
                        </td>

                        {/* Action */}

                        <td className="p-5">
                          <Link
                            to={`/admin/applications/${application.id}`}
                            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
                          >
                            View Details
                          </Link>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            </div>
          )}

        {/* Footer */}

        {!loading &&
          recentApplications.length > 0 && (
            <div className="p-5 border-t bg-slate-50 text-gray-500 text-sm">
              Showing latest{" "}
              <span className="font-bold text-slate-800">
                {recentApplications.length}
              </span>{" "}
              applications out of{" "}
              <span className="font-bold text-slate-800">
                {totalApplications}
              </span>
            </div>
          )}

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;