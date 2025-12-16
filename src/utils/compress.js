import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  
  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Erreur compression image:', error);
    return file;
  }
};