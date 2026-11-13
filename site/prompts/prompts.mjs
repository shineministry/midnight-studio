import { indiaDate, validDate, displayDate } from '../dates.mjs';
const date = document.querySelector('#date');
const editor = document.querySelector('#editor');
const selection = document.querySelector('#selection');
const requested = new URLSearchParams(location.search).get('date') || '';
date.value = validDate(requested) ? requested : indiaDate(new Date(Date.now() + 86_400_000));
let config;
try {
  const response = await fetch('../repository.json');
  if (!response.ok) throw new Error();
  config = await response.json();
} catch {
  selection.textContent = 'The GitHub editor link becomes available after deployment.';
}
function update() {
  editor.hidden = true;
  if (!config || !validDate(date.value)) return;
  const { repository, branch, prompts } = config;
  const exists = prompts.includes(date.value);
  const root = 'https://github.com/' + repository;
  const path = 'prompts/' + date.value + '.txt';
  editor.href = exists
    ? root + '/edit/' + encodeURIComponent(branch) + '/' + path
    : root + '/new/' + encodeURIComponent(branch) + '?' + new URLSearchParams({filename: path});
  editor.hidden = false;
  selection.textContent = displayDate(date.value) + ' at 12:00 AM IST' +
    (date.value <= indiaDate() ? ' · Scheduled time has passed. Use a manual run for this date.' : '');
  history.replaceState(null, '', '?date=' + date.value);
}
date.addEventListener('change', update);
update();
