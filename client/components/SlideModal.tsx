import React from "react";
import { SlideResult } from "../types";
import { SlidePreview } from "./SlidePreview";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SlideResult | null;
}

export const SlideModal: React.FC<SlideModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white z-10">
            <h3 className="text-lg font-bold text-slate-800">Slide Preview</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <SlidePreview data={data} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
