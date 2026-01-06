// Image-based search utilities for pet matching

/**
 * Extract dominant colors from an image
 * @param {string} imageDataUrl - Base64 image data URL
 * @returns {Promise<Array>} Array of RGB color arrays
 */
export function extractDominantColors(imageDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize to small dimensions for faster processing
      const size = 50;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;

      // Sample pixels and collect colors
      const colors = [];
      for (let i = 0; i < pixels.length; i += 4) {
        colors.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
      }

      // Get dominant colors using simple clustering
      const dominantColors = findDominantColors(colors, 5);
      resolve(dominantColors);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageDataUrl;
  });
}

/**
 * Simple k-means-like clustering to find dominant colors
 */
function findDominantColors(colors, k = 5) {
  if (colors.length === 0) return [];

  // Initialize centroids with random colors
  const centroids = [];
  for (let i = 0; i < k && i < colors.length; i++) {
    centroids.push(colors[Math.floor(Math.random() * colors.length)]);
  }

  // Run a few iterations of clustering
  for (let iter = 0; iter < 10; iter++) {
    const clusters = Array(k).fill(null).map(() => []);

    // Assign colors to nearest centroid
    colors.forEach(color => {
      let minDist = Infinity;
      let bestCluster = 0;

      centroids.forEach((centroid, idx) => {
        const dist = colorDistance(color, centroid);
        if (dist < minDist) {
          minDist = dist;
          bestCluster = idx;
        }
      });

      clusters[bestCluster].push(color);
    });

    // Update centroids
    clusters.forEach((cluster, idx) => {
      if (cluster.length > 0) {
        const avgR = cluster.reduce((sum, c) => sum + c[0], 0) / cluster.length;
        const avgG = cluster.reduce((sum, c) => sum + c[1], 0) / cluster.length;
        const avgB = cluster.reduce((sum, c) => sum + c[2], 0) / cluster.length;
        centroids[idx] = [Math.round(avgR), Math.round(avgG), Math.round(avgB)];
      }
    });
  }

  return centroids;
}

/**
 * Calculate Euclidean distance between two RGB colors
 */
function colorDistance(color1, color2) {
  const rDiff = color1[0] - color2[0];
  const gDiff = color1[1] - color2[1];
  const bDiff = color1[2] - color2[2];
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Calculate similarity score between two sets of dominant colors
 * @param {Array} colors1 - First set of dominant colors
 * @param {Array} colors2 - Second set of dominant colors
 * @returns {number} Similarity score between 0 and 1 (1 = identical)
 */
export function calculateColorSimilarity(colors1, colors2) {
  if (!colors1 || !colors2 || colors1.length === 0 || colors2.length === 0) {
    return 0;
  }

  let totalSimilarity = 0;
  let comparisons = 0;

  // Compare each color in set 1 with closest color in set 2
  colors1.forEach(c1 => {
    let minDist = Infinity;
    colors2.forEach(c2 => {
      const dist = colorDistance(c1, c2);
      if (dist < minDist) {
        minDist = dist;
      }
    });

    // Convert distance to similarity (0-1 scale)
    // Max distance for RGB is sqrt(255^2 * 3) ≈ 441
    const similarity = 1 - (minDist / 441);
    totalSimilarity += similarity;
    comparisons++;
  });

  return comparisons > 0 ? totalSimilarity / comparisons : 0;
}

/**
 * Extract basic image features (brightness, contrast)
 */
export function extractImageFeatures(imageDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const size = 50;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;

      let totalBrightness = 0;
      const brightnesses = [];

      for (let i = 0; i < pixels.length; i += 4) {
        // Calculate brightness using luminance formula
        const brightness = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        brightnesses.push(brightness);
        totalBrightness += brightness;
      }

      const avgBrightness = totalBrightness / brightnesses.length;

      // Calculate contrast (standard deviation of brightness)
      let variance = 0;
      brightnesses.forEach(b => {
        variance += Math.pow(b - avgBrightness, 2);
      });
      const contrast = Math.sqrt(variance / brightnesses.length);

      resolve({
        brightness: avgBrightness,
        contrast: contrast
      });
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageDataUrl;
  });
}

/**
 * Compare two images and return similarity score
 * @param {string} image1 - First image data URL
 * @param {string} image2 - Second image data URL
 * @returns {Promise<number>} Similarity score between 0 and 1
 */
export async function compareImages(image1, image2) {
  try {
    const [colors1, colors2, features1, features2] = await Promise.all([
      extractDominantColors(image1),
      extractDominantColors(image2),
      extractImageFeatures(image1),
      extractImageFeatures(image2)
    ]);

    // Calculate color similarity (70% weight)
    const colorSim = calculateColorSimilarity(colors1, colors2);

    // Calculate brightness similarity (15% weight)
    const brightnessDiff = Math.abs(features1.brightness - features2.brightness);
    const brightnessSim = 1 - (brightnessDiff / 255);

    // Calculate contrast similarity (15% weight)
    const contrastDiff = Math.abs(features1.contrast - features2.contrast);
    const contrastSim = 1 - Math.min(contrastDiff / 100, 1);

    // Weighted average
    const overallSimilarity = (colorSim * 0.7) + (brightnessSim * 0.15) + (contrastSim * 0.15);

    return overallSimilarity;
  } catch (error) {
    console.error('Image comparison error:', error);
    return 0;
  }
}

/**
 * Search reports by image similarity
 * @param {Array} reports - Array of pet reports
 * @param {string} searchImage - Search image data URL
 * @param {number} threshold - Minimum similarity threshold (0-1)
 * @returns {Promise<Array>} Sorted array of matches with similarity scores
 */
export async function searchByImage(reports, searchImage, threshold = 0.3) {
  if (!searchImage || !reports || reports.length === 0) {
    return [];
  }

  const matches = [];

  for (const report of reports) {
    if (!report.images || report.images.length === 0) {
      continue;
    }

    // Compare with all images in the report, use best match
    let bestSimilarity = 0;

    for (const reportImage of report.images) {
      try {
        const similarity = await compareImages(searchImage, reportImage);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
        }
      } catch (error) {
        console.error('Error comparing images:', error);
      }
    }

    if (bestSimilarity >= threshold) {
      matches.push({
        ...report,
        similarityScore: bestSimilarity
      });
    }
  }

  // Sort by similarity (highest first)
  matches.sort((a, b) => b.similarityScore - a.similarityScore);

  return matches;
}

/**
 * Combine location-based and image-based search
 * @param {Array} reports - Array of pet reports
 * @param {Object} locationFilter - Location filter criteria
 * @param {string} searchImage - Search image data URL (optional)
 * @returns {Promise<Array>} Combined search results
 */
export async function hybridSearch(reports, locationFilter, searchImage = null) {
  let results = reports;

  // Apply location filter first
  if (locationFilter) {
    const { filterReports } = await import('./searchUtils');
    results = filterReports(reports, locationFilter);
  }

  // If image provided, add similarity scoring and re-rank
  if (searchImage && results.length > 0) {
    const imageMatches = await searchByImage(results, searchImage, 0.2); // Lower threshold since already filtered

    if (imageMatches.length > 0) {
      return imageMatches;
    }
  }

  return results;
}

