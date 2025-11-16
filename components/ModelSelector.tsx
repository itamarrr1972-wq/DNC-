
import React from 'react';
import type { Gender } from '../types';

interface ModelSelectorProps {
  selectedGender: Gender;
  onGenderChange: (gender: Gender) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedGender, onGenderChange }) => {
  return (
    <div className="flex space-x-4">
      {(['female', 'male'] as Gender[]).map((gender) => (
        <button
          key={gender}
          onClick={() => onGenderChange(gender)}
          className={`flex-1 capitalize text-center py-3 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500
            ${selectedGender === gender
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          {gender}
        </button>
      ))}
    </div>
  );
};
