import { CreditCard, QrCode, CheckCircle, Download } from "lucide-react";

function Payments() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Payments
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Payment Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-blue-600" size={34} />
              <h2 className="text-2xl font-bold">
                Pay Service Fee
              </h2>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6">

              <p className="text-gray-600">
                Service
              </p>

              <h3 className="text-xl font-bold">
                Passport Application
              </h3>

              <div className="mt-5 flex justify-between">

                <span className="text-gray-500">
                  Amount
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  ₹499
                </span>

              </div>

            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold">
              Pay Now
            </button>

          </div>

          {/* QR */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

            <QrCode
              className="mx-auto text-blue-600"
              size={90}
            />

            <h2 className="text-2xl font-bold mt-6">
              Scan QR Code
            </h2>

            <div className="bg-gray-100 w-64 h-64 mx-auto mt-6 rounded-2xl flex items-center justify-center">

              <span className="text-gray-400">
                QR CODE
              </span>

            </div>

            <p className="text-gray-500 mt-5">
              Scan using any UPI App
            </p>

          </div>

        </div>

        {/* Payment History */}

        <div className="bg-white rounded-3xl shadow-xl mt-10 p-8">

          <h2 className="text-2xl font-bold mb-6">
            Payment History
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between items-center border rounded-xl p-5">

              <div>

                <h3 className="font-bold">
                  PAN Card
                </h3>

                <p className="text-gray-500">
                  01 Aug 2026
                </p>

              </div>

              <div className="flex items-center gap-6">

                <span className="text-green-600 font-bold flex items-center gap-2">
                  <CheckCircle size={18} />
                  Success
                </span>

                <button className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">

                  <Download size={18} />

                  Receipt

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Payments;