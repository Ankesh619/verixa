
import {
  User,
  FileText,
  CreditCard,
  Bell,
  Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">
          Welcome to VERIXA
        </h1>

        <p className="mt-2">
          Manage all your government services from one place.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto p-8 grid md:grid-cols-3 gap-6">

        {/* My Profile */}
        <Link to="/profile">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer">

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-100 text-blue-600">
              <User size={40} />
            </div>

            <h2 className="text-xl font-bold mt-6">
              My Profile
            </h2>

            <p className="text-gray-500 mt-2">
              View and edit your profile
            </p>

          </div>
        </Link>

        {/* My Applications */}
        <Link to="/applications">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer">

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100 text-green-600">
              <FileText size={40} />
            </div>

            <h2 className="text-xl font-bold mt-6">
              My Applications
            </h2>

            <p className="text-gray-500 mt-2">
              View all submitted applications
            </p>

          </div>
        </Link>

        {/* Payments */}
        <Link to="/payments">
  <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer">

    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-yellow-100 text-yellow-600">
      <CreditCard size={40} />
    </div>

    <h2 className="text-xl font-bold mt-6">
      Payments
    </h2>

    <p className="text-gray-500 mt-2">
      View payment history
    </p>

  </div>
</Link>
<Link
  to="/apply"
  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
>
  <h2 className="text-xl font-bold text-blue-600">
    Apply Service
  </h2>

  <p className="text-gray-600 mt-2">
    Apply for PAN, Passport, GST, Aadhaar and more.
  </p>
</Link>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer">

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-100 text-red-600">
            <Bell size={40} />
          </div>

          <h2 className="text-xl font-bold mt-6">
            Notifications
          </h2>

          <p className="text-gray-500 mt-2">
            Latest updates
          </p>

        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer">

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-purple-100 text-purple-600">
            <Settings size={40} />
          </div>

          <h2 className="text-xl font-bold mt-6">
            Settings
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your account
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;