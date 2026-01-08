import React, { useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, setFile, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        disabled={disabled}
      />
      
      {!file ? (
        <motion.div
          whileHover={!disabled ? { scale: 1.01, borderColor: '#4F46E5' } : {}}
          whileTap={!disabled ? { scale: 0.99 } : {}}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50' : 'border-slate-300 hover:bg-slate-50 bg-white'}
          `}
        >
          <div className="bg-slate-100 p-3 rounded-full mb-4">
            <UploadCloud className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-700">Click to upload resume</p>
          <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or TXT (Max 5MB)</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={clearFile}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};