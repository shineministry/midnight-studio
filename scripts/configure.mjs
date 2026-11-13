import { readdir, writeFile } from 'node:fs/promises';
import { validDate } from '../site/dates.mjs';

const repository = process.env.GITHUB_REPOSITORY;
const branch = process.env.GITHUB_REF_NAME;
if (!repository || !branch) throw new Error('Repository and branch are required.');
const prompts = (await readdir('prompts')).filter(name => name.endsWith('.txt'))
  .map(name => name.slice(0, -4)).filter(validDate);
await writeFile('site/repository.json', JSON.stringify({repository, branch, prompts}) + '\n');
