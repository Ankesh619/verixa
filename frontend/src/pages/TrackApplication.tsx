import {
  CheckCircle,
  Clock,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

type Application = {
  id: string;
  customerName: string;
  mobile: string;
  serviceId: string;
  serviceName: string;
  category: string | null;
  price: number | null;
  status: string | null;
  createdAt: string;
};

type ApplicationNumber = {
  applicationId: string;
  applicationNo: string;
};

function TrackApplication() {
  const [applicationNoInput, setApplicationNoInput] =
    useState("");

  const [application, setApplication] =
    useState<Application | null>(null);

  const [applicationNo, setApplicationNo] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [searched, setSearched] =
    useState(false);

  /*
   * Search application
   */
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setApplication(null);
      setApplicationNo("");
      setSearched(true);

      const searchNo =
        applicationNoInput.trim();

      if (!searchNo) {
        setError(
          "Please enter your application number."
        );
        return;
      }

      /*
       * Find application number
       */
      const {
        data: numberData,
        error: numberError,
      } = await supabase
        .from("applicationNumbers")
        .select("*")
        .eq("applicationNo", searchNo)
        .maybeSingle();

      if (numberError) {
        throw numberError;
      }

      if (!numberData) {
        setError(
          "Application not found. Please check your application number."
        );
        return;
      }

      const number =
        numberData as ApplicationNumber;

      /*
       * Load application
       */
      const {
        data: applicationData,
        error: applicationError,
      } = await supabase
        .from("applications")
        .select("*")
        .eq(
          "id",
          number.applicationId
        )
        .maybeSingle();

      if (applicationError) {
        throw applicationError;
      }

      if (!applicationData) {
        setError(
          "Application details could not be found."
        );
        return;
      }

      setApplication(
        applicationData as Application
      );

      setApplicationNo(
        number.applicationNo
      );
    } catch (err: any) {
      console.error(
        "Track Application Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to track application."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Allow Enter key
   */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  /*
   * Format date
   */
  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * Normalize status
   */
  const status =
    application?.status?.toLowerCase() ||
    "pending";

  /*
   * Progress
   */
  const getProgress = () => {
    switch (status) {
      case "completed":
        return 100;

      case "processing":
        return 65;

      case "rejected":
        return 100;

      case "pending":
      default:
        return 25;
    }
  };

  const progress =
    getProgress();

  /*
   * Status color
   */
  const getStatusClass = () => {
    switch (status) {
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
   * Status label
   */
  const getStatusLabel = () => {
    switch (status) {
      case "completed":
        return "Completed";

      case "processing":
        return "Processing";

      case "rejected":
        return "Rejected";

      case "pending":
      default:
        return "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}

      <div className="bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">

          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-100 hover:text-white font-semibold mb-6"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold">
            Track Application
          </h1>

          <p className="text-blue-100 mt-2">
            Check the current status of your application.
          </p>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Search */}

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">

          <h2 className="text-2xl font-bold text-slate-800">
            Find Your Application
          </h2>

          <p className="text-gray-500 mt-2">
            Enter the application number received after submitting your application.
          </p>

          <div className="flex flex-col md:flex-row gap-3 mt-6">

            <input
              type="text"
              value={applicationNoInput}
              onChange={(event) =>
                setApplicationNoInput(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Enter application number"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="md:w-48 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl px-6 py-3 font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                "Searching..."
              ) : (
                <>
                  <Search size={20} />
                  Track
                </>
              )}
            </button>

          </div>

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 flex items-start gap-3">
              <XCircle
                size={21}
                className="mt-0.5 shrink-0"
              />

              <p>
                {error}
              </p>
            </div>
          )}

        </div>

        {/* Empty state */}

        {searched &&
          !loading &&
          !application &&
          !error && (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <FileText
                size={50}
                className="mx-auto text-gray-400"
              />

              <h2 className="text-2xl font-bold mt-5">
                Application Not Found
              </h2>

              <p className="text-gray-500 mt-2">
                Please check the application number and try again.
              </p>
            </div>
          )}

        {/* Application */}

        {application && (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">

            {/* Top */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-sm text-gray-500">
                  Application Number
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-blue-600 font-mono mt-1">
                  {applicationNo}
                </h2>

              </div>

              <span
                className={`inline-flex self-start md:self-auto px-4 py-2 rounded-full font-bold ${getStatusClass()}`}
              >
                {getStatusLabel()}
              </span>

            </div>

            {/* Application information */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div>
                <p className="text-gray-500 text-sm">
                  Service
                </p>

                <p className="font-bold text-lg mt-1">
                  {application.serviceName ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Customer
                </p>

                <p className="font-bold text-lg mt-1">
                  {application.customerName ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Mobile
                </p>

                <p className="font-semibold mt-1">
                  {application.mobile ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Applied Date
                </p>

                <p className="font-semibold mt-1">
                  {formatDate(
                    application.createdAt
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Category
                </p>

                <p className="font-semibold mt-1">
                  {application.category ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Service Fee
                </p>

                <p className="font-bold text-green-600 text-lg mt-1">
                  ₹
                  {Number(
                    application.price || 0
                  )}
                </p>
              </div>

            </div>

            {/* Progress */}

            <div className="mt-10">

              <div className="flex justify-between items-center mb-3">

                <span className="font-bold text-slate-800">
                  Application Progress
                </span>

                <span className="font-bold text-blue-600">
                  {progress}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

                <div
                  className={`h-4 rounded-full transition-all ${
                    status === "rejected"
                      ? "bg-red-500"
                      : status === "completed"
                      ? "bg-green-500"
                      : "bg-blue-600"
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            {/* Timeline */}

            <div className="mt-10">

              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Application Status
              </h3>

              {/* Submitted */}

              <div className="flex items-start gap-4">

                <CheckCircle
                  size={28}
                  className="text-green-600 shrink-0"
                />

                <div>

                  <h4 className="font-bold">
                    Application Submitted
                  </h4>

                  <p className="text-gray-500 mt-1">
                    Your application has been received successfully.
                  </p>

                </div>

              </div>

              {/* Processing */}

              <div className="flex items-start gap-4 mt-6">

                {status === "pending" ? (
                  <Clock
                    size={28}
                    className="text-yellow-500 shrink-0"
                  />
                ) : (
                  <CheckCircle
                    size={28}
                    className="text-green-600 shrink-0"
                  />
                )}

                <div>

                  <h4 className="font-bold">
                    Processing
                  </h4>

                  <p className="text-gray-500 mt-1">
                    {status === "pending"
                      ? "Your application is waiting for processing."
                      : "Your application has moved into processing."}
                  </p>

                </div>

              </div>

              {/* Final status */}

              <div className="flex items-start gap-4 mt-6">

                {status === "completed" ? (
                  <CheckCircle
                    size={28}
                    className="text-green-600 shrink-0"
                  />
                ) : status === "rejected" ? (
                  <XCircle
                    size={28}
                    className="text-red-600 shrink-0"
                  />
                ) : (
                  <Clock
                    size={28}
                    className="text-gray-400 shrink-0"
                  />
                )}

                <div>

                  <h4 className="font-bold">
                    {status === "completed"
                      ? "Application Completed"
                      : status === "rejected"
                      ? "Application Rejected"
                      : "Final Processing"}
                  </h4>

                  <p className="text-gray-500 mt-1">
                    {status === "completed"
                      ? "Your application has been completed successfully."
                      : status === "rejected"
                      ? "Your application has been rejected. Please contact support for more information."
                      : "Your application is still being processed."}
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default TrackApplication;