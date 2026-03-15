import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../math_pdf_project/json-output');
const PUBLIC_DIR = path.join(__dirname, '../public/past-papers-images');
const DATA_DIR = path.join(__dirname, '../src/data/past_papers');

function parseFilename(filename) {
  // Pattern: "2022-hsc-engineering-studies" -> paper: "2022-hsc", subject: "engineering-studies"
  // Pattern: "2022-engineering-studies" -> paper: "2022", subject: "engineering-studies"
  const yearMatch = filename.match(/^(\d{4})-(.+)$/);
  
  if (yearMatch) {
    const year = yearMatch[1];
    let subjectSlug = yearMatch[2];
    let paperSlug = year;
    
    // If there's more after the year (like "hsc-engineering-studies"), extract subject
    // paper slug should include subject to match folder name (e.g., "2022-hsc-engineering-studies")
    const paperYearMatch = filename.match(/^(\d{4})-hsc-(.+)$/);
    if (paperYearMatch) {
      paperSlug = `${paperYearMatch[1]}-hsc-${paperYearMatch[2]}`;  // Include subject in paperSlug
      subjectSlug = paperYearMatch[2];
    }
    
    return {
      subjectSlug,
      paperSlug,
      subjectTitle: formatTitle(subjectSlug),
      paperTitle: `${year} HSC`
    };
  }
  
  // Fallback: treat entire filename as subject
  return { 
    subjectSlug: filename, 
    paperSlug: filename, 
    subjectTitle: formatTitle(filename), 
    paperTitle: formatTitle(filename) 
  };
}

function formatTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyImages(sourcePaperDir, paperSlug) {
  const imagesDir = path.join(PUBLIC_DIR, paperSlug);
  ensureDir(imagesDir);
  
  const files = fs.readdirSync(sourcePaperDir);
  const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  
  for (const file of imageFiles) {
    const src = path.join(sourcePaperDir, file);
    const dest = path.join(imagesDir, file);
    fs.copyFileSync(src, dest);
  }
  
  return imageFiles.length;
}

function processPaper(paperFolder) {
  const sourcePaperDir = path.join(SOURCE_DIR, paperFolder);
  const { subjectSlug, paperSlug, subjectTitle, paperTitle } = parseFilename(paperFolder);
  
  console.log(`Processing: ${paperFolder}`);
  console.log(`  Subject: ${subjectTitle} (${subjectSlug})`);
  console.log(`  Paper: ${paperTitle} (${paperSlug})`);
  
  const jsFile = fs.readdirSync(sourcePaperDir).find(f => f.endsWith('.js'));
  if (!jsFile) {
    console.log(`  WARNING: No JS file found in ${paperFolder}, skipping...`);
    return null;
  }
  
  let jsContent = fs.readFileSync(path.join(sourcePaperDir, jsFile), 'utf-8');
  
  const imageCount = copyImages(sourcePaperDir, paperSlug);
  console.log(`  Copied ${imageCount} images to public/past-papers-images/${paperSlug}/`);
  
  // Replace all possible image path formats
  // Handle: ./xxx.png, ../rendered_math_pages/xxx/, or bare filename.png
  const paperSlugForPath = paperSlug;  // Use paperSlug which now includes subject
  if (!jsContent.includes(`/past-papers-images/${paperSlugForPath}/`)) {
    // Replace ./ with proper path
    jsContent = jsContent.replace(/\.\//g, `/past-papers-images/${paperSlugForPath}/`);
    // Replace ../rendered_math_pages/xxx/ with proper path
    jsContent = jsContent.replace(/\.\.\/rendered_math_pages\/[^\/]+\//g, `/past-papers-images/${paperSlugForPath}/`);
    // Replace bare filenames (just name.png) with proper path
    // Match "image": "filename.png" where filename is just letters/numbers/dashes/underscores
    jsContent = jsContent.replace(/"(image|answerImage)": "([a-zA-Z0-9_-]+\.png)"/g, 
      `"$1": "/past-papers-images/${paperSlugForPath}/$2"`);
  }
  
  const subjectDir = path.join(DATA_DIR, subjectSlug);
  ensureDir(subjectDir);
  
  const destJsPath = path.join(subjectDir, `${paperSlug}.js`);
  fs.writeFileSync(destJsPath, jsContent);
  console.log(`  Copied JS to src/data/past_papers/${subjectSlug}/${paperSlug}.js`);
  
  return {
    subjectSlug,
    paperSlug,
    subjectTitle,
    paperTitle
  };
}

function generateIndex(papers) {
  const registry = {};
  
  for (const paper of papers) {
    if (!paper) continue;
    
    if (!registry[paper.subjectSlug]) {
      registry[paper.subjectSlug] = {
        title: paper.subjectTitle,
        papers: {}
      };
    }
    
    registry[paper.subjectSlug].papers[paper.paperSlug] = {
      title: paper.paperTitle,
      data: null
    };
  }
  
  const indexContent = `import { paperData as _paperData0 } from './engineering-studies/2020-hsc-engineering-studies.js';
import { paperData as _paperData1 } from './engineering-studies/2022-hsc-engineering-studies.js';
import { paperData as _paperData2 } from './earth-and-environmental-science/2019-hsc-earth-and-environmental-science.js';
import { paperData as _paperData3 } from './earth-and-environmental-science/2020-hsc-earth-and-environmental-science.js';
import { paperData as _paperData4 } from './earth-and-environmental-science/2021-hsc-earth-and-environmental-science.js';
import { paperData as _paperData5 } from './earth-and-environmental-science/2022-hsc-earth-and-environmental-science.js';
import { paperData as _paperData6 } from './earth-and-environmental-science/2023-hsc-earth-and-environmental-science.js';
import { paperData as _paperData7 } from './earth-and-environmental-science/2024-hsc-earth-and-environmental-science.js';

const modules = import.meta.glob('./*/*.js', { eager: true });

const pastPapersRegistry = {};

for (const [filePath, module] of Object.entries(modules)) {
  const match = filePath.match(/\\.\\/([^/]+)\\/([^/]+)\\.js$/);
  if (!match) continue;
  
  const [_, subjectSlug, paperSlug] = match;
  const { paperData } = module;
  
  const title = paperSlug
    .replace(/-/g, ' ')
    .replace(/(\\d+)/g, '$1')
    .toUpperCase();
  
  const subjectTitle = subjectSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  
  if (!pastPapersRegistry[subjectSlug]) {
    pastPapersRegistry[subjectSlug] = {
      title: subjectTitle,
      papers: {}
    };
  }
  
  pastPapersRegistry[subjectSlug].papers[paperSlug] = {
    title,
    data: paperData
  };
}

export default pastPapersRegistry;
export { pastPapersRegistry };
`;

  fs.writeFileSync(path.join(DATA_DIR, 'index.js'), indexContent);
  console.log(`Generated src/data/past_papers/index.js`);
}

function fixExistingPapers() {
  console.log('Checking for existing papers to fix...');
  
  // Map of paper folders to their subject and paper slugs
  const paperMappings = {
    '2020-hsc-engineering-studies': { subjectSlug: 'engineering-studies', paperSlug: '2020-hsc' },
    '2022-hsc-engineering-studies': { subjectSlug: 'engineering-studies', paperSlug: '2022-hsc' }
  };
  
  for (const [folder, info] of Object.entries(paperMappings)) {
    const jsPath = path.join(DATA_DIR, info.subjectSlug, `${info.paperSlug}.js`);
    
    if (fs.existsSync(jsPath)) {
      let content = fs.readFileSync(jsPath, 'utf-8');
      const originalContent = content;
      
      // Fix doubled paths first (if any)
      content = content.replace(new RegExp(`/past-papers-images/${info.paperSlug}/past-papers-images/${info.paperSlug}/`, 'g'), `/past-papers-images/${info.paperSlug}/`);
      content = content.replace(new RegExp(`/past-papers-images/${info.paperSlug}/rendered_math_pages/`, 'g'), `/past-papers-images/${info.paperSlug}/`);
      
      // Replace old path formats (only if not already replaced)
      if (!content.includes(`/past-papers-images/${info.paperSlug}/`)) {
        content = content.replace(/\.\//g, `/past-papers-images/${info.paperSlug}/`);
        content = content.replace(/\.\.\/rendered_math_pages\/[^\/]+\//g, `/past-papers-images/${info.paperSlug}/`);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(jsPath, content);
        console.log(`  Fixed image paths in ${info.subjectSlug}/${info.paperSlug}.js`);
      }
    }
  }
}

function main() {
  console.log('=== Copy Past Papers Script ===');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Public Images: ${PUBLIC_DIR}`);
  console.log(`Data: ${DATA_DIR}`);
  console.log('');
  
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`Source directory does not exist: ${SOURCE_DIR}`);
    console.log('Run process_pdfs.sh first to generate past papers.');
    return;
  }
  
  ensureDir(PUBLIC_DIR);
  ensureDir(DATA_DIR);
  
  const folders = fs.readdirSync(SOURCE_DIR).filter(f => {
    const stat = fs.statSync(path.join(SOURCE_DIR, f));
    return stat.isDirectory();
  });
  
  if (folders.length === 0) {
    console.log('No paper folders found in source directory.');
    return;
  }
  
  console.log(`Found ${folders.length} paper(s): ${folders.join(', ')}`);
  console.log('');
  
  const papers = folders.map(folder => processPaper(folder));
  
  console.log('');
  fixExistingPapers();
  console.log('');
  generateIndex(papers.filter(p => p !== null));
  
  console.log('');
  console.log('=== Done ===');
}

main();
