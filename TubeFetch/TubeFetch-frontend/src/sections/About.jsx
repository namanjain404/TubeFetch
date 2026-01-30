const About = ({ darkMode }) => {
  return (
    <section
      className={`relative w-full py-24 overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      {/* Background Decorative Glows - Adjusted for Light Mode */}
      <div
        className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none transition-opacity duration-500 ${
          darkMode ? "bg-red-600/10 opacity-100" : "bg-red-200/30 opacity-50"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none transition-opacity duration-500 ${
          darkMode
            ? "bg-orange-600/5 opacity-100"
            : "bg-orange-200/20 opacity-40"
        }`}
      />

      <div className="relative px-6 mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT: THE VISION */}
          <div className="space-y-8 text-left">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold tracking-widest uppercase border rounded-full transition-all ${
                darkMode
                  ? "text-red-500 bg-red-500/10 border-red-500/20"
                  : "text-red-600 bg-red-50 border-red-100"
              }`}
            >
              <span className="relative flex w-2 h-2">
                <span
                  className={`absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${darkMode ? "bg-red-400" : "bg-red-500"}`}
                ></span>
                <span className="relative inline-flex w-2 h-2 bg-red-500 rounded-full"></span>
              </span>
              Our Mission
            </div>

            <h2
              className={`text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl leading-[1.1] transition-colors ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Built for the <br />
              <span className="text-transparent bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text">
                Modern Web.
              </span>
            </h2>

            <p
              className={`max-w-xl text-lg font-medium leading-relaxed transition-colors ${
                darkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              TubeFetch was born out of a simple frustration: downloading
              content shouldn't be a battle against pop-ads, tracking scripts,
              and speed throttles.
            </p>

            <p
              className={`max-w-xl text-lg font-medium leading-relaxed transition-colors ${
                darkMode ? "text-white/40" : "text-slate-500"
              }`}
            >
              We've engineered a high-speed backbone that prioritizes your
              privacy while delivering studio-quality media conversion. No
              accounts, no logs, just pure performance.
            </p>

            {/* STATS SECTION */}
            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { val: "99.9%", label: "Uptime" },
                { val: "0s", label: "Wait Time" },
                { val: "∞", label: "Privacy" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span
                      className={`text-3xl font-black transition-colors ${darkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {stat.val}
                    </span>
                    <span
                      className={`text-xs uppercase tracking-[0.2em] transition-colors ${darkMode ? "text-white/30" : "text-slate-400"}`}
                    >
                      {stat.label}
                    </span>
                  </div>
                  {i !== 2 && (
                    <div
                      className={`w-px h-12 transition-colors ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT: THE "GLASS" FEATURE CARD */}
          <div className="relative group">
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[3rem] blur transition duration-1000 ${
                darkMode
                  ? "opacity-20 group-hover:opacity-40"
                  : "opacity-10 group-hover:opacity-20"
              }`}
            ></div>

            <div
              className={`relative rounded-[3rem] p-8 sm:p-12 transition-all duration-500 border ${
                darkMode
                  ? "bg-zinc-900/40 backdrop-blur-3xl border-white/5 shadow-2xl shadow-black"
                  : "bg-white border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div className="space-y-6">
                {[
                  {
                    title: "No Speed Caps",
                    desc: "Download at the full speed of your internet connection.",
                    icon: "⚡",
                  },
                  {
                    title: "Privacy First",
                    desc: "We don't track your URLs or store your personal metadata.",
                    icon: "🛡️",
                  },
                  {
                    title: "Native Quality",
                    desc: "Get exactly what you see: 4K video and 320kbps audio.",
                    icon: "💎",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6 group/item">
                    <div
                      className={`flex items-center justify-center flex-shrink-0 text-2xl transition-all duration-300 border w-14 h-14 rounded-2xl ${
                        darkMode
                          ? "bg-white/5 border-white/10 group-hover/item:bg-red-600/20 group-hover/item:border-red-500/50"
                          : "bg-slate-50 border-slate-200 group-hover/item:bg-red-50 group-hover/item:border-red-200"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h4
                        className={`text-xl font-black transition-colors ${darkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {feature.title}
                      </h4>
                      <p
                        className={`text-sm font-medium transition-colors ${darkMode ? "text-white/50" : "text-slate-500"}`}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
