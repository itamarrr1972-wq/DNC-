
export type Gender = 'male' | 'female';
export type AppState = 'idle' | 'loading' | 'success' | 'error';

export interface Base64Image {
  base64: string;
  mimeType: string;
}
