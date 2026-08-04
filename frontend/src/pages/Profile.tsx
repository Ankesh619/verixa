import { User, Mail, Phone, MapPin, ShieldCheck, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 h-40 relative">
          <div className="absolute left-10 top-20 flex items-center gap-6">

            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />

            <div className="mt-14 text-white">
              <h1 className="text-3xl font-bold">Ankesh Chadar</h1>
              <p className="opacity-90">VERIXA User</p>
            </div>

          </div>
        </div>

        {/* Content */}
        <div className="pt-28 px-10 pb-10">

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              My Profile
            </h2>

            <Link to="/edit-profile">
               <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700">
                  <Pencil size={18} />
                   Edit Profile
               </button>
             </Link>
      </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-50 rounded-xl p-5 flex gap-4">
              <User className="text-blue-600" />
              <div>
                <p className="text-gray-500">Full Name</p>
                <h3 className="font-semibold text-lg">
                  Ankesh Chadar
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 flex gap-4">
              <Phone className="text-blue-600" />
              <div>
                <p className="text-gray-500">Mobile</p>
                <h3 className="font-semibold text-lg">
                  +91 9876543210
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 flex gap-4">
              <Mail className="text-blue-600" />
              <div>
                <p className="text-gray-500">Email</p>
                <h3 className="font-semibold text-lg">
                  ankesh@example.com
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 flex gap-4">
              <MapPin className="text-blue-600" />
              <div>
                <p className="text-gray-500">Address</p>
                <h3 className="font-semibold text-lg">
                  Tikamgarh, Madhya Pradesh
                </h3>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-5 flex gap-4 md:col-span-2">
              <ShieldCheck className="text-green-600" />

              <div>
                <p className="text-gray-500">
                  Aadhaar / KYC Status
                </p>

                <h3 className="font-bold text-green-600 text-lg">
                  VERIFIED
                </h3>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;