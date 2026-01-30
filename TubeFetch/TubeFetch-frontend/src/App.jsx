import { useState } from "react";
import Navbar from "./components/Navbar";
import FAQ from "./sections/FAQ";
import HowItWorks from "./sections/HowItWorks";
import Contact from "./sections/Contact";
import Home from "./sections/Home";
import About from "./sections/About";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div
      className={`relative transition-colors duration-500 min-h-screen ${
        darkMode
          ? "text-white bg-gradient-to-br from-red-900 via-black to-red-800" // YOUR ORIGINAL DARK THEME
          : "text-slate-900 bg-slate-50" // NEW LIGHT THEME
      }`}
    >
      {/* GLOW DECORATIONS (Only visible in Dark Mode) */}
      {darkMode && (
        <>
          <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-600/40 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/3 h-[600px] w-[600px] rounded-full bg-rose-500/30 blur-[140px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-red-700/30 blur-[120px]" />
        </>
      )}

      {/* 1. Added darkMode and toggleTheme props to Navbar */}
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* 2. Added darkMode prop to all sections so they can change their cards */}
      <section id="home">
        <Home darkMode={darkMode} />
      </section>

      <section id="about">
        <About darkMode={darkMode} />
      </section>

      <section id="howItWorks">
        <HowItWorks darkMode={darkMode} />
      </section>

      <section id="faq">
        <FAQ darkMode={darkMode} />
      </section>

      <section id="contact">
        <Contact darkMode={darkMode} />
      </section>
    </div>
  );
};

export default App;
