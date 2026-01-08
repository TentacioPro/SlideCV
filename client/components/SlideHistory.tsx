import React, { useEffect, useState } from "react";
import { Clock, FileText, ChevronRight } from "lucide-react";
import { SlideResult } from "../types";

export interface SlideRecord {
  id: string;
  timestamp: string;
  fileName: string;
  data: SlideResult;
}

interface SlideHistoryProps {
  onSelectSlide: (slide: SlideResult) => void;
  refreshTrigger: number; // Increment to reload
}

export const SlideHistory: React.FC<SlideHistoryProps> = ({
  onSelectSlide,
  refreshTrigger,
}) => {
  const [slides, setSlides] = useState<SlideRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, [refreshTrigger]);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/slides");
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && slides.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm">
        Loading history...
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-5 h-5 text-slate-300" />
        </div>
        <p className="text-slate-500 text-sm">No saved slides yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-indigo-500" />
        Recent Generations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => onSelectSlide(slide.data)}
            className="group bg-white p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
                  {slide.fileName}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(slide.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </div>
        ))}
      </div>
    </div>
  );
};
