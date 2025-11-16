
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ModelSelector } from './components/ModelSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { BASE_MODEL_IMAGE_FEMALE, BASE_MODEL_IMAGE_MALE } from './constants';
import type { Gender, AppState, Base64Image } from './types';

export default function App() {
  const [clothingImageFile, setClothingImageFile] = useState<File | null>(null);
  const [clothingImagePreview, setClothingImagePreview] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender>('female');
  const [appState, setAppState] = useState<AppState>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const baseModelImage = useMemo(() => {
    return selectedGender === 'female' ? BASE_MODEL_IMAGE_FEMALE : BASE_MODEL_IMAGE_MALE;
  }, [selectedGender]);

  const handleImageUpload = (file: File) => {
    setClothingImageFile(file);
    setClothingImagePreview(URL.createObjectURL(file));
    // Reset state if a new image is uploaded
    if (appState !== 'idle') {
      handleReset();
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!clothingImageFile) {
      setErrorMessage('Please upload a clothing image first.');
      return;
    }

    setAppState('loading');
    setErrorMessage(null);
    setGeneratedImage(null);

    try {
      const clothingImage = await fileToBase64(clothingImageFile);
      
      const resultImageBase64 = await generateStyledImage(
        baseModelImage,
        clothingImage,
        selectedGender
      );

      if (!resultImageBase64) {
        throw new Error("The API returned an empty response. This might be due to a safety policy violation or an internal error.");
      }

      setGeneratedImage(`data:image/jpeg;base64,${resultImageBase64}`);
      setAppState('success');
    } catch (error) {
      console.error('Error during image generation:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(`Generation failed. Details: ${message}`);
      setAppState('error');
    }
  }, [clothingImageFile, selectedGender, baseModelImage]);

  const handleReset = () => {
    setClothingImageFile(null);
    setClothingImagePreview(null);
    setGeneratedImage(null);
    setErrorMessage(null);
    setAppState('idle');
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const isGenerateDisabled = appState === 'loading' || !clothingImageFile;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6 bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div>
              <h2 className="text-xl font-bold text-indigo-400 mb-2">Step 1: Upload Outfit</h2>
              <p className="text-gray-400 mb-4 text-sm">Select an image of a complete outfit for a precise transfer.</p>
              <ImageUploader onImageUpload={handleImageUpload} previewUrl={clothingImagePreview} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-400 mb-2">Step 2: Select Model</h2>
              <p className="text-gray-400 mb-4 text-sm">Choose the target model's gender.</p>
              <ModelSelector selectedGender={selectedGender} onGenderChange={setSelectedGender} />
            </div>
          </div>

          {/* Right Column: Display */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg min-h-[50vh] flex flex-col">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">Result</h2>
            <ResultDisplay appState={appState} generatedImage={generatedImage} errorMessage={errorMessage} baseModelImage={baseModelImage}/>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 left-0 right-0 py-4 mt-8 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
          <div className="container mx-auto flex justify-center items-center gap-4 flex-wrap">
            {(appState === 'idle' || appState === 'loading') && (
              <button
                onClick={handleGenerateClick}
                disabled={isGenerateDisabled}
                className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 ease-in-out w-full max-w-xs
                ${isGenerateDisabled
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transform hover:scale-105'
                }`}
              >
                {appState === 'loading' ? 'Generating...' : 'Generate Image'}
              </button>
            )}

            {(appState === 'success' || appState === 'error') && (
              <button
                onClick={handleReset}
                className="px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 ease-in-out bg-gray-700 hover:bg-gray-600 text-white"
              >
                Create Another Image
              </button>
            )}

            {appState === 'success' && generatedImage && (
              <a
                href={generatedImage}
                download="ai_fashion_stylist_result.jpeg"
                className="px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 ease-in-out bg-green-600 hover:bg-green-500 text-white shadow-lg"
              >
                Download Image
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
