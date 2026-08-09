import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  IndianRupee,
  Search,
} from "lucide-react";
import { supabase } from "../supabase";

type Payment = {
  id: string;
  applicationId: string | null;
  userId: string | null;
  amount: number;
  status: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = [
  "Pending",
  "Success",
  "Failed",
  "Refunded",
];

function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error: paymentsError,
      } = await supabase
        .from("payments")
        .select("*")
        .order("createdAt", {
          ascending: false,
        });

      if (paymentsError) {
        throw paymentsError;
      }

      setPayments(
        (data || []) as Payment[]
      );
    } catch (err: any) {
      console.error(
        "Admin Payments Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const formatDate = (
    date: string
  ) => {
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

  const getStatusClass = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "success":
      case "completed":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "refunded":
        return "bg-purple-100 text-purple-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "success":
      case "completed":
        return (
          <CheckCircle
            size={16}
          />
        );

      case "failed":
        return (
          <XCircle
            size={16}
          />
        );

      case "pending":
        return (
          <Clock
            size={16}
          />
        );

      default:
        return (
          <CreditCard
            size={16}
          />
        );
    }
  };

  const filteredPayments =
    payments.filter(
      (payment) => {
        const searchText =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          !searchText ||
          payment.id
            ?.toLowerCase()
            .includes(searchText) ||
          payment.applicationId
            ?.toLowerCase()
            .includes(searchText) ||
          payment.userId
            ?.toLowerCase()
            .includes(searchText) ||
          payment.transactionId
            ?.toLowerCase()
            .includes(searchText) ||
          payment.paymentMethod
            ?.toLowerCase()
            .includes(searchText);

        const matchesStatus =
          statusFilter ===
            "All" ||
          payment.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  const totalAmount =
    payments.reduce(
      (total, payment) =>
        total +
        Number(
          payment.amount || 0
        ),
      0
    );

  const successfulPayments =
    payments.filter(
      (payment) =>
        payment.status?.toLowerCase() ===
          "success" ||
        payment.status?.toLowerCase() ===
          "completed"
    );

  const successfulAmount =
    successfulPayments.reduce(
      (total, payment) =>
        total +
        Number(
          payment.amount || 0
        ),
      0
    );

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status?.toLowerCase() ===
        "pending"
    ).length;

  const failedPayments =
    payments.filter(
      (payment) =>
        payment.status?.toLowerCase() ===
        "failed"
    ).length;

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Payments
            </h1>

            <p className="text-gray-500 mt-2">
              Manage customer payments and transactions
            </p>
          </div>

          <button
            type="button"
            onClick={loadPayments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold transition"
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
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

            <div className="flex items-start gap-3">

              <XCircle
                className="text-red-500 mt-0.5"
                size={22}
              />

              <div>
                <p className="font-bold text-red-700">
                  Unable to load payments
                </p>

                <p className="text-red-600 mt-1 break-all">
                  {error}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Total */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium">
                  Total Payments
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-2">
                  {loading
                    ? "..."
                    : payments.length}
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

          {/* Successful */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium">
                  Successful Amount
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {loading
                    ? "..."
                    : `₹${successfulAmount}`}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle
                  className="text-green-600"
                  size={24}
                />
              </div>

            </div>

          </div>

          {/* Pending */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium">
                  Pending Payments
                </p>

                <h2 className="text-3xl font-bold text-orange-500 mt-2">
                  {loading
                    ? "..."
                    : pendingPayments}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Clock
                  className="text-orange-500"
                  size={24}
                />
              </div>

            </div>

          </div>

          {/* Failed */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium">
                  Failed Payments
                </p>

                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {loading
                    ? "..."
                    : failedPayments}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle
                  className="text-red-600"
                  size={24}
                />
              </div>

            </div>

          </div>

        </div>

        {/* Revenue Summary */}

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 md:p-8 text-white">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-blue-100">
                Total Transaction Value
              </p>

              <h2 className="text-4xl font-bold mt-2">
                ₹{totalAmount}
              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <IndianRupee
                size={32}
              />
            </div>

          </div>

        </div>

        {/* Filters */}

        <div className="bg-white rounded-2xl shadow-lg p-5">

          <div className="flex flex-col md:flex-row gap-4">

            <div className="relative flex-1">

              <Search
                size={20}
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
                placeholder="Search payment, application, user or transaction..."
                className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:w-56"
            >

              <option value="All">
                All Status
              </option>

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

        {/* Payments Table */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Payment Transactions
                </h2>

                <p className="text-gray-500 mt-1">
                  {filteredPayments.length} payment
                  {filteredPayments.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

            </div>

          </div>

          {loading ? (

            <div className="p-12 text-center">

              <RefreshCw
                size={35}
                className="mx-auto text-blue-600 animate-spin"
              />

              <p className="text-gray-500 mt-4">
                Loading payments...
              </p>

            </div>

          ) : filteredPayments.length ===
            0 ? (

            <div className="p-12 text-center">

              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">

                <CreditCard
                  size={30}
                  className="text-gray-400"
                />

              </div>

              <h3 className="text-xl font-bold text-gray-700 mt-5">
                No Payments Found
              </h3>

              <p className="text-gray-500 mt-2">
                Payment transactions will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="text-left p-5">
                      Payment ID
                    </th>

                    <th className="text-left p-5">
                      Application ID
                    </th>

                    <th className="text-left p-5">
                      Amount
                    </th>

                    <th className="text-left p-5">
                      Method
                    </th>

                    <th className="text-left p-5">
                      Transaction ID
                    </th>

                    <th className="text-left p-5">
                      Status
                    </th>

                    <th className="text-left p-5">
                      Date
                    </th>

                    <th className="text-left p-5">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPayments.map(
                    (payment) => (

                      <tr
                        key={payment.id}
                        className="border-t hover:bg-gray-50"
                      >

                        {/* Payment ID */}

                        <td className="p-5">

                          <span className="font-semibold text-slate-800 break-all">
                            {payment.id}
                          </span>

                        </td>

                        {/* Application */}

                        <td className="p-5">

                          {payment.applicationId ? (

                            <Link
                              to={`/admin/applications/${payment.applicationId}`}
                              className="text-blue-600 font-semibold hover:underline break-all"
                            >
                              View Application
                            </Link>

                          ) : (
                            <span className="text-gray-400">
                              -
                            </span>
                          )}

                        </td>

                        {/* Amount */}

                        <td className="p-5">

                          <span className="font-bold text-slate-800">
                            ₹
                            {Number(
                              payment.amount ||
                                0
                            )}
                          </span>

                        </td>

                        {/* Method */}

                        <td className="p-5">

                          <span className="text-gray-700">
                            {payment.paymentMethod ||
                              "-"}
                          </span>

                        </td>

                        {/* Transaction ID */}

                        <td className="p-5">

                          <span className="text-gray-700 break-all">
                            {payment.transactionId ||
                              "-"}
                          </span>

                        </td>

                        {/* Status */}

                        <td className="p-5">

                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass(
                              payment.status
                            )}`}
                          >

                            {getStatusIcon(
                              payment.status
                            )}

                            {payment.status ||
                              "Pending"}

                          </span>

                        </td>

                        {/* Date */}

                        <td className="p-5 text-gray-600 whitespace-nowrap">

                          {formatDate(
                            payment.createdAt
                          )}

                        </td>

                        {/* Action */}

                        <td className="p-5">

                          {payment.applicationId ? (

                            <Link
                              to={`/admin/applications/${payment.applicationId}`}
                              className="text-blue-600 font-semibold hover:underline"
                            >
                              Details →
                            </Link>

                          ) : (
                            <span className="text-gray-400">
                              -
                            </span>
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

export default Payments;