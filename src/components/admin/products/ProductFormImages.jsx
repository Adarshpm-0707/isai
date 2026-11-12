import React from 'react';
import { Upload } from 'lucide-react';

export default function ProductFormImages({
  images,
  uploadingIndex,
  onImageChange,
  onFileUpload,
}) {
  return (
    <div className="sm:col-span-2 space-y-4 pt-4 border-t border-[#D4AF37]/25">
      <h4 className="font-sans text-sm font-bold text-[#FFFFFF] uppercase tracking-wider">
        Product Images (3 slots)
      </h4>

      <div className="space-y-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center bg-[#161B26]/40 p-3 sm:p-0 rounded-xl sm:bg-transparent border border-[#D4AF37]/20 sm:border-none"
          >
            <div className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider shrink-0 sm:w-20">
              Slot {index + 1}
            </div>

            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <label className="relative cursor-pointer bg-[#161B26] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#090B10] px-3.5 py-2 rounded-lg text-xs font-bold uppercase text-[#FFFFFF] flex items-center gap-1.5 shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingIndex === index ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileUpload(index, e.target.files?.[0])}
                  className="hidden"
                  disabled={uploadingIndex !== null}
                />
              </label>
              <input
                type="url"
                value={img}
                onChange={(e) => onImageChange(index, e.target.value)}
                className="w-full bg-[#161B26] border border-[#D4AF37]/35 rounded-lg px-3 py-2 text-xs text-[#FFFFFF] placeholder:text-[#A1A1AA]/60 focus:outline-none focus:border-[#D4AF37] min-w-0"
                placeholder="Or paste image URL (https://...)..."
              />
            </div>

            {img && (
              <div className="w-11 h-11 overflow-hidden rounded-lg bg-[#0A0D14] border border-[#D4AF37]/35 shrink-0 self-center sm:self-auto shadow-sm">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

