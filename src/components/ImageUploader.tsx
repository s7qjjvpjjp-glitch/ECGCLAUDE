import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  selectedImage: File | null;
}

export function ImageUploader({ onImageSelected, selectedImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecione um arquivo de imagem válido.");
    }
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearImage = useCallback(() => {
    onImageSelected(null);
    setPreviewUrl(null);
  }, [onImageSelected]);

  if (selectedImage && previewUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50"
      >
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={clearImage}
            className="p-1.5 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full shadow-sm transition-colors"
            title="Remover imagem"
          >
            <X size={18} />
          </button>
        </div>
        <div className="aspect-video w-full flex items-center justify-center bg-slate-100 p-2">
          <img
            src={previewUrl}
            alt="Preview do ECG"
            className="max-w-full max-h-full object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 text-sm text-slate-600">
          <FileImage size={16} className="text-rose-500" />
          <span className="truncate font-medium">{selectedImage.name}</span>
          <span className="text-slate-400 text-xs ml-auto">
            {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full border-2 border-dashed rounded-2xl transition-all duration-200 ease-in-out ${
        isDragging
          ? 'border-rose-500 bg-rose-50/50'
          : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/50'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        title="Clique ou arraste uma imagem de ECG"
      />
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center pointer-events-none">
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-400 shadow-sm'}`}>
          <UploadCloud size={32} />
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">
          Clique ou arraste a imagem do ECG
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Suporta eletrocardiogramas em formatos de imagem comuns (JPG, PNG, etc.)
        </p>
      </div>
    </div>
  );
}
