import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { supabase } from "../supabase";

function Otp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email =
    sessionStorage.getItem("verixa_login_email") || "";

  const handleVerify = async () => {
    const cleanOtp = otp.trim();

    if (!email) {
      alert("Login session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (cleanOtp.length !== 6) {
      alert("Enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.verifyOtp({
          email,
          token: cleanOtp,
          type: "email",
        });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error(
          "Login session could not be created."
        );
      }

      sessionStorage.removeItem(
        "verixa_login_email"
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err: any) {
      console.error(
        "Supabase OTP Verification Error:",
        err
      );

      alert(
        "OTP Verification Error:\n\n" +
          (err?.message || "Invalid or expired OTP.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          },
        });

      if (error) {
        throw error;
      }

      alert("A new OTP has been sent to your email.");
    } catch (err: any) {
      console.error(
        "Resend OTP Error:",
        err
      );

      alert(
        err?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

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

        <p className="text-center font-semibold text-blue-600 mt-2 break-all">
          {email || "your email"}
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value.replace(/\D/g, "")
            )
          }
          placeholder="Enter OTP"
          className="w-full mt-8 border rounded-xl p-4 text-center text-2xl tracking-[12px] outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 font-semibold hover:underline disabled:text-gray-400"
          >
            Resend OTP
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
