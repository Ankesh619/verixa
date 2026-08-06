import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function ApplicationForm() {
  const { serviceId } = useParams();

  const [loading, setLoading] = useState(true);

  const [service, setService] = useState<any>(null);

  const [fullName, setFullName] = useState("");

  const [mobile, setMobile] = useState("");

  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");

  const [aadhaar, setAadhaar] = useState("");

  const [pan, setPan] = useState("");

  useEffect(() => {
    loadService();
  }, []);

  const loadService = async () => {
    if (!serviceId) return;

    const docRef = doc(db, "services", serviceId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setService({
        id: docSnap.id,
        ...docSnap.data(),
      });
    }

    setLoading(false);
  };

  const submitApplication = async () => {
    if (!service) return;

    if (
      fullName === "" ||
      mobile === "" ||
      address === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    await addDoc(collection(db, "applications"), {
      serviceId: service.id,
      serviceName: service.serviceName,

      category: service.category,

      price: service.price,

      fullName,

      mobile,

      email,

      address,

      aadhaar,

      pan,

      status: "Pending",

      createdAt: new Date(),
    });

    alert("Application Submitted Successfully");

    setFullName("");
    setMobile("");
    setEmail("");
    setAddress("");
    setAadhaar("");
    setPan("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl text-red-600">
        Service Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="bg-blue-600 text-white p-8">

        <h1 className="text-4xl font-bold">
          Apply Service
        </h1>

        <p className="mt-2">
          {service.serviceName}
        </p>

      </div>

      <div className="max-w-4xl mx-auto p-8">

        <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold mb-8">
            Customer Details
          </h2>

          <input
            placeholder="Full Name *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-xl p-4 mb-5"
          />

          <input
            placeholder="Mobile Number *"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border rounded-xl p-4 mb-5"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-4 mb-5"
          />

          <textarea
            placeholder="Full Address *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-xl p-4 mb-5 h-32"
          />

          <input
            placeholder="Aadhaar Number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            className="w-full border rounded-xl p-4 mb-5"
          />

          <input
            placeholder="PAN Number"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            className="w-full border rounded-xl p-4 mb-8"
          />

          <div className="bg-slate-100 rounded-2xl p-6 mb-8">

            <h3 className="text-2xl font-bold mb-4">
              Service Details
            </h3>

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <p className="text-gray-500">
                  Service Name
                </p>

                <p className="font-bold text-xl">
                  {service.serviceName}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Category
                </p>

                <p className="font-bold text-xl">
                  {service.category}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Service Fee
                </p>

                <p className="font-bold text-2xl text-blue-600">
                  ₹{service.price}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Status
                </p>

                <p className="font-bold text-green-600">
                  Pending
                </p>

              </div>

            </div>

          </div>
                    <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => {
                setFullName("");
                setMobile("");
                setEmail("");
                setAddress("");
                setAadhaar("");
                setPan("");
              }}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={submitApplication}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit Application
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ApplicationForm;