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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Modal dialog box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-[#0F131C] border border-[#D4AF37]/35 shadow-2xl max-w-2xl w-full p-4 sm:p-6 md:p-8 z-10 rounded-2xl overflow-hidden text-[#F5E6BE] font-sans my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 text-[#DFC18A] hover:text-[#FFFFFF] transition-colors cursor-pointer rounded-lg hover:bg-[#161B26]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {title && (
              <h3 className="font-sans text-sm sm:text-base md:text-lg font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#D4AF37]/25 pb-3 mb-4 sm:mb-5 pr-8">
                {title}
              </h3>
            )}

            <div className="overflow-y-auto pr-1 sm:pr-2 flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
