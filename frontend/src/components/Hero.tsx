function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Left Side */}
        <div>
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            🚀 AI Powered Government Services
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
            Digital Services
            <span className="text-blue-600"> Made Easy</span>
          </h1>

          <p className="text-gray-600 mt-6 text-lg leading-8">
            Apply for PAN Card, Aadhaar, Passport, GST, Scholarships and
            hundreds of government services from one secure platform.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition">
              🚀 Get Started
            </button>

            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition">
              🤖 Talk to AI
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
            alt="Digital Services"
            className="rounded-3xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;