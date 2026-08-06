import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function AddService() {
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = async () => {
  try {
    await addDoc(collection(db, "services"), {
      serviceName,
      category,
      price: Number(price),
      active: true,
      createdAt: new Date(),
    });

    alert("Service Saved Successfully");

    setServiceName("");
    setCategory("");
    setPrice("");
  } catch (error) {
    console.error(error);
    alert("Failed to save service.");
  }
};

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">

      <h2 className="text-3xl font-bold mb-8">
        Add New Service
      </h2>

      <input
        placeholder="Service Name"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        className="w-full border rounded-xl p-4 mb-5"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded-xl p-4 mb-5"
      >
        <option value="">Select Category</option>
        <option>Identity</option>
        <option>Business</option>
        <option>Government</option>
        <option>Banking</option>
      </select>

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border rounded-xl p-4 mb-5"
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Save Service
      </button>

    </div>
  );
}

export default AddService;