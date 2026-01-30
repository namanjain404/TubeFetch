import { useState } from "react";

const FAQ = ({ darkMode }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is this service free to use?",
      answer:
        "Yes, our downloader is 100% free with no hidden subscriptions or speed caps. You can convert as many videos as you like without ever creating an account.",
    },
    {
      question: "What formats and qualities are supported?",
      answer:
        "We support high-fidelity MP4 (up to 4K resolution) and studio-grade MP3 (up to 320kbps). The available quality depends on the original source video.",
    },
    {
      question: "Do I need to install any software?",
      answer:
        "No installation is required. Everything happens in your browser. We also offer a Chrome Extension for even faster access, but the web tool is fully functional on its own.",
    },
    {
      question: "Is my data and download history safe?",
      answer:
        "Absolutely. We have a zero-tracking policy. We do not store your download history or collect any personal data. Your privacy is our priority.",
    },
    {
      question: "How long does the conversion process take?",
      answer:
        "Most conversions are completed in under 10 seconds thanks to our 10GB/s backbone servers. Larger 4K files may take slightly longer to process.",
    },
  ];

  return (
    <section
      className={`relative w-full py-24 overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-[#050505]" : "bg-slate-50"
      }`}
    >
      {/* Background Glow - Dynamic color */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] blur-[120px] rounded-full pointer-events-none transition-all duration-700 ${
          darkMode ? "bg-red-600/5" : "bg-red-200/20"
        }`}
      />

      <div className="relative max-w-4xl px-4 mx-auto">
        {/* SECTION HEADER */}
        <div className="mb-16 text-center">
          <h2
            className={`text-4xl font-black tracking-tighter transition-colors sm:text-6xl ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Frequently Asked <span className="text-red-600">Questions.</span>
          </h2>
          <p
            className={`mt-4 text-lg font-medium transition-colors ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            Everything you need to know about our high-speed downloader.
          </p>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`overflow-hidden transition-all duration-300 border group rounded-3xl ${
                darkMode
                  ? "bg-zinc-900/40 backdrop-blur-3xl border-white/5 hover:border-red-500/30 shadow-2xl shadow-black/20"
                  : "bg-white border-slate-200 hover:border-red-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full px-8 text-left transition-all py-7"
              >
                <span
                  className={`text-xl font-bold transition-colors ${
                    darkMode
                      ? "text-white group-hover:text-red-500"
                      : "text-slate-800 group-hover:text-red-600"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
                    openIndex === index
                      ? "rotate-180 bg-red-600 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                      : darkMode
                        ? "bg-white/5 border-white/10"
                        : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 transition-colors ${
                      openIndex === index
                        ? "text-white"
                        : darkMode
                          ? "text-white/40"
                          : "text-slate-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className={`px-8 pt-4 pb-8 text-lg font-medium leading-relaxed border-t transition-colors ${
                    darkMode
                      ? "text-white/50 border-white/5"
                      : "text-slate-500 border-slate-100"
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
