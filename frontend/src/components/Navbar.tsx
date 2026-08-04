function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">🛡️</span>

          <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide">
            VERIXA
          </h1>
        </div>

        {/* Menu */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">

          <a href="#" className="hover:text-blue-600 transition">
            Home
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Services
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Track
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            About
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Contact
          </a>

        </nav>

        {/* Login Button */}

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:scale-105">
          Login
        </button>

      </div>
    </header>
  );
}

export default Navbar;