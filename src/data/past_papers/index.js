import { paperData as _paperData0 } from './engineering-studies/2020-hsc-engineering-studies.js';
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
