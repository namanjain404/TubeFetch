const HowItWorks = ({ darkMode }) => {
  const steps = [
    {
      step: "Step 1",
      title: "Paste Video URL",
      desc: "Copy the YouTube video link you want to download and paste it into the field. Use our smart clipboard sync for one-tap entry.",
    },
    {
      step: "Step 2",
      title: "Choose Format",
      desc: "Select between high-definition MP4 or studio-quality MP3. We support the highest bitrates available for your content.",
    },
    {
      step: "Step 3",
      title: "Download Instantly",
      desc: "Click convert and watch the magic happen. No queues, no speed caps, and absolutely no registration required.",
    },
  ];

  return (
    <section
      className={`relative w-full overflow-hidden py-24 transition-colors duration-500 ${
        darkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      {/* Background Decorative Glow - Dynamic colors */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] blur-[120px] rounded-full pointer-events-none transition-all duration-700 ${
          darkMode ? "bg-red-600/5" : "bg-red-100/30"
        }`}
      />

      <div className="relative max-w-6xl px-4 mx-auto">
        {/* SECTION HEADER */}
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h2
            className={`text-4xl font-black tracking-tighter transition-colors sm:text-6xl ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            How it <span className="text-red-600">Works.</span>
          </h2>
          <p
            className={`mt-6 text-lg font-medium transition-colors ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            Simplifying the way you save media. Our streamlined three-step
            process ensures you get your files in seconds, not minutes.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div
              key={index}
              className={`group relative rounded-[2.5rem] border p-10 transition-all duration-500 hover:-translate-y-2 ${
                darkMode
                  ? "bg-zinc-900/40 backdrop-blur-3xl border-white/5 hover:border-red-500/30 shadow-2xl shadow-black/20"
                  : "bg-slate-50 border-slate-200 hover:border-red-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
              }`}
            >
              {/* Step Number Background (Ghost Text) */}
              <div
                className={`absolute top-8 right-10 text-5xl font-black transition-colors duration-500 ${
                  darkMode
                    ? "text-white/[0.05] group-hover:text-red-600/10"
                    : "text-slate-200 group-hover:text-red-600/10"
                }`}
              >
                {item.step}
              </div>

              {/* Icon / Indicator */}
              <div
                className={`flex items-center justify-center w-16 h-14 mb-8 rounded-2xl font-black transition-all duration-500 ${
                  darkMode
                    ? "bg-red-600/10 border border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.1)] group-hover:bg-red-600 group-hover:text-white"
                    : "bg-white border border-slate-200 text-red-600 shadow-sm group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600"
                }`}
              >
                {index + 1}
              </div>

              <h3
                className={`mb-4 text-2xl font-black tracking-tight transition-colors ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {item.title}
              </h3>

              <p
                className={`text-base font-medium leading-relaxed transition-colors ${
                  darkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                {item.desc}
              </p>

              {/* Bottom Glow on Hover */}
              <div className="absolute bottom-0 w-1/2 h-1 transition-opacity duration-500 -translate-x-1/2 bg-red-600 opacity-0 left-1/2 blur-xl group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
