import { useParams, Link } from "react-router-dom";
import { services } from "../data/services";

function ServiceDetails() {
  const { id } = useParams();

  const service = services.find((item) => item.id === id);

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
          {service.icon} {service.name}
        </h1>

        <p className="mt-2">
          Select the work you want to perform
        </p>

      </div>

      <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-6">

        {service.works.map((work) => (

          <Link
            key={work.id}
            to={`/apply/${service.id}/${work.id}`}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >

            <h2 className="text-2xl font-bold text-blue-600">
              {work.title}
            </h2>

            <p className="mt-4">
              💰 Fee : ₹{work.price}
            </p>

            <p className="mt-2">
              ⏱ Time : {work.days}
            </p>

            <button className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-xl">
              Continue
            </button>

          </Link>

        ))}

      </div>

    </div>
  );
}

export default ServiceDetails;