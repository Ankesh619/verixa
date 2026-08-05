import { Link } from "react-router-dom";
function Applications() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        My Applications
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-4 text-left">Service</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            <tr className="border-b">
              <td className="p-4">PAN Card</td>
              <td className="text-center text-yellow-600 font-semibold">
                Pending
              </td>
              <td className="text-center">04 Aug 2026</td>
              <td className="text-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  View
                </button>
              </td>
            </tr>

            <tr className="border-b">
              <td className="p-4">Passport</td>
              <td className="text-center text-blue-600 font-semibold">
                Processing
              </td>
              <td className="text-center">02 Aug 2026</td>
              <td className="text-center">
                <Link
                      to="/track-application"
                       className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block"
       >
           Track
                  </Link>
              </td>
            </tr>

            <tr>
              <td className="p-4">GST Registration</td>
              <td className="text-center text-green-600 font-semibold">
                Approved
              </td>
              <td className="text-center">28 Jul 2026</td>
              <td className="text-center">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Download
                </button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Applications;