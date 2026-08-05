import { useState } from "react";

function ApplyService() {
  const [form, setForm] = useState({
    service: "",
    name: "",
    mobile: "",
    email: "",
    aadhaar: "",
    address: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    alert("Application Submitted Successfully");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Apply For Service
        </h1>

        <select
          name="service"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl mb-5"
        >
          <option>Select Service</option>
          <option>PAN Card</option>
          <option>Passport</option>
          <option>GST Registration</option>
          <option>Aadhaar Update</option>
        </select>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl mb-5"
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl mb-5"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl mb-5"
        />

        <input
          name="aadhaar"
          placeholder="Aadhaar Number"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl mb-5"
        />

        <textarea
          name="address"
          placeholder="Address"
          rows={4}
          onChange={handleChange}
          className="w-full border p-4 rounded-xl mb-6"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Submit Application
        </button>

      </div>

    </div>
  );
}

export default ApplyService;