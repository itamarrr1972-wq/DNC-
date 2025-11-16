
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
          <span className="text-indigo-400">AI</span> Fashion Stylist
        </h1>
        <p className="text-sm text-gray-400">Virtual Try-On with Generative AI</p>
      </div>
    </header>
  );
};
