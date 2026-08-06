import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
function ServiceDetails() {
  const { id } = useParams();

 const [service, setService] = useState<any>(null);

useEffect(() => {
  const loadService = async () => {
    if (!id) return;

    const docRef = doc(db, "services", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setService({
        id: docSnap.id,
        ...docSnap.data(),
      });
    }
  };

  loadService();
}, [id]);

  if (!service) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold text-red-600">
          Service Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <div className="bg-blue-600 text-white p-8">

        <h1 className="text-4xl font-bold">
          {service.name}
        </h1>

        <p className="mt-2">
          Select the work you want to perform
        </p>

      </div>
<div className="max-w-6xl mx-auto p-8">

  <div className="bg-white rounded-2xl shadow-lg p-8">

    <h2 className="text-3xl font-bold">
      {service.name}
    </h2>

    <p className="mt-4">
      Category : {service.category}
    </p>

    <p className="mt-4 text-blue-600 font-bold text-2xl">
      ₹{service.price}
    </p>

    <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl">
      Apply Now
    </button>

  </div>

</div>
      
       

    </div>
  );
}

export default ServiceDetails;