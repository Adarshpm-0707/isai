import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/reusable/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6 text-[#D8A55A]">
      <h1 className="font-playfair text-8xl md:text-9xl font-bold text-[#F6D18A]/20 tracking-wider">
        404
      </h1>
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#F6D18A] uppercase tracking-widest">
          Lost in Weaves
        </h2>
        <p className="text-sm text-[#D8A55A]/80 font-sans max-w-xs mx-auto">
          The heritage pattern or page you seek has either moved or doesn't exist.
        </p>
      </div>
      <div className="pt-4">
        <Button variant="primary" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
