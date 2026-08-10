import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  FileText,
  Receipt,
} from "lucide-react";
import { supabase } from "../supabase";

type Application = {
  id: string;
  customerName: string | null;
  mobile: string | null;
  serviceName: string | null;
  price: number | null;
  status: string | null;
  createdAt: string | null;
};

type Payment = {
  id: string;
  applicationId: string | null;
  amount: number | null;
  paymentMethod: string | null;
  transactionId: string | null;
  status: string | null;
  paidAt: string | null;
  createdAt: string | null;
};

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: applicationData,
        error: applicationError,
      } = await supabase
        .from("applications")
        .select(
          "id, customerName, mobile, serviceName, price, status, createdAt"
        )
        .order("createdAt", {
          ascending: false,
        });

      if (applicationError) {
        console.error(
          "Applications Load Error:",
          applicationError
        );

        throw applicationError;
      }

      const {
        data: paymentData,
        error: paymentError,
      } = await supabase
        .from("payments")
        .select(
          "id, applicationId, amount, paymentMethod, transactionId, status, paidAt, createdAt"
        )
        .order("createdAt", {
          ascending: false,
        });

      if (paymentError) {
        console.error(
          "Payments Load Error:",
          paymentError
        );

        throw paymentError;
      }

      setApplications(
        (applicationData || []) as Application[]
      );

      setPayments(
        (paymentData || []) as Payment[]
      );
    } catch (err: any) {
      console.error(
        "Applications Page Error:",
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

  useEffect(() => {
    loadApplications();
  }, []);

  const getApplicationPayments = (
    applicationId: string
  ) => {
    return payments.filter(
      (payment) =>
        payment.applicationId === applicationId
    );
  };

 const getSuccessfulPayment = (
  applicationId: string
) => {
  return getApplicationPayments(
    applicationId
  ).find((payment) => {
    const status =
      payment.status?.toLowerCase();

    return (
      status === "paid" ||
      status === "success" ||
      status === "completed"
    );
  });
};
  const getLatestPayment = (
    applicationId: string
  ) => {
    return getApplicationPayments(
      applicationId
    )[0];
  };

  const getPaymentStatus = (
    applicationId: string
  ) => {
    const successfulPayment =
      getSuccessfulPayment(
        applicationId
      );

    if (successfulPayment) {
      return "Paid";
    }

    const latestPayment =
      getLatestPayment(
        applicationId
      );

    if (!latestPayment) {
      return "Unpaid";
    }

    return (
      latestPayment.status ||
      "Pending"
    );
  };

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (
    date: string | null
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

  const getApplicationStatusClass = (
    status: string | null
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-700";

      case "processing":
      case "in progress":
        return "bg-blue-100 text-blue-700";

      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPaymentStatusClass = (
    status: string
  ) => {
    switch (
      status.toLowerCase()
    ) {
      case "paid":
      case "success":
      case "completed":
        return "bg-green-100 text-green-700";

      case "failed":
      case "rejected":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "unpaid":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <RefreshCw
            size={35}
            className="mx-auto text-blue-600 animate-spin"
          />

          <p className="text-gray-600 font-medium mt-4">
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
          <XCircle
            size={50}
            className="mx-auto text-red-500"
          />

          <h1 className="text-2xl font-bold text-slate-800 mt-4">
            Unable to Load Applications
          </h1>

          <p className="text-red-600 mt-3 break-words">
            {error}
          </p>

          <button
            type="button"
            onClick={loadApplications}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              My Applications
            </h1>

            <p className="text-gray-500 mt-2">
              View your applications and payment status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadApplications}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <FileText
              size={55}
              className="mx-auto text-gray-400"
            />

            <h2 className="text-xl font-bold text-slate-800 mt-4">
              No Applications Found
            </h2>

            <p className="text-gray-500 mt-2">
              You have not submitted any application yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">

                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left">
                      Service
                    </th>

                    <th className="p-4 text-left">
                      Application Status
                    </th>

                    <th className="p-4 text-left">
                      Payment Status
                    </th>

                    <th className="p-4 text-left">
                      Amount
                    </th>

                    <th className="p-4 text-left">
                      Payment Date
                    </th>

                    <th className="p-4 text-left">
                      Application Date
                    </th>

                    <th className="p-4 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map(
                    (application) => {
                      const successfulPayment =
                        getSuccessfulPayment(
                          application.id
                        );

                      const latestPayment =
                        getLatestPayment(
                          application.id
                        );

                      const paymentStatus =
                        getPaymentStatus(
                          application.id
                        );

                      const paid =
                        Boolean(
                          successfulPayment
                        );

                      const paymentDate =
                        successfulPayment?.paidAt ||
                        latestPayment?.paidAt ||
                        null;

                      return (
                        <tr
                          key={application.id}
                          className="border-b hover:bg-slate-50"
                        >

                          <td className="p-4">
                            <div className="font-semibold text-slate-800">
                              {application.serviceName ||
                                "Service"}
                            </div>

                            <div className="text-xs text-gray-500 mt-1 font-mono break-all">
                              {application.id}
                            </div>
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getApplicationStatusClass(
                                application.status
                              )}`}
                            >
                              {application.status ||
                                "Pending"}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">

                              {paid ? (
                                <CheckCircle
                                  size={18}
                                  className="text-green-600"
                                />
                              ) : paymentStatus
                                  .toLowerCase() ===
                                "failed" ? (
                                <XCircle
                                  size={18}
                                  className="text-red-600"
                                />
                              ) : (
                                <Clock
                                  size={18}
                                  className="text-yellow-600"
                                />
                              )}

                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusClass(
                                  paymentStatus
                                )}`}
                              >
                                {paymentStatus}
                              </span>
                            </div>

                            {successfulPayment && (
                              <div className="mt-2 text-xs text-green-600 font-medium">
                                Payment verified
                              </div>
                            )}
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-green-600">
                              ₹
                              {Number(
                                successfulPayment?.amount ??
                                  application.price ??
                                  0
                              )}
                            </span>
                          </td>

                          <td className="p-4">
                            {paymentDate ? (
                              <div>
                                <div className="text-sm font-semibold text-slate-700">
                                  {formatDate(
                                    paymentDate
                                  )}
                                </div>

                                {paid && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatDateTime(
                                      paymentDate
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">
                                Not paid
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-gray-600">
                            {formatDate(
                              application.createdAt
                            )}
                          </td>

                          <td className="p-4 text-center">
                            {paid ? (
                              <Link
                                to={`/payments?applicationId=${application.id}`}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                              >
                                <Receipt
                                  size={16}
                                />
                                View Payment
                              </Link>
                            ) : (
                              <Link
                                to={`/payments?applicationId=${application.id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                              >
                                <CreditCard
                                  size={16}
                                />
                                Pay Now
                              </Link>
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
      </div>
    </div>
  );
}

export default Applications;