function EditProfile() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-8">

        <h1 className="text-3xl font-bold text-blue-600 mb-8">
          Edit Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              defaultValue="Ankesh Chadar"
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold">Mobile Number</label>
            <input
              type="text"
              defaultValue="+91 9876543210"
              disabled
              className="w-full mt-2 p-3 border rounded-xl bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              defaultValue="ankesh@example.com"
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold">City</label>
            <input
              type="text"
              defaultValue="Tikamgarh"
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

        </div>

        <div className="mt-8">
          <label className="font-semibold">Address</label>

          <textarea
            rows={4}
            defaultValue="Tikamgarh, Madhya Pradesh"
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default EditProfile;