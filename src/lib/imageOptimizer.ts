/**
 * Client-Side Smart Image Optimizer for PromptLens AI
 *
 * Prepares user uploads (including high-resolution smartphone photos, RAW exports,
 * large PNGs, WebPs) for the Cloudflare Workers AI LLaVA vision model.
 *
 * Targets:
 * - Max dimension: ~1536px longest side (proportional aspect ratio preserved)
 * - File size target: <= 1.2MB
 * - Quality: 0.85 - 0.92 JPEG/WebP for optimal optic feature recognition
 */

export interface OptimizeOptions {
  maxDimension?: number;
  maxBytes?: number;
  initialQuality?: number;
  minQuality?: number;
  targetMimeType?: 'image/jpeg' | 'image/webp';
}

export interface OptimizationResult {
  file: File;
  originalSize: number;
  optimizedSize: number;
  originalDimensions: { width: number; height: number };
  optimizedDimensions: { width: number; height: number };
  wasResized: boolean;
  dataUrl: string;
}

const DEFAULT_MAX_DIMENSION = 1536;
const DEFAULT_MAX_BYTES = 1.2 * 1024 * 1024; // 1.2MB

/**
 * Loads an image from File or Blob into an HTMLImageElement safely.
 */
function loadImage(fileOrBlob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for visual analysis.'));
    };

    img.src = url;
  });
}

/**
 * Optimizes an image client-side via HTML5 Canvas before transmitting to Cloudflare Worker.
 */
export async function optimizeImageForAI(
  file: File | Blob,
  options: OptimizeOptions = {},
  onProgress?: (status: string) => void
): Promise<OptimizationResult> {
  const maxDim = options.maxDimension || DEFAULT_MAX_DIMENSION;
  const maxBytes = options.maxBytes || DEFAULT_MAX_BYTES;
  const initialQuality = options.initialQuality || 0.88;
  const minQuality = options.minQuality || 0.72;
  const targetMime = options.targetMimeType || 'image/jpeg';

  const originalSize = file.size;
  const originalName = file instanceof File ? file.name : 'upload.jpg';

  const img = await loadImage(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  // Determine if resizing is necessary
  let targetW = origW;
  let targetH = origH;
  let needsResize = false;

  if (origW > maxDim || origH > maxDim) {
    needsResize = true;
    if (origW >= origH) {
      targetW = maxDim;
      targetH = Math.round((origH * maxDim) / origW);
    } else {
      targetH = maxDim;
      targetW = Math.round((origW * maxDim) / origH);
    }
  }

  // If already under max size, reasonable dimensions, and in standard JPEG/WebP format, pass through
  const isAlreadySmall = originalSize <= maxBytes && !needsResize && (file.type === 'image/jpeg' || file.type === 'image/webp');
  if (isAlreadySmall && file instanceof File) {
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    return {
      file,
      originalSize,
      optimizedSize: originalSize,
      originalDimensions: { width: origW, height: origH },
      optimizedDimensions: { width: origW, height: origH },
      wasResized: false,
      dataUrl,
    };
  }

  onProgress?.('Optimizing image for AI analysis…');

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });

  if (!ctx) {
    throw new Error('Canvas 2D context unavailable on this device.');
  }

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // White background in case of transparent PNG/WebP converted to JPEG
  if (targetMime === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.drawImage(img, 0, 0, targetW, targetH);

  // Compress iteratively to find optimal quality <= maxBytes
  let currentQuality = initialQuality;
  let optimizedBlob: Blob | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    optimizedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), targetMime, currentQuality);
    });

    if (!optimizedBlob) break;

    if (optimizedBlob.size <= maxBytes || currentQuality <= minQuality) {
      break;
    }

    currentQuality = Math.max(minQuality, currentQuality - 0.1);
  }

  if (!optimizedBlob) {
    throw new Error('Failed to encode optimized image.');
  }

  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const ext = targetMime === 'image/webp' ? '.webp' : '.jpg';
  const optimizedFile = new File([optimizedBlob], `${baseName}_ai${ext}`, {
    type: targetMime,
    lastModified: Date.now(),
  });

  const dataUrl = canvas.toDataURL(targetMime, currentQuality);

  return {
    file: optimizedFile,
    originalSize,
    optimizedSize: optimizedBlob.size,
    originalDimensions: { width: origW, height: origH },
    optimizedDimensions: { width: targetW, height: targetH },
    wasResized: needsResize || optimizedBlob.size < originalSize,
    dataUrl,
  };
}
