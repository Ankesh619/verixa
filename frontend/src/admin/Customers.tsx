import AdminLayout from "./AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

type Application = {
  id: string;
  customerName: string;
  mobile: string;
  serviceName: string;
  price: number;
  createdAt: string;
};

type Customer = {
  mobile: string;
  customerName: string;
  applicationCount: number;
  totalValue: number;
  latestApplication: string;
  latestApplicationDate: string;
};

function Customers() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /*
   * Load customer/application data
   */
  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error: applicationsError,
      } = await supabase
        .from("applications")
        .select(
          "id, customerName, mobile, serviceName, price, createdAt"
        )
        .order("createdAt", {
          ascending: false,
        });

      if (applicationsError) {
        throw applicationsError;
      }

      setApplications(
        (data || []) as Application[]
      );
    } catch (err: any) {
      console.error(
        "Customers Load Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial load
   */
  useEffect(() => {
    loadCustomers();
  }, []);

  /*
   * Create unique customer list
   *
   * Mobile number is used as the customer identifier.
   */
  const customers = useMemo(() => {
    const customerMap: Record<
      string,
      Customer
    > = {};

    applications.forEach(
      (application) => {
        const mobile =
          application.mobile?.trim() ||
          "unknown";

        if (!customerMap[mobile]) {
          customerMap[mobile] = {
            mobile,
            customerName:
              application.customerName ||
              "Unknown Customer",
            applicationCount: 0,
            totalValue: 0,
            latestApplication:
              application.serviceName ||
              "-",
            latestApplicationDate:
              application.createdAt,
          };
        }

        customerMap[mobile].applicationCount +=
          1;

        customerMap[mobile].totalValue +=
          Number(application.price || 0);
      }
    );

    return Object.values(
      customerMap
    ).sort((a, b) => {
      return (
        new Date(
          b.latestApplicationDate
        ).getTime() -
        new Date(
          a.latestApplicationDate
        ).getTime()
      );
    });
  }, [applications]);

  /*
   * Search customers
   */
  const filteredCustomers = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.customerName
          .toLowerCase()
          .includes(searchText) ||
        customer.mobile
          .toLowerCase()
          .includes(searchText)
    );
  }, [customers, search]);

  /*
   * Format date
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
   * Total customer value
   */
  const totalCustomerValue =
    customers.reduce(
      (total, customer) =>
        total + customer.totalValue,
      0
    );

  return (
    <AdminLayout>
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Customers
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customers and their service applications
          </p>
        </div>

        <button
          type="button"
          onClick={loadCustomers}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-xl mb-6">
          <p className="font-semibold">
            Customers Error
          </p>

          <p className="mt-1">
            {error}
          </p>
        </div>
      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Total Customers */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500">
            Total Customers
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-3">
            {loading
              ? "..."
              : customers.length}
          </h2>
        </div>

        {/* Total Applications */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500">
            Total Applications
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {loading
              ? "..."
              : applications.length}
          </h2>
        </div>

        {/* Customer Value */}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500">
            Total Service Value
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {loading
              ? "..."
              : `₹${totalCustomerValue}`}
          </h2>
        </div>
      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search customer by name or mobile number..."
            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

        </div>
      </div>

      {/* Customers Table */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Loading */}

        {loading && (
          <div className="p-12 text-center">

            <div className="text-4xl mb-4">
              ⏳
            </div>

            <p className="text-gray-500">
              Loading customers...
            </p>

          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredCustomers.length === 0 && (
            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                👥
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                No Customers Found
              </h2>

              <p className="text-gray-500 mt-2">
                {search
                  ? "No customer matches your search."
                  : "Customers will appear here after applications are submitted."}
              </p>

            </div>
          )}

        {/* Table */}

        {!loading &&
          filteredCustomers.length > 0 && (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="text-left p-5">
                      Customer
                    </th>

                    <th className="text-left p-5">
                      Mobile
                    </th>

                    <th className="text-left p-5">
                      Applications
                    </th>

                    <th className="text-left p-5">
                      Total Value
                    </th>

                    <th className="text-left p-5">
                      Latest Service
                    </th>

                    <th className="text-left p-5">
                      Last Application
                    </th>

                    <th className="text-left p-5">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCustomers.map(
                    (customer) => (
                      <tr
                        key={customer.mobile}
                        className="border-t hover:bg-gray-50 transition"
                      >

                        {/* Customer */}

                        <td className="p-5">

                          <div className="font-semibold text-slate-800">
                            {
                              customer.customerName
                            }
                          </div>

                        </td>

                        {/* Mobile */}

                        <td className="p-5">

                          <a
                            href={`tel:${customer.mobile}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {
                              customer.mobile
                            }
                          </a>

                        </td>

                        {/* Applications */}

                        <td className="p-5">

                          <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {
                              customer.applicationCount
                            }
                          </span>

                        </td>

                        {/* Total Value */}

                        <td className="p-5">

                          <span className="font-bold text-green-600">
                            ₹
                            {
                              customer.totalValue
                            }
                          </span>

                        </td>

                        {/* Latest Service */}

                        <td className="p-5">

                          <span className="font-semibold">
                            {
                              customer.latestApplication
                            }
                          </span>

                        </td>

                        {/* Date */}

                        <td className="p-5 text-gray-600 whitespace-nowrap">

                          {formatDate(
                            customer.latestApplicationDate
                          )}

                        </td>

                        {/* Action */}

                        <td className="p-5">

                          <Link
                            to={`/admin/applications?mobile=${encodeURIComponent(
                              customer.mobile
                            )}`}
                            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
                          >
                            View Applications
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
          filteredCustomers.length > 0 && (
            <div className="p-5 border-t bg-slate-50 text-gray-500 text-sm">

              Showing{" "}
              <span className="font-bold text-slate-800">
                {
                  filteredCustomers.length
                }
              </span>{" "}
              customers out of{" "}
              <span className="font-bold text-slate-800">
                {customers.length}
              </span>

            </div>
          )}

      </div>
    </AdminLayout>
  );
}

export default Customers;