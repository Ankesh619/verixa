import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import DocumentUploader from "../components/DocumentUploader";

type Service = {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  requiredDocuments: string[];
};

function ApplicationForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");

  const [documents, setDocuments] = useState<{
    [key: string]: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /*
   * Convert requiredDocuments into a proper string array.
   *
   * Supabase JSONB may return:
   * ["Aadhaar Front", "PAN Card"]
   *
   * or:
   * {"0":"Aadhaar Front","1":"PAN Card"}
   *
   * or a JSON string.
   */
  const normalizeDocuments = (value: any): string[] => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.filter(
        (item) => typeof item === "string"
      );
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => typeof item === "string"
          );
        }

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          return Object.values(parsed).filter(
            (item): item is string =>
              typeof item === "string"
          );
        }
      } catch (error) {
        console.error(
          "requiredDocuments JSON parse error:",
          error
        );
      }

      return [];
    }

    if (typeof value === "object") {
      return Object.values(value).filter(
        (item): item is string =>
          typeof item === "string"
      );
    }

    return [];
  };

  /*
   * Load service
   */
  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) {
        setError("Service ID not found.");
        return;
      }

      try {
        setError("");

        const {
          data,
          error,
        } = await supabase
          .from("services")
          .select("*")
          .eq("id", serviceId)
          .single();

        if (error) {
          console.error(
            "Service Load Error:",
            error
          );

          setError(
            error.message ||
              "Unable to load service."
          );

          return;
        }

        if (!data) {
          setError("Service not found.");
          return;
        }

        const normalizedService: Service = {
          id: data.id,
          serviceName:
            data.serviceName || "",
          category:
            data.category || "",
          price:
            Number(data.price || 0),
          requiredDocuments:
            normalizeDocuments(
              data.requiredDocuments
            ),
        };

        console.log(
          "Loaded Service:",
          normalizedService
        );

        setService(normalizedService);
      } catch (err) {
        console.error(
          "Service Load Exception:",
          err
        );

        setError(
          "Unable to load service."
        );
      }
    };

    loadService();
  }, [serviceId]);

  /*
   * Submit application
   */
  const handleSubmit = async () => {
    setError("");

    if (!customerName.trim()) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (!mobile.trim()) {
      setError(
        "Please enter your mobile number."
      );
      return;
    }

    if (mobile.trim().length !== 10) {
      setError(
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    if (!service) {
      setError(
        "Service information is not available."
      );
      return;
    }

    const requiredDocuments =
      normalizeDocuments(
        service.requiredDocuments
      );

    const missingDocuments =
      requiredDocuments.filter(
        (documentName) =>
          !documents[documentName]
      );

    if (
      missingDocuments.length > 0
    ) {
      setError(
        `Please upload: ${missingDocuments.join(
          ", "
        )}`
      );
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Create application
       */
      const {
        data: application,
        error: applicationError,
      } = await supabase
        .from("applications")
        .insert({
          customerName:
            customerName.trim(),

          mobile:
            mobile.trim(),

          serviceId:
            service.id,

          serviceName:
            service.serviceName,

          category:
            service.category || "",

          price:
            Number(service.price || 0),

          documents,

          status: "Pending",

          createdAt:
            new Date().toISOString(),
        })
        .select()
        .single();

      if (applicationError) {
        console.error(
          "Application Insert Error:",
          applicationError
        );

        throw applicationError;
      }

      if (!application) {
        throw new Error(
          "Application could not be created."
        );
      }

      /*
       * Generate Application Number
       */
      const generatedApplicationNo =
        `VX-${new Date().getFullYear()}-${String(
          application.id
        )
          .substring(0, 6)
          .toUpperCase()}`;

      /*
       * Save Application Number
       */
      const {
        error: numberError,
      } = await supabase
        .from("applicationNumbers")
        .insert({
          applicationId:
            application.id,

          applicationNo:
            generatedApplicationNo,

          createdAt:
            new Date().toISOString(),
        });

      if (numberError) {
        console.error(
          "Application Number Error:",
          numberError
        );

        throw numberError;
      }

      /*
       * Application created successfully.
       *
       * Redirect customer to payment page.
       */
      navigate(
        `/payments?applicationId=${application.id}`
      );
    } catch (err: any) {
      console.error(
        "Application Submit Error:",
        err
      );

      setError(
        err?.message ||
          "Application submit failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Error screen
   */
  if (error && !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg w-full">
          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-red-600">
            {error}
          </h1>
        </div>
      </div>
    );
  }

  /*
   * Loading
   */
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-4">
            Loading...
          </div>

          <p className="text-gray-500">
            Please wait while service
            information is loading.
          </p>
        </div>
      </div>
    );
  }

  const requiredDocuments =
    normalizeDocuments(
      service.requiredDocuments
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="bg-blue-600 text-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold">
            {service.serviceName}
          </h1>

          <p className="mt-2 text-blue-100">
            Service Application
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Service Information */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {service.serviceName}
              </h2>

              <p className="text-gray-500 mt-2">
                Category:{" "}
                {service.category}
              </p>
            </div>

            <div className="text-2xl font-bold text-blue-600">
              ₹{service.price}
            </div>
          </div>
        </div>

        {/* Customer Details */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">
            Customer Details
          </h2>

          <label className="block font-semibold mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-4 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block font-semibold mb-2">
            Mobile Number
          </label>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter 10 digit mobile number"
            value={mobile}
            onChange={(e) =>
              setMobile(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Documents */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold">
            Required Documents
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Please upload clear photos
            of the required documents.
          </p>

          {requiredDocuments.length >
          0 ? (
            <div className="space-y-6">
              {requiredDocuments.map(
                (documentName) => (
                  <div
                    key={documentName}
                    className="border rounded-2xl p-5"
                  >
                    <DocumentUploader
                      title={
                        documentName
                      }
                      folder={`applications/${service.id}`}
                      onUploaded={(
                        url
                      ) => {
                        setDocuments(
                          (
                            previous
                          ) => {
                            const updated =
                              {
                                ...previous,
                              };

                            if (url) {
                              updated[
                                documentName
                              ] = url;
                            } else {
                              delete updated[
                                documentName
                              ];
                            }

                            return updated;
                          }
                        );
                      }}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl">
              No required documents
              have been added for
              this service.
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-6">
              {error}
            </div>
          )}

          {/* Submit */}

          <button
            type="button"
            onClick={
              handleSubmit
            }
            disabled={
              submitting
            }
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            {submitting
              ? "Submitting Application..."
              : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;