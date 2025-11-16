import { GoogleGenAI, Modality } from "@google/genai";
import { generatePrompt } from '../constants';
import type { Gender, Base64Image } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
// FIX: Use gemini-2.5-flash-image for image editing tasks.
const model = 'gemini-2.5-flash-image'; 

export const generateStyledImage = async (
  baseModelImage: Base64Image,
  clothingImage: Base64Image,
  gender: Gender
): Promise<string> => {
  const prompt = generatePrompt(gender);

  try {
    // FIX: Corrected to use gemini-2.5-flash-image which supports image output.
    // This requires specifying responseModalities.
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          // Image 1: Model (Base to be edited)
          {
            inlineData: {
              data: baseModelImage.base64,
              mimeType: baseModelImage.mimeType,
            },
          },
          // Image 2: Clothing (Source for the edit)
          {
            inlineData: {
              data: clothingImage.base64,
              mimeType: clothingImage.mimeType,
            },
          },
          // Text prompt that instructs the model on how to combine the images
          {
            text: prompt,
          },
        ]
      },
      config: {
          responseModalities: [Modality.IMAGE], // Must be an array with a single `Modality.IMAGE` element.
      },
    });

    // Extract the image data from the response.
    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    } else {
      // Log the full response for debugging if no image is found
      console.error("API response did not contain image data:", JSON.stringify(response, null, 2));
      throw new Error("No image data found in the API response. The model may have returned text instead.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Propagate a more specific error if available
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to generate image. Details: ${message}`);
  }
};
