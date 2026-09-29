import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, X, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PrescriptionUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const inputRef = useRef(null);
  const { showToast } = useApp();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      showToast('Please upload a valid image or PDF file', 'error');
      return;
    }
    setFile(selectedFile);
    setUploadComplete(false);
    setProgress(0);
  };

  const removeFile = () => {
    setFile(null);
    setUploadComplete(false);
    setProgress(0);
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload/prescription', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      clearInterval(interval);
      setProgress(100);
      
      if (data.success) {
        setUploadComplete(true);
        onUploadSuccess(data.url);
        showToast('Prescription verified and attached!', 'success');
      } else {
        showToast(data.message || 'Upload failed', 'error');
        setFile(null);
        setProgress(0);
      }
    } catch (error) {
      clearInterval(interval);
      showToast('Network error during upload', 'error');
      setFile(null);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full my-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={16} className="text-slate-600" />
        <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Valid Prescription Required</h4>
      </div>
      <p className="text-xs text-slate-500 mb-3">You have pharmacy items in your cart. Please upload a doctor's prescription to proceed.</p>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center transition-all duration-300 ${
              dragActive ? 'border-primary-500 bg-primary-50 shadow-[0_0_20px_rgba(234,88,12,0.15)]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <motion.div
              animate={{ y: dragActive ? -5 : 0 }}
              className="bg-white p-3 rounded-full shadow-sm mb-3 text-primary-500"
            >
              <UploadCloud size={24} />
            </motion.div>
            <p className="text-sm font-medium text-slate-700">
              <span className="text-primary-600 cursor-pointer hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-50 text-primary-600 p-2 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              {!uploading && !uploadComplete && (
                <button onClick={removeFile} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Progress Bar Area */}
            {(uploading || uploadComplete) && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">{uploadComplete ? 'Upload Complete' : 'Uploading...'}</span>
                  <span className="text-primary-600 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                    className={`h-full rounded-full ${uploadComplete ? 'bg-emerald-500' : 'bg-primary-500'}`}
                  />
                </div>
              </div>
            )}

            {!uploading && !uploadComplete && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={uploadFile}
                className="mt-4 w-full bg-slate-900 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <UploadCloud size={16} />
                Upload Prescription
              </motion.button>
            )}
            
            {uploading && (
              <div className="mt-4 w-full bg-primary-50 text-primary-700 rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </div>
            )}
            
            {uploadComplete && (
              <div className="mt-4 w-full bg-emerald-50 text-emerald-700 rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                Attached to Order
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
