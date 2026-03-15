import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PAST_PAPERS_DIR = path.join(process.cwd(), 'src/data/past_papers');
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public/past-papers-images');

describe('Past Papers Image Validation', () => {
  
  test('all referenced images exist in public folder', () => {
    const issues = [];
    const stats = {
      filesScanned: 0,
      totalImages: 0,
      imagesFound: 0,
      imagesMissing: 0
    };
    
    const subjects = fs.readdirSync(PAST_PAPERS_DIR).filter(f => {
      return fs.statSync(path.join(PAST_PAPERS_DIR, f)).isDirectory();
    });
    
    console.log(`\n=== Scanning Past Papers ===`);
    console.log(`Subjects: ${subjects.join(', ')}\n`);
    
    for (const subject of subjects) {
      const subjectDir = path.join(PAST_PAPERS_DIR, subject);
      const files = fs.readdirSync(subjectDir).filter(f => f.endsWith('.js'));
      
      for (const file of files) {
        const filePath = path.join(subjectDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        stats.filesScanned++;
        
        console.log(`Scanning: ${subject}/${file}`);
        
        const imageRegex = /"image"\s*:\s*"([^"]+)"/g;
        const answerImageRegex = /"answerImage"\s*:\s*"([^"]+)"/g;
        
        const images = [];
        let match;
        
        while ((match = imageRegex.exec(content)) !== null) {
          images.push(match[1]);
        }
        while ((match = answerImageRegex.exec(content)) !== null) {
          images.push(match[1]);
        }
        
        stats.totalImages += images.length;
        
        for (const imgPath of images) {
          // Extract filename from any path format
          const filename = path.basename(imgPath);
          
          // Find the image in public folder - search all subject folders
          let found = false;
          const publicFolders = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(f => {
            return fs.statSync(path.join(PUBLIC_IMAGES_DIR, f)).isDirectory();
          });
          
          for (const folder of publicFolders) {
            const imageFullPath = path.join(PUBLIC_IMAGES_DIR, folder, filename);
            if (fs.existsSync(imageFullPath)) {
              found = true;
              stats.imagesFound++;
              break;
            }
          }
          
          if (!found) {
            stats.imagesMissing++;
            issues.push({
              file: `${subject}/${file}`,
              imagePath: imgPath,
              filename
            });
            console.log(`  ❌ Missing: ${filename}`);
          } else {
            console.log(`  ✓ ${filename}`);
          }
        }
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Files scanned: ${stats.filesScanned}`);
    console.log(`Images referenced: ${stats.totalImages}`);
    console.log(`Images found: ${stats.imagesFound}`);
    console.log(`Images missing: ${stats.imagesMissing}`);
    
    if (issues.length > 0) {
      console.log(`\n=== Missing Images (${issues.length}) ===`);
      const byFile = {};
      issues.forEach(issue => {
        if (!byFile[issue.file]) byFile[issue.file] = [];
        byFile[issue.file].push(issue);
      });
      Object.entries(byFile).forEach(([file, fileIssues]) => {
        console.log(`\n${file} (${fileIssues.length} missing):`);
        fileIssues.slice(0, 5).forEach(i => console.log(`  - ${i.filename}`));
        if (fileIssues.length > 5) console.log(`  ... and ${fileIssues.length - 5} more`);
      });
    }
    
    expect(stats.imagesMissing).toBe(0);
  });
});
