import { Search as SearchIcon } from "lucide-react";

function Search() {
  return (
    <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 flex items-center">

        <SearchIcon className="text-gray-400 ml-2" size={22} />

        <input
          type="text"
          placeholder="Search any service (PAN Card, Aadhaar, Passport...)"
          className="flex-1 px-4 py-3 outline-none text-lg"
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">
          Search
        </button>

      </div>
    </section>
  );
}

export default Search;