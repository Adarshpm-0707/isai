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
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal dialog box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-[#4A0000]/90 border border-[#F6D18A]/50 shadow-2xl max-w-lg w-full p-6 md:p-8 z-10 rounded-sm overflow-hidden text-[#F6D18A]"
          >
            {/* Header close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-[#F6D18A] hover:text-[#D8A55A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {title && (
              <h3 className="font-playfair text-xl font-bold text-[#F6D18A] uppercase tracking-wider border-b border-[#F6D18A]/30 pb-3 mb-5">
                {title}
              </h3>
            )}

            <div className="max-h-[70vh] overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
