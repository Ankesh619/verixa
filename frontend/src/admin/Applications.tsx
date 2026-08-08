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

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [applicationNumbers, setApplicationNumbers] =
    useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          numberMap[item.applicationId] = item.applicationNo;
        }
      );

      setApplicationNumbers(numberMap);
      setApplications(applicationData || []);
    } catch (err: any) {
      console.error("Applications Error:", err);

      setError(
        err?.message || "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-xl font-semibold text-gray-600">
            Loading applications...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Applications
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer service applications
          </p>
        </div>

        <button
          onClick={loadApplications}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-xl mb-6">
          <p className="font-semibold">
            Error loading applications
          </p>

          <p className="mt-1">
            {error}
          </p>
        </div>
      )}

      {!error && applications.length === 0 && (
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

      {applications.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
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
                    Status
                  </th>

                  <th className="text-left p-5">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-5">
                      <span className="font-bold text-blue-600">
                        {applicationNumbers[application.id] || "-"}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="font-semibold">
                        {application.customerName}
                      </div>
                    </td>

                    <td className="p-5">
                      {application.mobile}
                    </td>

                    <td className="p-5">
                      {application.serviceName}
                    </td>

                    <td className="p-5">
                      {application.category || "-"}
                    </td>

                    <td className="p-5 font-semibold">
                      ₹{Number(application.price || 0)}
                    </td>

                    <td className="p-5">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {application.status || "Pending"}
                      </span>
                    </td>

                    <td className="p-5 text-gray-600">
                      {formatDate(application.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {applications.length > 0 && (
        <div className="mt-5 text-gray-500">
          Total Applications:{" "}
          <span className="font-bold text-gray-800">
            {applications.length}
          </span>
        </div>
      )}
    </AdminLayout>
  );
}

export default Applications;
