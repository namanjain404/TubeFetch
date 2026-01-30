import { useState } from "react";

const Home = ({ darkMode }) => {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [progress, setProgress] = useState(0);

  // --- HELPER FUNCTIONS ---

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      alert("Clipboard access denied");
    }
  };

  const scrollToDownload = () => {
    const element = document.getElementById("download-section");
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle =
        absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;
      window.scrollTo({ top: middle, behavior: "smooth" });
    }
  };

  const handleDownloadAnother = () => {
    setVideoData(null);
    setUrl("");
    setFormat("mp4");
    setProgress(0);
  };

  // --- API CALLS ---

  const handleGetVideo = async () => {
    if (!url) return alert("Please enter a video URL");
    setLoading(true);
    try {
      const response = await fetch("https://tubefetch-6lvk.onrender.com/api/video-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setVideoData(data);
      // Auto-set the first available format quality
      if (data.formats && data.formats.length > 0) {
        setFormat(data.formats[0].formatId);
      }
    } catch (err) {
      alert("Error fetching video details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgress(0);

    // Progress listener using Server-Sent Events
    const eventSource = new EventSource(
      `http://localhost:8080/api/progress?url=${encodeURIComponent(url)}`,
    );

    eventSource.addEventListener("progress", (event) => {
      const val = parseFloat(event.data);
      setProgress(val);
      if (val >= 100) eventSource.close();
    });

    eventSource.onerror = () => eventSource.close();

    try {
      const response = await fetch("https://tubefetch-6lvk.onrender.com/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, title: videoData?.title }),
      });

      if (!response.ok) throw new Error("Download failed");

      // Handle Blob Download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const fileName = videoData?.title
        ? videoData.title.substring(0, 30)
        : "video";
      link.setAttribute("download", `${fileName}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert("Download failed.");
    } finally {
      setIsDownloading(false);
      eventSource.close();
    }
  };

  return (
    <section
      className={`relative w-full min-h-screen overflow-hidden transition-colors duration-500 ${darkMode ? "bg-[#050505]" : "bg-transparent"}`}
    >
      {/* FLOATING DOWNLOAD BUTTON */}
      <button
        onClick={scrollToDownload}
        className={`fixed z-50 flex items-center gap-3 p-2 pr-5 transition-all duration-500 bottom-8 left-6 group rounded-2xl border backdrop-blur-xl hover:-translate-y-2 active:scale-95 ${darkMode ? "bg-zinc-900/80 border-white/10 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]" : "bg-white/80 border-slate-200 shadow-xl hover:border-red-500 hover:shadow-[0_10px_30px_rgba(220,38,38,0.1)]"}`}
      >
        <div className="relative flex items-center justify-center w-10 h-10 bg-red-600 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <span className="absolute top-0 right-0 flex w-3 h-3 -mt-1 -mr-1">
            <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
          </span>
        </div>
        <span
          className={`text-[10px] font-black tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          Download Video
        </span>
      </button>

      {/* HERO SECTION BACKGROUND BLUR */}
      {darkMode && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
      )}
      <div className="pt-32 sm:pt-40 md:pt-48" />

      {/* HERO SECTION TITLE */}
      <div className="relative max-w-5xl px-4 mx-auto text-center">
        <h2
          className={`flex flex-col items-center justify-center gap-2 text-4xl font-black tracking-tight transition-colors sm:text-6xl md:text-7xl ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          <span>Modern Downloads.</span>
          <span className="flex items-center gap-4 pt-1 text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
            Simplified.
            <svg
              viewBox="0 0 576 580"
              className="w-10 h-10 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] sm:w-16 sm:h-16"
              fill="currentColor"
            >
              <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.6-48.6C456.4 64 288 64 288 64S119.6 64 74.9 75.5c-23.8 6.3-42.3 24.9-48.6 48.6C16 168.8 16 256 16 256s0 87.2 10.3 131.9c6.3 23.7 24.8 41.5 48.6 47.8C119.6 448 288 448 288 448s168.4 0 213.1-11.3c23.8-6.3 42.3-24.1 48.6-47.8C560 343.2 560 256 560 256s0-87.2-10.3-131.9z" />
              <path d="M232 336l142-80-142-80v160z" fill="#fff" />
            </svg>
          </span>
        </h2>
        <p
          className={`max-w-2xl mx-auto mt-6 text-base leading-relaxed transition-colors sm:text-lg ${darkMode ? "text-white/50" : "text-slate-500"}`}
        >
          Experience the fastest way to save content. High-fidelity conversion
          with no speed caps and zero tracking.
        </p>
      </div>

      {/* ADD TO CHROME BUTTON */}
      <div className="flex justify-center mt-12 mb-10">
        <button
          className={`relative inline-flex items-center justify-center gap-3 px-8 py-4 overflow-hidden font-bold transition-all border shadow-2xl group rounded-2xl ${darkMode ? "text-white bg-zinc-900 border-white/10 hover:border-red-500/50" : "text-slate-900 bg-white border-slate-200 hover:border-red-500 hover:text-white"}`}
        >
          <div className="absolute inset-0 w-0 transition-all duration-300 bg-red-600 group-hover:w-full" />
          <span className="relative z-10">Add to Chrome</span>
        </button>
      </div>

      {/* DOWNLOAD CARD SECTION */}
      <div
        id="download-section"
        className="px-4 mx-auto mt-4 sm:mt-12 lg:mt-16"
      >
        <div
          className={`mx-auto w-full max-w-4xl rounded-[3rem] border transition-all duration-500 px-6 sm:px-16 py-12 sm:py-20 text-center relative overflow-hidden group ${darkMode ? "bg-zinc-900/40 backdrop-blur-3xl border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)]" : "bg-white border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"}`}
        >
          {/* FETCHING PROGRESS BAR (Indeterminate) */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-1.5 overflow-hidden bg-red-600/10">
              <div
                className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)] animate-progress-slide"
                style={{ width: "40%" }}
              ></div>
            </div>
          )}

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

          {!videoData ? (
            /* --- INPUT STATE (ORIGINAL DESIGN) --- */
            <div className="animate-in fade-in duration-500">
              <div className="relative space-y-4">
                <h1
                  className={`text-4xl font-black tracking-tighter transition-colors sm:text-5xl md:text-5xl ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  Download <span className="text-red-600">YouTube</span> Video.
                </h1>
                <p
                  className={`max-w-xl mx-auto text-base font-medium transition-colors sm:text-lg ${darkMode ? "text-white/60" : "text-slate-500"}`}
                >
                  Paste a URL below to begin your high-speed conversion.
                </p>
              </div>

              <div className="relative max-w-2xl mx-auto mt-12">
                <div className="absolute transition duration-500 -inset-1 rounded-2xl blur opacity-20 group-focus-within:opacity-40 bg-gradient-to-r from-red-600 to-orange-600" />
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`w-full py-5 pr-16 text-base transition-all border-none outline-none px-7 rounded-2xl backdrop-blur-md focus:ring-2 focus:ring-red-500/50 ${darkMode ? "bg-black/40 text-white placeholder-white/20" : "bg-slate-100 text-slate-900 placeholder-slate-400"}`}
                  />
                  <button
                    onClick={handlePasteFromClipboard}
                    className={`absolute right-3 p-2.5 rounded-xl transition-all border ${darkMode ? "bg-white/5 border-white/10 text-white/50 hover:text-white" : "bg-white border-slate-200 text-slate-400 hover:text-slate-900"}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={handleGetVideo}
                disabled={loading}
                className="mt-8 px-12 py-4 text-md font-bold text-white transition-all bg-red-600 rounded-xl hover:bg-red-500 active:scale-95 disabled:opacity-50 shadow-lg shadow-red-600/20 flex items-center gap-3 mx-auto"
              >
                {loading && (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {loading ? "ANALYZING..." : "GET VIDEO"}
              </button>

              {/* STATS GRID (ORIGINAL DESIGN) */}
              <div
                className={`grid grid-cols-2 gap-8 pt-12 mt-16 border-t md:grid-cols-4 ${darkMode ? "border-white/5" : "border-slate-100"}`}
              >
                {[
                  { label: "No Limits", sub: "Unlimited Saves" },
                  { label: "Safe", sub: "Encrypted Cloud" },
                  { label: "Fast", sub: "10GB/s Backbone" },
                  { label: "4K HD", sub: "Original Quality" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p
                      className={`text-lg font-black transition-colors ${darkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {stat.label}
                    </p>
                    <p
                      className={`text-[10px] uppercase tracking-widest ${darkMode ? "text-white/30" : "text-slate-400"}`}
                    >
                      {stat.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* --- FETCHED STATE (NEW FUNCTIONALITY WITH REFINED UI) --- */
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <div className="relative mb-6 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl max-w-sm border border-white/10">
                  <img
                    src={videoData.thumbnail}
                    alt="Thumbnail"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold rounded border border-white/10">
                    {videoData.duration}
                  </div>
                </div>
              </div>

              <h2
                className={`text-2xl font-black mb-2 line-clamp-2 max-w-lg ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                {videoData.title}
              </h2>

              <div className="flex gap-2 mb-8">
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-tighter bg-red-600 text-white rounded-full">
                  {videoData.quality || "HD"}
                </span>
                <span
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full ${darkMode ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  READY
                </span>
              </div>

              <div className="flex flex-col w-full max-w-sm gap-4">
                {/* DYNAMIC FORMAT SELECTION */}
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={`w-full px-4 py-3 font-bold rounded-xl appearance-none outline-none ring-1 cursor-pointer ${darkMode ? "bg-white/5 text-white ring-white/10" : "bg-slate-100 text-slate-900 ring-slate-200"}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${darkMode ? "white" : "black"}' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
                  }}
                >
                  {videoData.formats?.map((f) => (
                    <option
                      key={f.formatId}
                      value={f.formatId}
                      className="text-black"
                    >
                      {f.quality} (.{f.ext})
                    </option>
                  ))}
                </select>

                {/* PROGRESS BAR DISPLAY */}
                {isDownloading && (
                  <div className="w-full mt-2">
                    <div className="flex justify-between mb-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-red-500" : "text-red-600"}`}
                      >
                        {progress < 100 ? "Downloading..." : "Finalizing..."}
                      </span>
                      <span
                        className={`text-[10px] font-black ${darkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div
                      className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full px-8 py-4 text-lg font-bold text-white transition-all bg-red-600 rounded-2xl hover:bg-red-500 active:scale-95 shadow-xl shadow-red-600/30 disabled:opacity-50"
                >
                  {isDownloading ? "DOWNLOADING..." : "DOWNLOAD NOW"}
                </button>

                <button
                  onClick={handleDownloadAnother}
                  className={`py-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  Download another video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pb-32" />
    </section>
  );
};

export default Home;
