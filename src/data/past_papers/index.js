import { paperData as _paperData } from './engineering-studies/2022-hsc.js';

const modules = import.meta.glob('./*/*.js', { eager: true });

const pastPapersRegistry = {};

for (const [filePath, module] of Object.entries(modules)) {
  const match = filePath.match(/\.\/([^/]+)\/([^/]+)\.js$/);
  if (!match) continue;
  
  const [_, subjectSlug, paperSlug] = match;
  const { paperData } = module;
  
  const title = paperSlug
    .replace(/-/g, ' ')
    .replace(/(\d+)/g, '$1')
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
