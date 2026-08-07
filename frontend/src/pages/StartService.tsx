import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

import {
  Search,
  CreditCard,
  IdCard,
  BadgeCheck,
  Building2,
  FileBadge,
  HeartPulse,
} from "lucide-react";

function StartService() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setServices(data || []);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-blue-600 text-white p-8">

        <h1 className="text-4xl font-bold">
          Start New Service
        </h1>

        <p className="mt-2 text-blue-100">
          Select a service to continue
        </p>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Search */}

        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3 mb-10">

          <Search className="text-gray-400" />

          <input
            type="text"
            placeholder="Search Service..."
            className="w-full outline-none"
          />

        </div>

        {/* Identity Services */}

        <h2 className="text-2xl font-bold mb-5">
          Identity Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* PAN */}

          <Link
            to="/service/pan"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >

            <CreditCard
              className="text-blue-600"
              size={42}
            />

            <h3 className="font-bold text-xl mt-4">
              PAN Card
            </h3>

            <p className="text-gray-500 mt-2">
              New PAN, Correction, Reprint
            </p>

          </Link>

          {/* Aadhaar */}

          <Link
            to="/service/aadhaar"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >

            <IdCard
              className="text-green-600"
              size={42}
            />

            <h3 className="font-bold text-xl mt-4">
              Aadhaar
            </h3>

            <p className="text-gray-500 mt-2">
              Mobile, Address, PVC
            </p>

          </Link>

          {/* Passport */}

          <Link
            to="/service/passport"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >

            <BadgeCheck
              className="text-purple-600"
              size={42}
            />

            <h3 className="font-bold text-xl mt-4">
              Passport
            </h3>

            <p className="text-gray-500 mt-2">
              New & Renewal
            </p>

          </Link>

        </div>

        {/* Business */}

        <h2 className="text-2xl font-bold mb-5">
          Business Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* GST */}

          <Link
            to="/service/gst"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >

            <Building2
              className="text-orange-600"
              size={42}
            />

            <h3 className="font-bold text-xl mt-4">
              GST Registration
            </h3>

            <p className="text-gray-500 mt-2">
              New GST Registration
            </p>

          </Link>

          {/* MSME */}

          <div className="bg-white rounded-2xl shadow-lg p-6 opacity-60 cursor-not-allowed">

            <FileBadge
              className="text-red-600"
              size={42}
            />

            <h3 className="font-bold text-xl mt-4">
              MSME Registration
            </h3>

            <p className="text-gray-500 mt-2">
              Coming Soon
            </p>

          </div>

        </div>

        {/* Supabase Services */}

        <h2 className="text-2xl font-bold mt-10 mb-5">
          Available Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {services.map((service) => (

            <Link
              key={service.id}
              to={`/service/${service.id}`}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <CreditCard
                className="text-blue-600"
                size={42}
              />

              <h3 className="font-bold text-xl mt-4">
                {service.serviceName}
              </h3>

              <p className="text-gray-500 mt-2">
                {service.category}
              </p>

              <p className="font-semibold text-blue-600 mt-3">
                ₹{service.price}
              </p>

            </Link>

          ))}

        </div>

        {/* Government */}

        <h2 className="text-2xl font-bold mb-5">
          Government Schemes
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6 opacity-60 cursor-not-allowed">

            <HeartPulse
              className="text-pink-600"
              size={42}
            />

            <h3 className="font-bold text-xl mt-4">
              Ayushman Card
            </h3>

            <p className="text-gray-500 mt-2">
              Coming Soon
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StartService;