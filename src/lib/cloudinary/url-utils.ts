// Helper to get optimized URL
export function getOptimizedUrl(
  url: string,
  width: number,
  height: number,
  options?: { crop?: string; quality?: string }
): string {
  if (!url || !url.includes('cloudinary')) {
    return url;
  }

  const crop = options?.crop || 'fill';
  const quality = options?.quality || 'auto';

  return url.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_${crop},q_${quality},f_auto/`
  );
}

// Predefined image sizes for properties
export const imageSizes = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 400, height: 300 },
  detail: { width: 800, height: 600 },
  full: { width: 1200, height: 800 },
};
