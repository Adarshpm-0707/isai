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
          <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-1/4 text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
              Slot {index + 1}
            </div>
            <label className="relative cursor-pointer bg-[#161B26] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#090B10] px-4 py-2 rounded-lg text-xs font-bold uppercase text-[#FFFFFF] flex items-center gap-1.5 flex-shrink-0 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              {uploadingIndex === index ? 'Uploading...' : 'Upload File'}
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
              className="w-full bg-[#161B26] border border-[#D4AF37]/35 rounded-lg px-4 py-2 text-xs text-[#FFFFFF] placeholder:text-[#A1A1AA]/60 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Or paste image URL (e.g. https://...)..."
            />
            {img && (
              <div className="w-10 h-10 overflow-hidden rounded bg-[#0A0D14] border border-[#D4AF37]/35 flex-shrink-0">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

