import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Otp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        <h1 className="text-5xl font-extrabold text-blue-600 text-center">
          VERIXA
        </h1>

        <p className="text-center text-gray-500 mt-3">
          OTP Verification
        </p>

        <p className="text-center text-gray-600 mt-6">
          Enter the 6-digit OTP sent to
        </p>

        <p className="text-center font-bold text-lg mt-2">
          +91 9876543210
        </p>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          className="w-full mt-8 border rounded-xl p-4 text-center text-2xl tracking-[12px] outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition"
        >
          Verify OTP
        </button>

        <div className="text-center mt-6">
          <button className="text-blue-600 font-semibold hover:underline">
            Resend OTP (30s)
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-gray-500 text-sm">
          <ShieldCheck size={18} />
          <span>Secure Verification</span>
        </div>

      </div>
    </div>
  );
}

export default Otp;