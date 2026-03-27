import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = path.join(__dirname, '../public/comics/Comics.pdf');
const OUT_DIR = path.join(__dirname, '../public/comics');
const HTML_PATH = 'file://' + path.join(__dirname, '../public/comics/extract-moodboards.html');

const pages = [
  { page: 7, name: 'comics-moodboard-mobiliario.png' },
  { page: 8, name: 'comics-moodboard-iluminacao.png' },
  { page: 9, name: 'comics-moodboard-cenografia.png' },
];

const pdfBase64 = fs.readFileSync(PDF_PATH).toString('base64');

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
});

const page = await browser.newPage();
await page.evaluateOnNewDocument((data, specs) => {
  window.__PDF_BASE64__ = data;
  window.__PAGE_SPECS__ = specs;
}, pdfBase64, pages);

await page.goto(HTML_PATH, { waitUntil: 'networkidle0', timeout: 30000 });

await page.waitForFunction('window.__EXTRACT_RESULTS__ !== undefined', { timeout: 60000 });
const results = await page.evaluate('window.__EXTRACT_RESULTS__');

for (const { name, data } of results) {
  const outPath = path.join(OUT_DIR, name);
  fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
  console.log(outPath);
}

await browser.close();
