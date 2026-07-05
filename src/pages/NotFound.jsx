import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/reusable/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <h1 className="font-playfair text-8xl md:text-9xl font-bold text-maroon/20 tracking-wider">
        404
      </h1>
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-maroon uppercase tracking-widest">
          Lost in Weaves
        </h2>
        <p className="text-sm text-gray-500 font-sans max-w-xs mx-auto">
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
