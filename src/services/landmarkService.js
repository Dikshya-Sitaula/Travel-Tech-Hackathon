export const landmarkService = {
  identifyLandmark: async (imageFile) => {
    if (!imageFile?.type?.startsWith('image/')) throw new Error('Please select a valid image.');
    if (imageFile.size > 8 * 1024 * 1024) throw new Error('Use an image smaller than 8 MB.');
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Unable to read the selected image.'));
      reader.readAsDataURL(imageFile);
    });
    const imageData = String(dataUrl).split(',')[1];
    const response = await fetch(serverApiUrl('/api/landmark'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData, mimeType: imageFile.type }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Gemini landmark analysis is unavailable.');
    return payload;
  }
};

import { serverApiUrl } from './serverUrl';
