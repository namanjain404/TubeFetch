const Contact = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: "Email",
      href: "mailto:worknaman404@gmail.com",
      icon: (
        <>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="m22 6-10 7L2 6" />
        </>
      ),
      color: "group-hover:text-red-500",
    },
    {
      label: "Github",
      href: "https://github.com/namanjain404",
      icon: (
        <>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </>
      ),
      color: darkMode ? "group-hover:text-white" : "group-hover:text-black",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/yourprofile",
      icon: (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </>
      ),
      color: "group-hover:text-blue-500",
    },
    {
      label: "Portfolio",
      href: "https://namanjain404.netlify.app/",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </>
      ),
      color: "group-hover:text-orange-500", //
    },
  ];

  return (
    <footer
      className={`relative w-full pt-20 pb-12 overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-[#050505]" : "bg-slate-50"
      }`}
    >
      {/* Background Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[200px] blur-[100px] rounded-full pointer-events-none transition-all duration-700 ${
          darkMode ? "bg-red-600/5" : "bg-red-200/20"
        }`}
      />

      <div className="relative max-w-4xl px-6 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2
            className={`mb-2 text-3xl font-black tracking-tighter transition-colors ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Let's <span className="text-red-600">Connect.</span>
          </h2>
          <p
            className={`mb-10 text-sm font-medium uppercase tracking-[0.3em] transition-colors ${
              darkMode ? "text-white/30" : "text-slate-400"
            }`}
          >
            Available for new projects
          </p>

          {/* CUTESY ICON ROW */}
          <div className="flex justify-center gap-6 mb-16">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-500 hover:-translate-y-2 ${
                  darkMode
                    ? "bg-zinc-900/50 backdrop-blur-md border-white/5 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]"
                    : "bg-white border-slate-200 shadow-sm hover:border-red-500/50 hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-6 h-6 transition-all duration-300 ${
                    darkMode ? "text-white/40" : "text-slate-400"
                  } ${link.color}`}
                >
                  {link.icon}
                </svg>
              </a>
            ))}
          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-12 h-px transition-colors ${
                darkMode
                  ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  : "bg-slate-200"
              }`}
            />
            <p
              className={`text-[10px] font-bold tracking-[0.4em] uppercase transition-colors ${
                darkMode ? "text-white/20" : "text-slate-400"
              }`}
            >
              © {currentYear} — Handcrafted by{" "}
              <span
                className={`transition-colors cursor-pointer ${
                  darkMode
                    ? "text-white/40 hover:text-red-600"
                    : "text-slate-600 hover:text-red-600"
                }`}
              >
                Naman Jain
              </span>
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`mt-4 text-[10px] font-black tracking-widest transition-colors uppercase ${
                darkMode
                  ? "text-white/10 hover:text-red-600"
                  : "text-slate-300 hover:text-red-600"
              }`}
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
