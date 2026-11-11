import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Lock scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Modal dialog box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-[#0F131C] border border-[#D4AF37]/35 shadow-2xl max-w-2xl w-full p-6 md:p-8 z-10 rounded-2xl overflow-hidden text-[#F5E6BE] font-sans"
          >
            {/* Header close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-[#DFC18A] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {title && (
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#D4AF37]/25 pb-3 mb-5">
                {title}
              </h3>
            )}

            <div className="max-h-[75vh] overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
