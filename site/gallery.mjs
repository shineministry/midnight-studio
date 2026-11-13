import { indiaDate, validDate, displayDate } from './dates.mjs';
const art = document.querySelector('#art');
const status = document.querySelector('#status');
const empty = document.querySelector('#empty');
const download = document.querySelector('#download');
let displayed = '';
async function refresh() {
  const today = indiaDate();
  document.querySelector('#today').textContent = displayDate(today) + ' · India time';
  try {
    const response = await fetch('./images.json', {cache:'no-store'});
    if (!response.ok) throw new Error('Gallery unavailable');
    const dates = await response.json();
    const latest = dates.filter(date => validDate(date) && date <= today).sort().at(-1);
    if (!latest) {
      status.textContent = 'Waiting for the first image';
      return;
    }
    const path = './images/' + latest + '.webp';
    if (displayed !== latest) {
      const preview = new Image();
      preview.src = path;
      await preview.decode();
      art.src = path;
      art.alt = 'Daily generated artwork for ' + displayDate(latest);
      art.hidden = false;
      empty.hidden = true;
      download.href = path;
      download.hidden = false;
      displayed = latest;
    }
    status.textContent = latest === today ? 'Published for today' : 'Latest image · ' + displayDate(latest);
  } catch {
    status.textContent = 'Could not refresh the gallery. Retrying in one minute.';
  }
}
await refresh();
setInterval(refresh, 60_000);
