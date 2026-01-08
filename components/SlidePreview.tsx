import React from 'react';
import { SlideResult } from '../types';
import { Mail, MapPin, Linkedin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface SlidePreviewProps {
  data: SlideResult;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({ data }) => {
  const { candidate_profile, slide_content } = data;

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full flex items-center justify-center p-4 bg-slate-100/50"
    >
        {/* Slide Container - Aspect Ratio 16/9 */}
        <div className="relative w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col">
            
            {/* Header Stripe */}
            <div className="h-2 w-full bg-indigo-600"></div>

            <div className="flex-1 p-8 md:p-12 grid grid-cols-12 gap-8">
                
                {/* Left Column (Sidebar) */}
                <div className="col-span-4 flex flex-col border-r border-slate-100 pr-8">
                    {/* Profile Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2">
                            {candidate_profile.full_name}
                        </h1>
                        <h2 className="text-lg font-medium text-indigo-600 mb-4">
                            {candidate_profile.target_title}
                        </h2>
                        
                        <div className="flex items-center text-slate-500 text-sm mb-6">
                            <MapPin className="w-4 h-4 mr-2" />
                            {candidate_profile.location}
                        </div>

                        {/* Contact */}
                        <div className="space-y-2 text-sm text-slate-600">
                            {candidate_profile.contact_info.email && (
                                <div className="flex items-center">
                                    <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                    <span className="truncate">{candidate_profile.contact_info.email}</span>
                                </div>
                            )}
                            {candidate_profile.contact_info.linkedin && (
                                <div className="flex items-center">
                                    <Linkedin className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                    <span className="truncate text-indigo-600 hover:underline cursor-pointer">
                                        LinkedIn Profile
                                    </span>
                                </div>
                            )}
                             {candidate_profile.contact_info.portfolio && (
                                <div className="flex items-center">
                                    <Globe className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                    <span className="truncate text-indigo-600 hover:underline cursor-pointer">
                                        Portfolio
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Core Competencies */}
                    <div className="mb-8 flex-1">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Competencies</h3>
                        <div className="flex flex-wrap gap-2">
                            {slide_content.core_competencies.map((skill, index) => (
                                <span key={index} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                     {/* Education */}
                     <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Education</h3>
                        <div className="space-y-3">
                            {slide_content.education_short.map((edu, index) => (
                                <div key={index}>
                                    <p className="text-sm font-semibold text-slate-800">{edu.degree}</p>
                                    <p className="text-xs text-slate-500">{edu.institution} • {edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Main Content) */}
                <div className="col-span-8 pl-2 flex flex-col">
                    
                    {/* Summary */}
                    <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-slate-700 text-sm leading-relaxed italic">
                            "{slide_content.professional_summary}"
                        </p>
                    </div>

                    {/* Experience */}
                    <div className="flex-1">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Professional Experience</h3>
                        
                        <div className="space-y-6">
                            {slide_content.experience_highlights.map((exp, index) => (
                                <div key={index} className="relative border-l-2 border-indigo-100 pl-4">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-md font-bold text-slate-800">{exp.role}</h4>
                                        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{exp.duration}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-indigo-600 mb-2">{exp.company}</p>
                                    <ul className="list-disc list-outside ml-4 space-y-1">
                                        {exp.bullet_points.map((bp, bpIndex) => (
                                            <li key={bpIndex} className="text-sm text-slate-600 leading-snug pl-1">
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
            
            {/* Footer Stripe */}
            <div className="h-1.5 w-full bg-slate-900"></div>
        </div>
    </motion.div>
  );
};