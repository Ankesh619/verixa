import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

function ApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] =
    useState<Application | null>(null);

  const [applicationNo, setApplicationNo] =
    useState("-");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  /*
   * Load application
   */
  const loadApplication = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!id) {
        throw new Error(
          "Application ID not found."
        );
      }

      /*
       * Load application
       */
      const {
        data: applicationData,
        error: applicationError,
      } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (applicationError) {
        throw applicationError;
      }

      if (!applicationData) {
        throw new Error(
          "Application not found."
        );
      }

      setApplication(
        applicationData as Application
      );

      /*
       * Load application number
       */
      const {
        data: numberData,
        error: numberError,
      } = await supabase
        .from("applicationNumbers")
        .select("*")
        .eq("applicationId", id)
        .maybeSingle();

      if (numberError) {
        console.error(
          "Application Number Error:",
          numberError
        );
      }

      if (numberData) {
        const number =
          numberData as ApplicationNumber;

        setApplicationNo(
          number.applicationNo
        );
      }
    } catch (err: any) {
      console.error(
        "Application Details Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load application."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Change application status
   */
  const updateStatus = async (
    newStatus: string
  ) => {
    if (!application) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const {
        data,
        error: updateError,
      } = await supabase
        .from("applications")
        .update({
          status: newStatus,
        })
        .eq("id", application.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (!data) {
        throw new Error(
          "Status could not be updated."
        );
      }

      setApplication(
        data as Application
      );

      setSuccess(
        `Application status changed to "${newStatus}".`
      );
    } catch (err: any) {
      console.error(
        "Status Update Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update status."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Format date
   */
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

  /*
   * Status badge
   */
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

  /*
   * Loading
   */
  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">
              ⏳
            </div>

            <p className="text-gray-500 text-lg">
              Loading application...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /*
   * Error / not found
   */
  if (error && !application) {
    return (
      <AdminLayout>
        <Link
          to="/admin/applications"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          ← Back to Applications
        </Link>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-red-600">
            Unable to Load Application
          </h1>

          <p className="text-red-500 mt-3">
            {error}
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-5xl mb-4">
            📋
          </div>

          <h1 className="text-2xl font-bold">
            Application not found.
          </h1>

          <Link
            to="/admin/applications"
            className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Back to Applications
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const documents =
    application.documents &&
    typeof application.documents ===
      "object"
      ? application.documents
      : {};

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link
          to="/admin/applications"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          ← Back to Applications
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Application Details
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage customer application
            </p>
          </div>

          <div className="bg-blue-50 px-5 py-3 rounded-xl">
            <p className="text-sm text-gray-500">
              Application Number
            </p>

            <p className="text-xl font-bold text-blue-600">
              {applicationNo}
            </p>
          </div>

        </div>

        {/* Messages */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl mb-6">
            {success}
          </div>
        )}

        {/* Application Information */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                Application Information
              </h2>

              <p className="text-gray-500 mt-1 break-all">
                ID: {application.id}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
                application.status
              )}`}
            >
              {application.status ||
                "Pending"}
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Customer */}

            <div>
              <p className="text-sm text-gray-500">
                Customer Name
              </p>

              <p className="text-lg font-semibold mt-1">
                {application.customerName}
              </p>
            </div>

            {/* Mobile */}

            <div>
              <p className="text-sm text-gray-500">
                Mobile Number
              </p>

              <p className="text-lg font-semibold mt-1">
                {application.mobile}
              </p>
            </div>

            {/* Service */}

            <div>
              <p className="text-sm text-gray-500">
                Service
              </p>

              <p className="text-lg font-semibold mt-1">
                {application.serviceName}
              </p>
            </div>

            {/* Category */}

            <div>
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="text-lg font-semibold mt-1">
                {application.category ||
                  "-"}
              </p>
            </div>

            {/* Price */}

            <div>
              <p className="text-sm text-gray-500">
                Service Price
              </p>

              <p className="text-lg font-bold text-blue-600 mt-1">
                ₹
                {Number(
                  application.price || 0
                )}
              </p>
            </div>

            {/* Created */}

            <div>
              <p className="text-sm text-gray-500">
                Submitted On
              </p>

              <p className="text-lg font-semibold mt-1">
                {formatDate(
                  application.createdAt
                )}
              </p>
            </div>

          </div>

        </div>

        {/* Status Management */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

          <h2 className="text-2xl font-bold">
            Update Application Status
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Change the current status of this application.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            {/* Pending */}

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateStatus(
                  "Pending"
                )
              }
              className={`px-4 py-3 rounded-xl bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold disabled:opacity-50 ${
                application.status?.toLowerCase() ===
                "pending"
                  ? "ring-2 ring-yellow-500"
                  : ""
              }`}
            >
              Pending
            </button>

            {/* Processing */}

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateStatus(
                  "Processing"
                )
              }
              className={`px-4 py-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold disabled:opacity-50 ${
                application.status?.toLowerCase() ===
                "processing"
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              Processing
            </button>

            {/* Completed */}

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateStatus(
                  "Completed"
                )
              }
              className={`px-4 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-semibold disabled:opacity-50 ${
                application.status?.toLowerCase() ===
                "completed"
                  ? "ring-2 ring-green-500"
                  : ""
              }`}
            >
              Completed
            </button>

            {/* Rejected */}

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateStatus(
                  "Rejected"
                )
              }
              className={`px-4 py-3 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-semibold disabled:opacity-50 ${
                application.status?.toLowerCase() ===
                "rejected"
                  ? "ring-2 ring-red-500"
                  : ""
              }`}
            >
              Rejected
            </button>

          </div>

          {saving && (
            <p className="text-gray-500 mt-4">
              Updating status...
            </p>
          )}

        </div>

        {/* Documents */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

          <h2 className="text-2xl font-bold">
            Uploaded Documents
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Documents submitted by the customer.
          </p>

          {Object.keys(
            documents
          ).length === 0 ? (

            <div className="bg-yellow-50 text-yellow-700 p-5 rounded-xl">
              No documents were uploaded.
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {Object.entries(
                documents
              ).map(
                (
                  [
                    documentName,
                    documentUrl,
                  ]
                ) => (

                  <div
                    key={documentName}
                    className="border rounded-2xl p-5"
                  >

                    <h3 className="font-bold text-lg mb-4">
                      {documentName}
                    </h3>

                    {documentUrl ? (

                      <a
                        href={
                          documentUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                      >
                        View Document
                      </a>

                    ) : (

                      <p className="text-gray-500">
                        Document URL not available.
                      </p>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    </AdminLayout>
  );
}

export default ApplicationDetails;