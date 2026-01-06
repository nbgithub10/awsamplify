# Image-Based Pet Search Documentation

## Overview
The Pet Search application now includes advanced **image-based search** capabilities that allow users to find lost or found pets using visual similarity matching. This feature complements the existing location-based search functionality.

## Features

### 1. **Image Upload & Preview**
- Upload pet images in the search form
- Supported formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Real-time image preview with remove option
- Automatic image compression for optimal performance

### 2. **Three Search Modes**

#### **Location-Only Search** (Original)
- Search by country, state, and/or postcode
- Filters results based on geographic location
- Fast and efficient for area-specific searches

#### **Image-Only Search** (New)
- Search using only a pet image
- No location required
- Finds visually similar pets across all locations
- Results ranked by similarity score (0-100%)

#### **Hybrid Search** (New)
- Combines location filters with image similarity
- First filters by location, then ranks by visual similarity
- Best of both worlds for precise matching

### 3. **Visual Similarity Matching**

The system analyzes images using multiple factors:

#### **Color Analysis (70% weight)**
- Extracts dominant colors from images
- Uses k-means clustering to identify 5 primary colors
- Compares color palettes between search image and database images
- Particularly effective for matching coat colors and patterns

#### **Brightness Analysis (15% weight)**
- Calculates average image brightness using luminance formula
- Helps match lighting conditions and fur tone
- Useful for distinguishing light vs. dark colored pets

#### **Contrast Analysis (15% weight)**
- Measures variance in brightness across the image
- Helps identify pattern complexity (spots, stripes, etc.)
- Assists in matching pets with distinct markings

### 4. **Similarity Scoring**

Results are scored from 0-100%:
- **70-100% (Green)**: High similarity - Strong match
- **50-69% (Orange)**: Medium similarity - Possible match
- **30-49% (Gray)**: Low similarity - Worth reviewing

Minimum threshold: 30% for image-only, 20% for hybrid search

## How to Use

### For Users

1. **Search by Image Only:**
   - Go to "Search our database" tab
   - Upload a clear photo of the pet
   - Click "Search our database"
   - Review results ranked by similarity

2. **Search by Location + Image:**
   - Enter location details (country, state, postcode)
   - Upload a pet image
   - Click search
   - Get location-filtered results ranked by visual similarity

3. **Tips for Best Results:**
   - Use clear, well-lit photos
   - Include the pet's full body or face
   - Avoid heavily filtered or edited images
   - Multiple angles can help if first search doesn't match

### For Developers

#### Key Files

**`/src/search/imageSearchUtils.js`**
- Core image analysis and comparison functions
- Color extraction and clustering algorithms
- Similarity scoring logic

**`/src/search/PetSearch.js`**
- Updated search component with image upload
- Async search handler supporting all modes
- Results display with similarity badges

**`/src/search/petsearch.css`**
- Styling for image search UI elements
- Similarity badge styles
- Image preview container

#### Key Functions

```javascript
// Extract dominant colors from an image
extractDominantColors(imageDataUrl) => Promise<Array<RGB>>

// Calculate similarity between two color sets
calculateColorSimilarity(colors1, colors2) => number (0-1)

// Compare two images and return similarity score
compareImages(image1, image2) => Promise<number>

// Search reports by image similarity
searchByImage(reports, searchImage, threshold) => Promise<Array>

// Hybrid search combining location and image
hybridSearch(reports, locationFilter, searchImage) => Promise<Array>
```

#### Adding New Features

**To adjust similarity weights:**
```javascript
// In imageSearchUtils.js, compareImages function
const overallSimilarity = 
  (colorSim * 0.7) +      // Color weight
  (brightnessSim * 0.15) + // Brightness weight
  (contrastSim * 0.15);    // Contrast weight
```

**To change matching thresholds:**
```javascript
// In PetSearch.js, handleSearch function
searchResults = await searchByImage(statusFiltered, searchImagePreview, 0.3);
// Change 0.3 to desired threshold (0.0 - 1.0)
```

**To add more image features:**
1. Add extraction function in `imageSearchUtils.js`
2. Update `compareImages()` to include new feature
3. Adjust weights to maintain total = 1.0

## Technical Details

### Performance Considerations

- Images resized to 50x50px for analysis (fast processing)
- Canvas API used for efficient pixel manipulation
- Image compression reduces file sizes before storage
- Async/await prevents UI blocking during analysis
- Results cached in component state

### Browser Compatibility

- Requires modern browser with Canvas API support
- FileReader API for image upload
- Tested on Chrome, Firefox, Safari, Edge

### Limitations

- Similarity matching is computational (may take 1-3 seconds)
- Works best with clear, unobstructed pet photos
- Color-based matching may struggle with similar-colored pets
- No deep learning/AI - uses classical computer vision techniques

### Future Enhancements

Potential improvements:
- [ ] Add breed recognition using ML model
- [ ] Implement pattern/texture analysis
- [ ] Add face detection for closer crops
- [ ] Support video frame extraction
- [ ] Batch image upload for multiple angles
- [ ] Progressive search refinement
- [ ] Save search history

## API Integration Ready

The image search utilities are designed to be easily integrated with backend APIs:

```javascript
// Example: Send image to ML API for enhanced matching
async function enhancedImageSearch(imageDataUrl) {
  const response = await fetch('/api/pet-recognition', {
    method: 'POST',
    body: JSON.stringify({ image: imageDataUrl }),
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}
```

Suggested backend services:
- AWS Rekognition (custom labels for pet breeds)
- Google Cloud Vision API
- Microsoft Azure Computer Vision
- Custom TensorFlow.js models

## Testing

### Test Cases

1. **Identical images**: Should return ~95-100% similarity
2. **Same pet, different angle**: Should return ~70-90%
3. **Different pets, same breed**: Should return ~40-60%
4. **Different pets, different breed**: Should return ~20-40%
5. **No images in database**: Should return empty results

### Test Data

Use the existing sample data in localStorage or add test reports with images:
```javascript
{
  id: 'TEST-001',
  name: 'Test Dog',
  breed: 'Golden Retriever',
  status: 'lost',
  images: ['data:image/jpeg;base64,...'],
  // ... other fields
}
```

## Troubleshooting

**Search returns no results:**
- Check if database has reports with images
- Lower similarity threshold
- Try different image of the same pet

**Slow performance:**
- Reduce number of reports in database
- Clear browser cache
- Check image file sizes (should be < 5MB)

**Incorrect matches:**
- Use clearer photos
- Ensure good lighting
- Try hybrid search with location filter

## License & Credits

- Color clustering algorithm: Simplified k-means
- Image compression: HTML5 Canvas API
- No external image processing libraries required

---

**Version:** 1.0  
**Last Updated:** January 3, 2026  
**Author:** Pet Search Development Team

