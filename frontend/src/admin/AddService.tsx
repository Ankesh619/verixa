import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const documentList = [
  "Aadhaar Front",
  "Aadhaar Back",
  "PAN Card",
  "Passport Photo",
  "Signature",
  "Bank Passbook",
  "Electricity Bill",
  "10th Marksheet",
  "Income Certificate",
  "Caste Certificate",
  "Domicile Certificate",
  "Birth Certificate",
];

function AddService() {
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);

  const toggleDocument = (doc: string) => {
    if (requiredDocuments.includes(doc)) {
      setRequiredDocuments(
        requiredDocuments.filter((item) => item !== doc)
      );
    } else {
      setRequiredDocuments([...requiredDocuments, doc]);
    }
  };

  const handleSave = async () => {
    if (!serviceName || !category || !price) {
      alert("Please fill all fields.");
      return;
    }

    if (requiredDocuments.length === 0) {
      alert("Please select at least one required document.");
      return;
    }

    try {
      await addDoc(collection(db, "services"), {
        serviceName,
        category,
        price: Number(price),
        requiredDocuments,
        active: true,
        createdAt: new Date(),
      });

      alert("Service Saved Successfully");

      setServiceName("");
      setCategory("");
      setPrice("");
      setRequiredDocuments([]);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
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
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border rounded-xl p-4 mb-8"
      />

      <h3 className="text-2xl font-bold mb-4">
        Required Documents
      </h3>

      <div className="grid md:grid-cols-2 gap-3 mb-8">

        {documentList.map((doc) => (
          <label
            key={doc}
            className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={requiredDocuments.includes(doc)}
              onChange={() => toggleDocument(doc)}
            />

            <span>{doc}</span>
          </label>
        ))}

      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
      >
        Save Service
      </button>

    </div>
  );
}

export default AddService;