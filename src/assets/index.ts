// Asset paths - use public URLs for images
export const IMAGES = {
  profile: '/Favicon.png',
} as const;

// Asset utilities
export const getImagePath = (imageName: keyof typeof IMAGES) => {
  return IMAGES[imageName];
};

export default {
  IMAGES,
  getImagePath,
};