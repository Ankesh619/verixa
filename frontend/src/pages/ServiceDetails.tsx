import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
          {service.servicename}
        </h1>

        <p className="mt-2">
          Select the work you want to perform
        </p>

      </div>
<div className="max-w-6xl mx-auto p-8">

  <div className="bg-white rounded-2xl shadow-lg p-8">

    <h2 className="text-3xl font-bold">
      {service.servicename}
    </h2>

    <p className="mt-4">
      Category : {service.category}
    </p>

    <p className="mt-4 text-blue-600 font-bold text-2xl">
      ₹{service.price}
    </p>

    <Link
  to={`/apply/${service.id}`}
  className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
>
  Apply Now
</Link>
  </div>

</div>
      
       

    </div>
  );
}

export default ServiceDetails;