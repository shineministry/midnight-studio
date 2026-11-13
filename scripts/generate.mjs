import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { indiaDate, validDate } from '../site/dates.mjs';

const date = process.env.IMAGE_DATE || indiaDate();
if (!validDate(date) || date > indiaDate()) throw new Error('Use a valid India date on or before today.');
const image = 'site/images/' + date + '.webp';
const inventoryPath = 'site/images.json';
const dates = JSON.parse(await readFile(inventoryPath, 'utf8'));
if (dates.includes(date)) {
  await readFile(image);
  console.log('Image already published for ' + date);
  process.exit(0);
}
const prompt = (await readFile('prompts/' + date + '.txt', 'utf8').catch(error => {
  if (error.code === 'ENOENT') return '';
  throw error;
})).trim();
if (!prompt) {
  console.log('No prompt scheduled for ' + date);
  process.exit(0);
}
const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error('Set the OPENAI_API_KEY repository secret.');
const result = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
  body: JSON.stringify({model: 'gpt-image-1.5', prompt, n: 1, size: '1024x1024', quality: 'medium', output_format: 'webp'}),
  signal: AbortSignal.timeout(300_000)
});
if (!result.ok) throw new Error('OpenAI returned HTTP ' + result.status + '. Request ID ' + (result.headers.get('x-request-id') || 'unavailable'));
const payload = await result.json();
const encoded = payload.data?.[0]?.b64_json;
if (typeof encoded !== 'string') throw new Error('OpenAI returned no image.');
const bytes = Buffer.from(encoded, 'base64');
if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
  throw new Error('OpenAI returned an unexpected image format.');
}
await mkdir('site/images', {recursive: true});
await writeFile(image, bytes);
await writeFile(inventoryPath, JSON.stringify([...dates, date].sort()) + '\n');
console.log('Generated a square image for ' + date);
