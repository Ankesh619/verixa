import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

type Application = {
  id: string;
  price: number;
  status: string;
};

function AdminDashboard() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error: applicationsError,
      } = await supabase
        .from("applications")
        .select("id, price, status");

      if (applicationsError) {
        throw applicationsError;
      }

      setApplications(data || []);
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

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() ===
        "pending"
    ).length;

  const completedApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() ===
        "completed"
    ).length;

  const revenue = applications.reduce(
    (total, application) =>
      total +
      Number(application.price || 0),
    0
  );

  return (
    <AdminLayout>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to VERIXA Admin Panel
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          ↻ Refresh
        </button>

      </div>

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

      <div className="grid md:grid-cols-4 gap-6 mt-10">

        {/* Total Applications */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500">
            Total Applications
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            {loading
              ? "..."
              : totalApplications}
          </h1>

          <Link
            to="/admin/applications"
            className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
          >
            View Applications →
          </Link>

        </div>

        {/* Pending */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500">
            Pending
          </h2>

          <h1 className="text-4xl font-bold mt-3 text-orange-500">
            {loading
              ? "..."
              : pendingApplications}
          </h1>

        </div>

        {/* Completed */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500">
            Completed
          </h2>

          <h1 className="text-4xl font-bold mt-3 text-green-600">
            {loading
              ? "..."
              : completedApplications}
          </h1>

        </div>

        {/* Revenue */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500">
            Revenue
          </h2>

          <h1 className="text-4xl font-bold mt-3 text-blue-600">
            {loading
              ? "..."
              : `₹${revenue}`}
          </h1>

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;