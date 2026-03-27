#!/usr/bin/env node
/**
 * Extracts embedded base64 PNG images from SVG files and saves them as PNG files.
 */

const fs = require('fs');
const path = require('path');

const SVG_FILES = [
  '/Users/marisstudio/Desktop/mari-portfolio/public/comics/moodboard.svg',
  '/Users/marisstudio/Desktop/mari-portfolio/public/comics/MOODBOARD2.svg',
  '/Users/marisstudio/Desktop/mari-portfolio/public/comics/Mobiliario.svg',
  '/Users/marisstudio/Desktop/mari-portfolio/public/comics/iluminacao.svg',
  '/Users/marisstudio/Desktop/mari-portfolio/public/comics/Herois.svg',
];

const OUTPUT_DIR = '/Users/marisstudio/Desktop/mari-portfolio/public/comics/moodboard-extracted';

// Regex to match data:image/png;base64,<base64data> (handles both xlink:href and href)
const BASE64_REGEX = /data:image\/png;base64,([A-Za-z0-9+/=]+)/g;

function extractImagesFromSVG(svgPath) {
  const content = fs.readFileSync(svgPath, 'utf8');
  const matches = [...content.matchAll(BASE64_REGEX)];
  return matches.map(m => m[1]);
}

function getFilenameWithoutExt(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const createdFiles = [];

  for (const svgPath of SVG_FILES) {
    if (!fs.existsSync(svgPath)) {
      console.error(`Warning: File not found: ${svgPath}`);
      continue;
    }

    const baseName = getFilenameWithoutExt(svgPath);
    const images = extractImagesFromSVG(svgPath);

    if (images.length === 0) {
      console.log(`No base64 images found in ${path.basename(svgPath)}`);
      continue;
    }

    for (let i = 0; i < images.length; i++) {
      const outputFilename = `${baseName}-${i}.png`;
      const outputPath = path.join(OUTPUT_DIR, outputFilename);

      try {
        const buffer = Buffer.from(images[i], 'base64');
        fs.writeFileSync(outputPath, buffer);
        createdFiles.push(outputPath);
        console.log(`Extracted: ${outputFilename}`);
      } catch (err) {
        console.error(`Error saving ${outputFilename}: ${err.message}`);
      }
    }
  }

  return createdFiles;
}

const files = main();
console.log(`\nTotal: ${files.length} files created in ${OUTPUT_DIR}`);
