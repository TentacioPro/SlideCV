import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SlidePreview } from './components/SlidePreview';
import { analyzeResume } from './services/mockService';
import { SlideResult } from './types';
import { Loader2, Layout, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SlideResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call
      const data = await analyzeResume(file);
      setResult(data);
    } catch (err) {
      setError("An unexpected error occurred while analyzing the resume.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">ResumeToSlide</span>
          </div>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            Documentation
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 lg:p-8 gap-8">
        
        {/* Left Panel: Input & Controls */}
        <div className="w-full lg:w-1/3 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-1">Upload Resume</h2>
            <p className="text-sm text-slate-500 mb-6">Import your resume to generate a professional slide.</p>
            
            <FileUpload 
              file={file} 
              setFile={setFile} 
              disabled={loading} 
            />

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`
                mt-6 w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-semibold text-sm transition-all duration-200
                ${!file || loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg shadow-indigo-200'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Slide</span>
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
              <li>AI extracts key skills and experience</li>
              <li>Content is formatted for presentation</li>
              <li>Download or screenshot the result</li>
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
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">No slide generated yet</h3>
                  <p className="text-slate-500">Upload a resume and click "Generate Slide" to see the magic happen.</p>
                </div>
             </div>
           )}
        </div>

      </main>
    </div>
  );
};

export default App;