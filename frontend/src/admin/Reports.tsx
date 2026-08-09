import AdminLayout from "./AdminLayout";
import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  FileText,
  Users,
  IndianRupee,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
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

type Payment = {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string;
};

function Reports() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [applicationsResult, paymentsResult] =
        await Promise.all([
          supabase
            .from("applications")
            .select(
              "id, customerName, mobile, serviceName, category, price, status, createdAt"
            )
            .order("createdAt", {
              ascending: false,
            }),

          supabase
            .from("payments")
            .select(
              "id, amount, status, paymentMethod, transactionId, createdAt"
            )
            .order("createdAt", {
              ascending: false,
            }),
        ]);

      if (applicationsResult.error) {
        throw applicationsResult.error;
      }

      if (paymentsResult.error) {
        throw paymentsResult.error;
      }

      setApplications(
        (applicationsResult.data || []) as Application[]
      );

      setPayments(
        (paymentsResult.data || []) as Payment[]
      );
    } catch (err: any) {
      console.error("Reports Error:", err);

      setError(
        err?.message || "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  /*
   * Unique Customers
   */
  const uniqueCustomers = useMemo(() => {
    const customers = new Set<string>();

    applications.forEach((application) => {
      const mobile = application.mobile?.trim();
      const name =
        application.customerName
          ?.trim()
          .toLowerCase();

      if (mobile) {
        customers.add(`mobile:${mobile}`);
      } else if (name) {
        customers.add(`name:${name}`);
      }
    });

    return customers.size;
  }, [applications]);

  /*
   * Application Value
   */
  const applicationValue = useMemo(() => {
    return applications.reduce(
      (total, application) =>
        total + Number(application.price || 0),
      0
    );
  }, [applications]);

  /*
   * Successful Payments
   */
  const successfulPayments = useMemo(() => {
    return payments.filter((payment) => {
      const status =
        payment.status?.toLowerCase();

      return (
        status === "success" ||
        status === "completed"
      );
    });
  }, [payments]);

  const successfulPaymentAmount = useMemo(() => {
    return successfulPayments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );
  }, [successfulPayments]);

  /*
   * Payment Statistics
   */
  const pendingPayments = payments.filter(
    (payment) =>
      payment.status?.toLowerCase() ===
      "pending"
  ).length;

  const failedPayments = payments.filter(
    (payment) =>
      payment.status?.toLowerCase() ===
      "failed"
  ).length;

  /*
   * Application Statistics
   */
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

  /*
   * Search Applications
   */
  const filteredApplications = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return applications;
    }

    return applications.filter(
      (application) =>
        application.customerName
          ?.toLowerCase()
          .includes(text) ||
        application.mobile
          ?.toLowerCase()
          .includes(text) ||
        application.serviceName
          ?.toLowerCase()
          .includes(text) ||
        application.category
          ?.toLowerCase()
          .includes(text) ||
        application.status
          ?.toLowerCase()
          .includes(text)
    );
  }, [applications, search]);

  /*
   * Service-wise Report
   */
  const serviceReport = useMemo(() => {
    const report: Record<
      string,
      {
        applications: number;
        value: number;
      }
    > = {};

    applications.forEach((application) => {
      const service =
        application.serviceName ||
        "Unknown Service";

      if (!report[service]) {
        report[service] = {
          applications: 0,
          value: 0,
        };
      }

      report[service].applications += 1;

      report[service].value += Number(
        application.price || 0
      );
    });

    return Object.entries(report)
      .map(([service, data]) => ({
        service,
        ...data,
      }))
      .sort((a, b) => b.value - a.value);
  }, [applications]);

  const maxServiceValue = Math.max(
    ...serviceReport.map(
      (item) => item.value
    ),
    1
  );

  /*
   * Date Formatter
   */
  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * Status Badge
   */
  const getStatusClass = (
    status: string
  ) => {
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

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Reports
            </h1>

            <p className="text-gray-500 mt-2">
              Overview of VERIXA applications,
              customers and payments
            </p>
          </div>

          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600">
            <p className="font-bold">
              Reports Error
            </p>

            <p className="mt-1 break-all">
              {error}
            </p>
          </div>
        )}

        {/* Main Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Applications */}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Total Applications
                </p>

                <h2 className="text-3xl font-bold mt-2 text-slate-800">
                  {loading
                    ? "..."
                    : applications.length}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText
                  className="text-blue-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Customers */}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Total Customers
                </p>

                <h2 className="text-3xl font-bold mt-2 text-slate-800">
                  {loading
                    ? "..."
                    : uniqueCustomers}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users
                  className="text-purple-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Application Value */}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Application Value
                </p>

                <h2 className="text-3xl font-bold mt-2 text-green-600">
                  {loading
                    ? "..."
                    : `₹${applicationValue}`}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <IndianRupee
                  className="text-green-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Successful Payments */}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Successful Payments
                </p>

                <h2 className="text-3xl font-bold mt-2 text-blue-600">
                  {loading
                    ? "..."
                    : `₹${successfulPaymentAmount}`}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard
                  className="text-blue-600"
                  size={24}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Application Status */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Application Status
          </h2>

          <p className="text-gray-500 mt-1">
            Current application distribution
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="bg-yellow-50 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <Clock
                  className="text-yellow-600"
                  size={22}
                />

                <span className="text-gray-600">
                  Pending
                </span>
              </div>

              <p className="text-3xl font-bold text-yellow-600 mt-3">
                {pendingApplications}
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <RefreshCw
                  className="text-blue-600"
                  size={22}
                />

                <span className="text-gray-600">
                  Processing
                </span>
              </div>

              <p className="text-3xl font-bold text-blue-600 mt-3">
                {processingApplications}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <CheckCircle
                  className="text-green-600"
                  size={22}
                />

                <span className="text-gray-600">
                  Completed
                </span>
              </div>

              <p className="text-3xl font-bold text-green-600 mt-3">
                {completedApplications}
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <XCircle
                  className="text-red-600"
                  size={22}
                />

                <span className="text-gray-600">
                  Rejected
                </span>
              </div>

              <p className="text-3xl font-bold text-red-600 mt-3">
                {rejectedApplications}
              </p>
            </div>

          </div>
        </div>

        {/* Payment Status */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Payment Status
          </h2>

          <p className="text-gray-500 mt-1">
            Payment transaction overview
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

            <div className="border rounded-xl p-5">
              <p className="text-gray-500">
                Total Payments
              </p>

              <p className="text-3xl font-bold mt-2">
                {payments.length}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500">
                Pending Payments
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {pendingPayments}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500">
                Failed Payments
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {failedPayments}
              </p>
            </div>

          </div>
        </div>

        {/* Service-wise Report */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Service-wise Report
            </h2>

            <p className="text-gray-500 mt-1">
              Applications and service value by service
            </p>
          </div>

          {serviceReport.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-500">
                No application data available.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {serviceReport.map((item) => {
                const width = Math.max(
                  5,
                  Math.round(
                    (item.value /
                      maxServiceValue) *
                      100
                  )
                );

                return (
                  <div key={item.service}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.service}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.applications}{" "}
                          application
                          {item.applications !==
                          1
                            ? "s"
                            : ""}
                        </p>
                      </div>

                      <p className="font-bold text-blue-600">
                        ₹{item.value}
                      </p>
                    </div>

                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Application Search */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Application Report
                </h2>

                <p className="text-gray-500 mt-1">
                  Search application records
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search customer or service..."
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="p-10 text-center">
              <FileText
                size={40}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-4">
                No applications found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">

                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-5">
                      Customer
                    </th>

                    <th className="text-left p-5">
                      Service
                    </th>

                    <th className="text-left p-5">
                      Category
                    </th>

                    <th className="text-left p-5">
                      Value
                    </th>

                    <th className="text-left p-5">
                      Status
                    </th>

                    <th className="text-left p-5">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map(
                    (application) => (
                      <tr
                        key={application.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-5">
                          <p className="font-semibold text-slate-800">
                            {application.customerName ||
                              "-"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {application.mobile ||
                              "-"}
                          </p>
                        </td>

                        <td className="p-5 font-semibold">
                          {application.serviceName ||
                            "-"}
                        </td>

                        <td className="p-5">
                          {application.category ||
                            "-"}
                        </td>

                        <td className="p-5 font-bold text-blue-600">
                          ₹
                          {Number(
                            application.price || 0
                          )}
                        </td>

                        <td className="p-5">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status ||
                              "Pending"}
                          </span>
                        </td>

                        <td className="p-5 text-gray-600 whitespace-nowrap">
                          {formatDate(
                            application.createdAt
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}

export default Reports;