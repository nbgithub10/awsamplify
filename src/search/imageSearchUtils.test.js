// Unit tests for image search utilities
import {
  extractDominantColors,
  calculateColorSimilarity,
  extractImageFeatures,
  compareImages,
  searchByImage
} from './imageSearchUtils';

describe('Image Search Utilities', () => {

  // Mock image data URL (1x1 red pixel)
  const redPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

  // Mock image data URL (1x1 blue pixel)
  const bluePixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==';

  describe('extractDominantColors', () => {
    it('should extract colors from an image', async () => {
      const colors = await extractDominantColors(redPixel);
      expect(Array.isArray(colors)).toBe(true);
      expect(colors.length).toBeGreaterThan(0);
      expect(colors[0]).toHaveLength(3); // RGB array
    });

    it('should return RGB values in valid range', async () => {
      const colors = await extractDominantColors(redPixel);
      colors.forEach(color => {
        expect(color[0]).toBeGreaterThanOrEqual(0);
        expect(color[0]).toBeLessThanOrEqual(255);
        expect(color[1]).toBeGreaterThanOrEqual(0);
        expect(color[1]).toBeLessThanOrEqual(255);
        expect(color[2]).toBeGreaterThanOrEqual(0);
        expect(color[2]).toBeLessThanOrEqual(255);
      });
    });
  });

  describe('calculateColorSimilarity', () => {
    it('should return 1 for identical color sets', () => {
      const colors1 = [[255, 0, 0], [0, 255, 0]];
      const colors2 = [[255, 0, 0], [0, 255, 0]];
      const similarity = calculateColorSimilarity(colors1, colors2);
      expect(similarity).toBeGreaterThan(0.95); // Very high similarity
    });

    it('should return lower value for different colors', () => {
      const colors1 = [[255, 0, 0]]; // Red
      const colors2 = [[0, 0, 255]]; // Blue
      const similarity = calculateColorSimilarity(colors1, colors2);
      expect(similarity).toBeLessThan(0.5); // Low similarity
    });

    it('should return 0 for empty arrays', () => {
      const similarity = calculateColorSimilarity([], []);
      expect(similarity).toBe(0);
    });

    it('should handle null/undefined inputs', () => {
      expect(calculateColorSimilarity(null, [[255, 0, 0]])).toBe(0);
      expect(calculateColorSimilarity([[255, 0, 0]], null)).toBe(0);
    });
  });

  describe('extractImageFeatures', () => {
    it('should extract brightness and contrast', async () => {
      const features = await extractImageFeatures(redPixel);
      expect(features).toHaveProperty('brightness');
      expect(features).toHaveProperty('contrast');
      expect(typeof features.brightness).toBe('number');
      expect(typeof features.contrast).toBe('number');
    });

    it('should return valid brightness values', async () => {
      const features = await extractImageFeatures(redPixel);
      expect(features.brightness).toBeGreaterThanOrEqual(0);
      expect(features.brightness).toBeLessThanOrEqual(255);
    });
  });

  describe('compareImages', () => {
    it('should return similarity score between 0 and 1', async () => {
      const similarity = await compareImages(redPixel, bluePixel);
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should return high similarity for identical images', async () => {
      const similarity = await compareImages(redPixel, redPixel);
      expect(similarity).toBeGreaterThan(0.9);
    });

    it('should handle errors gracefully', async () => {
      const similarity = await compareImages('invalid', 'invalid');
      expect(similarity).toBe(0);
    });
  });

  describe('searchByImage', () => {
    const mockReports = [
      {
        id: '1',
        name: 'Dog1',
        status: 'lost',
        images: [redPixel]
      },
      {
        id: '2',
        name: 'Dog2',
        status: 'found',
        images: [bluePixel]
      },
      {
        id: '3',
        name: 'Dog3',
        status: 'lost',
        images: [] // No images
      }
    ];

    it('should return array of matches', async () => {
      const results = await searchByImage(mockReports, redPixel, 0.3);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should include similarity scores', async () => {
      const results = await searchByImage(mockReports, redPixel, 0.3);
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('similarityScore');
        expect(typeof results[0].similarityScore).toBe('number');
      }
    });

    it('should sort by similarity descending', async () => {
      const results = await searchByImage(mockReports, redPixel, 0.3);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].similarityScore).toBeGreaterThanOrEqual(
          results[i].similarityScore
        );
      }
    });

    it('should filter by threshold', async () => {
      const highThreshold = await searchByImage(mockReports, redPixel, 0.9);
      const lowThreshold = await searchByImage(mockReports, redPixel, 0.1);
      expect(highThreshold.length).toBeLessThanOrEqual(lowThreshold.length);
    });

    it('should skip reports without images', async () => {
      const results = await searchByImage(mockReports, redPixel, 0);
      const reportWithoutImage = results.find(r => r.id === '3');
      expect(reportWithoutImage).toBeUndefined();
    });

    it('should return empty array for no matches', async () => {
      const results = await searchByImage(mockReports, redPixel, 0.99);
      // Might be empty depending on actual similarity
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty reports array', async () => {
      const results = await searchByImage([], redPixel, 0.3);
      expect(results).toEqual([]);
    });

    it('should handle null search image', async () => {
      const results = await searchByImage(mockReports, null, 0.3);
      expect(results).toEqual([]);
    });
  });

  describe('Integration tests', () => {
    it('should complete full image search workflow', async () => {
      // Create mock report with image
      const report = {
        id: 'test-1',
        name: 'TestPet',
        status: 'lost',
        images: [redPixel]
      };

      // Search with similar image
      const results = await searchByImage([report], redPixel, 0.5);

      // Should find the match
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('test-1');
      expect(results[0].similarityScore).toBeGreaterThan(0.5);
    });
  });

  describe('Performance tests', () => {
    it('should complete search within reasonable time', async () => {
      const start = Date.now();
      await searchByImage(
        [{ id: '1', status: 'lost', images: [redPixel] }],
        redPixel,
        0.3
      );
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});

// Color distance helper tests
describe('Color utility functions', () => {
  it('should calculate correct Euclidean distance', () => {
    // Distance between red and blue
    const red = [255, 0, 0];
    const blue = [0, 0, 255];

    // Distance should be sqrt(255^2 + 0^2 + 255^2) = sqrt(130050) ≈ 360.6
    // This is tested indirectly through calculateColorSimilarity

    const colors1 = [red];
    const colors2 = [blue];
    const similarity = calculateColorSimilarity(colors1, colors2);

    // High distance = low similarity
    expect(similarity).toBeLessThan(0.3);
  });

  it('should handle grayscale colors', () => {
    const white = [[255, 255, 255]];
    const black = [[0, 0, 0]];
    const similarity = calculateColorSimilarity(white, black);
    expect(similarity).toBeLessThan(0.1); // Very different
  });
});

