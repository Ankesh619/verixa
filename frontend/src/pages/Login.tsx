import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ShieldCheck } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");

  const handleContinue = () => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    navigate("/otp");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-blue-600">
            VERIXA
          </h1>

          <p className="text-gray-500 mt-3">
            Secure Digital Service Platform
          </p>
        </div>

        <div className="mt-8">

          <label className="font-semibold text-gray-700">
            Mobile Number
          </label>

          <div className="mt-2 flex items-center border rounded-xl overflow-hidden">

            <div className="px-4 text-gray-500">
              <Smartphone size={20} />
            </div>

            <span className="font-semibold text-gray-700">
              +91
            </span>

            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
              className="w-full p-4 outline-none"
            />

          </div>

        </div>

        <button
          onClick={handleContinue}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-4 rounded-xl text-lg"
        >
          Continue
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm">

          <ShieldCheck size={18} />

          <span>
            Your information is secure & encrypted
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;