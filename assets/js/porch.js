async function loadPorchSittin() {
  const elTitle = document.getElementById('porch-title');
  const elDate = document.getElementById('porch-date');
  const elBody = document.getElementById('porch-body');

  try {
    const res = await fetch('./content/porch-sittin.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    elTitle.textContent = data.title || 'Storage Stories';
    elDate.textContent = data.date ? `Daily message • ${data.date}` : 'Daily message';
    elBody.textContent = data.body || '';
  } catch (e) {
    elTitle.textContent = 'Storage Stories';
    elDate.textContent = 'Daily message';
    elBody.textContent = 'Could not load today\'s story. Please try again later.';
  }
}

document.addEventListener('DOMContentLoaded', loadPorchSittin);
