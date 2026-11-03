import { initialProjects } from '../src/data/portfolioData.js';
import fs from 'fs';

console.log('Total projects to export:', initialProjects.length);

const headers = [
  'id',
  'brand',
  'category',
  'categoryLabel',
  'headline',
  'videoUrl',
  'localVideoUrl',
  'videoThumbnail',
  'brandLogo',
  'viewCount',
  'location',
  'featured',
  'active'
];

const rows = initialProjects.map(p => [
  p.id || '',
  p.brand || '',
  p.category || '',
  p.categoryLabel || '',
  p.headline || p.title || '',
  p.videoUrl || '',
  p.localVideoUrl || '',
  p.videoThumbnail || '',
  p.brandLogo || '',
  p.viewCount || '',
  p.location || '',
  p.featured ? 'TRUE' : 'FALSE',
  'TRUE'
]);

const csvLines = [headers.join(',')];
for (const row of rows) {
  const line = row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
  csvLines.push(line);
}

const outputPath = './public/portfolio_starter_sheet.csv';
fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
console.log(`Exported ${initialProjects.length} rows to ${outputPath}!`);

