import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FileUpload } from "./components/FileUpload";
import { SlidePreview } from "./components/SlidePreview";
import { SlideHistory } from "./components/SlideHistory";
import { SlideModal } from "./components/SlideModal";
import { SlideResult } from "./types";
import {
  Loader2,
  Layout,
  MonitorPlay,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";
import Docs from "./components/Docs";

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SlideResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalData, setModalData] = useState<SlideResult | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze resume");
      }

      const data = await response.json();
      setResult(data);
      setHistoryRefresh((prev) => prev + 1); // Refresh history

      // Log success
      fetch("http://localhost:5000/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Client Analysis Success",
          details: { fileName: file.name },
        }),
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Input & Controls */}
        <div className="w-full lg:w-1/3 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-1">Upload Resume</h2>
            <p className="text-sm text-slate-500 mb-6">
              Import your resume to generate a professional slide.
            </p>

            <FileUpload file={file} setFile={setFile} disabled={loading} />

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`
                mt-6 w-full py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm transition-all duration-300 shadow-md hover:shadow-xl
                ${
                  !file || loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-slate-300"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing with Server...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Generate Slide with AI</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-indigo-900 font-semibold mb-2">How it works</h3>
            <ul className="text-sm text-indigo-800/80 space-y-2 list-disc list-inside">
              <li>Upload your resume (PDF/DOCX)</li>
              <li>Server extracts text safely</li>
              <li>Groq AI analyzes content</li>
              <li>Download your professional slide</li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="w-full lg:w-2/3">
          {result ? (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Slide Preview</h2>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Analysis Complete
                </span>
              </div>
              <div className="flex-1 min-h-[400px]">
                <SlidePreview data={result} />
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="text-center max-w-sm px-6">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  No slide generated yet
                </h3>
                <p className="text-slate-500">
                  Upload a resume and click "Generate Slide" to see the magic
                  happen.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="pt-8 border-t border-slate-200">
        <SlideHistory
          refreshTrigger={historyRefresh}
          onSelectSlide={(data) => setModalData(data)}
        />
      </div>

      {/* Modal */}
      <SlideModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        data={modalData}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-200">
                  <MonitorPlay className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
                  SlideCv
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/docs"
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-1" /> Docs
              </Link>
              <a
                href="https://github.com/TentacioPro"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <img
                    src="https://github.com/TentacioPro.png"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-slate-800">Abishek</span>
                  <span className="text-slate-400">@TentacioPro</span>
                </div>
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ResumeAnalyzer />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
