import { CheckCircle, Clock, FileText } from "lucide-react";

function TrackApplication() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Track Application
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">Application No.</p>
              <h2 className="text-xl font-bold">
                VER2026000123
              </h2>
            </div>

            <div>
              <p className="text-gray-500">Service</p>
              <h2 className="text-xl font-bold">
                Passport
              </h2>
            </div>

            <div>
              <p className="text-gray-500">Applied Date</p>
              <h2 className="font-semibold">
                02 Aug 2026
              </h2>
            </div>

            <div>
              <p className="text-gray-500">Expected Completion</p>
              <h2 className="font-semibold">
                08 Aug 2026
              </h2>
            </div>

          </div>

          <div className="mt-10">

            <div className="flex justify-between mb-3">

              <span className="font-semibold">
                Progress
              </span>

              <span className="text-blue-600 font-bold">
                70%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">

              <div className="bg-blue-600 h-4 rounded-full w-[70%]"></div>

            </div>

          </div>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-600" size={28} />

              <div>
                <h3 className="font-bold">
                  Application Submitted
                </h3>

                <p className="text-gray-500">
                  Your application has been received.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <CheckCircle className="text-green-600" size={28} />

              <div>

                <h3 className="font-bold">
                  Verification Completed
                </h3>

                <p className="text-gray-500">
                  Documents verified successfully.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <Clock className="text-yellow-500" size={28} />

              <div>

                <h3 className="font-bold">
                  Processing
                </h3>

                <p className="text-gray-500">
                  Your application is currently under processing.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4 opacity-40">

              <FileText size={28} />

              <div>

                <h3 className="font-bold">
                  Certificate Ready
                </h3>

                <p>
                  Waiting...
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TrackApplication;