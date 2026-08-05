import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ShieldCheck } from "lucide-react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");

  const handleContinue = async () => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
          }
        );

        await window.recaptchaVerifier.render();
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + mobile,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;

      navigate("/otp");
    } catch (err: any) {
  console.error(err);

  alert(
    "Error Code: " +
      err.code +
      "\n\nMessage:\n" +
      err.message
  );
}
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

        <div
          id="recaptcha-container"
          className="flex justify-center mt-6"
        ></div>

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