const Navbar = ({ darkMode, toggleTheme }) => {
  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2">
      <div
        className={`
          relative flex items-center justify-between
          rounded-full backdrop-blur-2xl
          border px-8 py-3 transition-all duration-500
          ${
            darkMode
              ? "bg-black/20 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]" // YOUR ORIGINAL DARK THEME
              : "bg-white/70 border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.1)]" // NEW LIGHT THEME
          }
        `}
      >
        {/* LEFT LINKS */}
        <div
          className={`flex items-center gap-8 text-sm font-medium tracking-tight ${darkMode ? "text-white/70" : "text-slate-600"}`}
        >
          <a
            href="#about"
            className="transition-colors duration-200 hover:text-red-500"
          >
            About
          </a>
          <a
            href="#howItWorks"
            className="transition-colors duration-200 hover:text-red-500"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="transition-colors duration-200 hover:text-red-500"
          >
            FAQ
          </a>
        </div>

        {/* CENTER LOGO */}
        <div className="absolute -translate-x-1/2 left-1/2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1 text-2xl italic font-black tracking-tighter uppercase transition-all cursor-pointer active:scale-90 sm:text-3xl group"
          >
            <span
              className={`transition-all bg-gradient-to-r bg-clip-text text-transparent ${
                darkMode
                  ? "from-white via-white to-white/60"
                  : "from-slate-900 to-slate-500"
              }`}
            >
              Tube
            </span>
            <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Fetch
            </span>
          </button>
        </div>

        {/* RIGHT LINKS */}
        <div
          className={`flex items-center gap-8 text-sm font-medium tracking-tight ${darkMode ? "text-white/70" : "text-slate-600"}`}
        >
          <div className="items-center hidden gap-8 md:flex">
            <a href="#terms" className="hover:text-red-500">
              Terms
            </a>
            <a href="#contact" className="hover:text-red-500">
              Contact
            </a>
          </div>

          {/* THE TOGGLE BUTTON */}
          <button
            onClick={toggleTheme} // <--- THIS NOW CALLS THE FUNCTION IN APP.JSX
            className={`
              flex items-center justify-center w-10 h-10 text-lg transition-all duration-300 border rounded-full 
              hover:scale-110 active:scale-95
              ${
                darkMode
                  ? "bg-white/5 border-white/10 text-white hover:bg-red-600/20"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-red-50"
              }
            `}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;