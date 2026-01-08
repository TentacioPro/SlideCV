import React, { useRef, useCallback } from "react";
import { SlideResult } from "../types";
import {
  Mail,
  MapPin,
  Linkedin,
  Globe,
  Download,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";

interface SlidePreviewProps {
  data: SlideResult;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({ data }) => {
  const { candidate_profile, slide_content } = data;
  const slideRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (slideRef.current) {
      try {
        const dataUrl = await toPng(slideRef.current, {
          cacheBust: true,
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = `${candidate_profile.full_name.replace(
          /\s+/g,
          "_"
        )}_Slide.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Download failed", err);
      }
    }
  }, [candidate_profile.full_name]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl mb-4 flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          <span>Download Slide</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full relative shadow-2xl rounded-xl bg-white flex flex-col min-h-[600px]" // Removed aspect-video and overflow-hidden, added min-h
        ref={slideRef}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 bg-slate-50/50 rounded-xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="relative w-full flex-1 flex flex-col z-10">
          {/* Header Stripe */}
          <div className="h-3 w-full bg-slate-800 relative overflow-hidden rounded-t-xl">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-slate-600 skew-x-12 transform translate-x-4"></div>
          </div>

          <div className="flex-1 p-6 md:p-8 grid grid-cols-12 gap-6">
            {/* Left Column (Sidebar) */}
            {/* ... (sidebar content remains similar, just ensuring it flexes) ... */}
            <div className="col-span-4 flex flex-col border-r border-slate-100 pr-6">
              {/* Profile Header */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-1">
                  {candidate_profile.full_name}
                </h1>
                <h2 className="text-sm font-medium text-slate-600 mb-3 tracking-wide uppercase">
                  {candidate_profile.target_title}
                </h2>

                <div className="flex items-center text-slate-500 text-xs mb-4">
                  <MapPin className="w-3 h-3 mr-1.5" />
                  {candidate_profile.location}
                </div>

                {/* Contact */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  {candidate_profile.contact_info.email && (
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1.5 text-slate-400" />
                      <span className="truncate">
                        {candidate_profile.contact_info.email}
                      </span>
                    </div>
                  )}
                  {candidate_profile.contact_info.linkedin && (
                    <div className="flex items-center">
                      <Linkedin className="w-3 h-3 mr-1.5 text-slate-400" />
                      <span className="truncate text-indigo-600 hover:underline cursor-pointer">
                        LinkedIn Profile
                      </span>
                    </div>
                  )}
                  {candidate_profile.contact_info.portfolio && (
                    <div className="flex items-center">
                      <Globe className="w-3 h-3 mr-1.5 text-slate-400" />
                      <span className="truncate text-indigo-600 hover:underline cursor-pointer">
                        Portfolio
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Core Competencies */}
              <div className="mb-5 flex-1">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Core Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {slide_content.core_competencies.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Education
                </h3>
                <div className="space-y-2">
                  {slide_content.education_short.map((edu, index) => (
                    <div key={index}>
                      <p className="text-xs font-semibold text-slate-800">
                        {edu.degree}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {edu.institution} • {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Main Content) */}
            <div className="col-span-8 pl-2 flex flex-col">
              {/* Summary */}
              <div className="mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-700 text-xs leading-relaxed italic">
                  "{slide_content.professional_summary}"
                </p>
              </div>

              {/* Experience */}
              <div className="flex-1 pb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Professional Experience
                </h3>

                <div className="space-y-4">
                  {slide_content.experience_highlights.map((exp, index) => (
                    <div
                      key={index}
                      className="relative border-l-2 border-slate-200 pl-3.5"
                    >
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 ring-2 ring-white"></div>
                      <div className="flex justify-between items-baseline mb-1 gap-2">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          {exp.role}
                        </h4>
                        <span className="flex-shrink-0 text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        {exp.company}
                      </p>
                      <ul className="list-disc list-outside ml-3 space-y-0.5">
                        {exp.bullet_points.map((bp, bpIndex) => (
                          <li
                            key={bpIndex}
                            className="text-xs text-slate-600 leading-snug pl-0.5"
                          >
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stripe & Watermark - Fixed at bottom */}
          <div className="h-8 w-full bg-slate-900 flex items-center justify-between px-6 rounded-b-xl mt-auto">
            <div className="text-[10px] text-slate-400 font-medium">
              Generated via SlideCv
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center">
                Crafted by Abishek, with AI
                <Sparkles className="w-3 h-3 text-yellow-500 ml-1 inline" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
