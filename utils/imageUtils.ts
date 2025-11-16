
import type { Base64Image } from '../types';

/**
 * Converts a File object to a base64 encoded string and its mime type.
 * @param file The file to convert.
 * @returns A promise that resolves with an object containing the base64 string and mime type.
 */
export const fileToBase64 = (file: File): Promise<Base64Image> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
      if (!base64) {
        reject(new Error("Could not parse base64 string from file."));
        return;
      }
      resolve({ base64, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};
