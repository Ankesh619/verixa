import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";

function ServiceDetails() {
  const { id } = useParams();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setService(null);
      } else {
        setService(data);
      }

      setLoading(false);
    };

    loadService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading Service...
        </p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold">
          Service Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-blue-600 text-white p-8">

        <h1 className="text-4xl font-bold">
          {service.serviceName}
        </h1>

        <p className="mt-2">
          Select the work you want to perform
        </p>

      </div>

      <div className="max-w-5xl mx-auto p-8">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-3xl font-bold">
            {service.serviceName}
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