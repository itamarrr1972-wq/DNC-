
import React from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Clothing preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
          ) : (
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="flex text-sm text-gray-500 justify-center">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500">
              <span>{previewUrl ? 'Change image' : 'Upload a file'}</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
            </label>
            {!previewUrl && <p className="pl-1">or drag and drop</p>}
          </div>
          <p className="text-xs text-gray-600">PNG, JPG, WEBP up to 10MB</p>
        </div>
      </div>
    </div>
  );
};
