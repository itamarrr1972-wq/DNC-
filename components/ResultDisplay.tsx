
import React from 'react';
import { LoadingIndicator } from './LoadingIndicator';
import type { AppState, Base64Image } from '../types';

interface ResultDisplayProps {
  appState: AppState;
  generatedImage: string | null;
  errorMessage: string | null;
  baseModelImage: Base64Image;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ appState, generatedImage, errorMessage, baseModelImage }) => {
  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingIndicator />;
      case 'success':
        return <img src={generatedImage!} alt="Generated fashion model" className="w-full h-full object-contain rounded-lg" />;
      case 'error':
        return (
          <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
            <p className="text-sm">{errorMessage}</p>
          </div>
        );
      case 'idle':
      default:
        const baseModelImageUrl = `data:${baseModelImage.mimeType};base64,${baseModelImage.base64}`;
        return (
          <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
            <p className="mb-4">The generated image will appear here.</p>
            <img src={baseModelImageUrl} alt="Base model" className="max-h-[60vh] opacity-30 rounded-lg" />
          </div>
        );
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-black/20 rounded-lg p-4 min-h-[40vh] relative">
      {renderContent()}
    </div>
  );
};
