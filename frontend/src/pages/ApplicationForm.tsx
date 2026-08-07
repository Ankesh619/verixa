import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import DocumentUploader from "../components/DocumentUploader";

function ApplicationForm() {
  const { serviceId } = useParams();

  const [service, setService] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [documents, setDocuments] = useState<{
    [key: string]: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [applicationNo, setApplicationNo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) return;

      try {
        const docRef = doc(db, "services", serviceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setService({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          setError("Service not found");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load service");
      }
    };

    loadService();
  }, [serviceId]);

  const handleSubmit = async () => {
    setError("");

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!mobile.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (mobile.trim().length !== 10) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    const requiredDocuments = service?.requiredDocuments || [];

    const missingDocuments = requiredDocuments.filter(
      (documentName: string) => !documents[documentName]
    );

    if (missingDocuments.length > 0) {
      setError(
        `Please upload: ${missingDocuments.join(", ")}`
      );
      return;
    }

    try {
      setSubmitting(true);

      const applicationsRef = collection(db, "applications");

      const applicationDoc = await addDoc(applicationsRef, {
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        serviceId: service.id,
        serviceName: service.serviceName,
        category: service.category || "",
        price: Number(service.price || 0),
        documents,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      const generatedApplicationNo =
        `VX-${new Date().getFullYear()}-${applicationDoc.id
          .substring(0, 6)
          .toUpperCase()}`;

      await addDoc(collection(db, "applicationNumbers"), {
        applicationId: applicationDoc.id,
        applicationNo: generatedApplicationNo,
        createdAt: serverTimestamp(),
      });

      setApplicationNo(generatedApplicationNo);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Application submit failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !service) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600">
            {error}
          </h1>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl font-semibold">
          Loading service...
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">

          <div className="text-6xl mb-6">
            ✅
          </div>

          <h1 className="text-3xl font-bold text-green-600">
            Service Applied Successfully
          </h1>

          <p className="text-gray-600 mt-4">
            Your {service.serviceName} application has been
            submitted successfully.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mt-8">
            <p className="text-gray-600">
              Application Number
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-2">
              {applicationNo}
            </p>
          </div>

          <p className="text-gray-500 mt-6">
            Please keep this application number safe for
            tracking your application.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

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
                Category: {service.category}
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
              setCustomerName(e.target.value)
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
                e.target.value.replace(/\D/g, "")
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
            Please upload clear photos of the required
            documents.
          </p>

          {service.requiredDocuments?.length > 0 ? (
            service.requiredDocuments.map(
              (documentName: string) => (
                <DocumentUploader
                  key={documentName}
                  title={documentName}
                  folder={`applications/${service.id}`}
                  onUploaded={(url) => {
                    setDocuments((previous) => ({
                      ...previous,
                      [documentName]: url,
                    }));
                  }}
                />
              )
            )
          ) : (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl">
              No required documents have been added for
              this service.
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-6">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            {submitting
              ? "Submitting Application..."
              : "Submit Application"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ApplicationForm;