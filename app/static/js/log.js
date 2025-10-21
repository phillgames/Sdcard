window.addEventListener('DOMContentLoaded', () => {
  const logContainer = document.getElementById('log');
  if (!logContainer) return;

  let raw = localStorage.getItem('delivered') || '[]';
  let delivered;
  try {
    delivered = JSON.parse(raw);
  } catch (e) {
    delivered = [];
  }

  // Normalize: if entries are strings, convert to objects for display
  delivered = delivered.map((entry) => {
    if (typeof entry === 'string') return { user: entry, date: '', sd32: false, sd64: false, sd128: false, ts: null };
    if (entry && typeof entry === 'object') return entry;
    return null;
  }).filter(Boolean);

  logContainer.innerHTML = '';
  if (delivered.length === 0) {
    logContainer.textContent = 'No items delivered yet.';
    return;
  }

  delivered.forEach(rec => {
    const user = (rec.user || '').trim() || 'Unknown';
    const sizes = [];
    if (rec.sd32) sizes.push('32GB');
    if (rec.sd64) sizes.push('64GB');
    if (rec.sd128) sizes.push('128GB');
    const sizesText = sizes.length ? sizes.join(', ') : 'no size selected';
    const dateText = rec.date || 'no date';
    const li = document.createElement('li');
    li.textContent = `${user} — delivered${sizesText ? ' (' + sizesText + ')' : ''} — Date: ${dateText}`;
    logContainer.appendChild(li);
  });
});
