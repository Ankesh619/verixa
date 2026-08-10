import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import { supabase } from "../supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        throw error;
      }

      sessionStorage.setItem(
        "verixa_login_email",
        cleanEmail
      );

      alert("OTP has been sent to your email.");

      navigate("/otp");
    } catch (err: any) {
      console.error("Supabase Login Error:", err);

      alert(
        "Login Error:\n\n" +
          (err?.message || "Unable to send OTP.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

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
            Email Address
          </label>

          <div className="mt-2 flex items-center border rounded-xl overflow-hidden">

            <div className="px-4 text-gray-500">
              <Mail size={20} />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className="w-full p-4 outline-none"
              autoComplete="email"
            />

          </div>

        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition text-white font-semibold py-4 rounded-xl text-lg"
        >
          {loading ? "Sending OTP..." : "Continue"}
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
