async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed: ${path}`);
  return await res.json();
}

function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v);
  }
  for (const c of children) n.appendChild(c);
  return n;
}

function renderStory(story) {
  const elTitle = document.getElementById('story-title');
  const elDate = document.getElementById('story-date');
  const elBody = document.getElementById('story-body');

  elTitle.textContent = story.title || 'Storage Stories';
  elDate.textContent = story.date ? `Daily story • ${story.date}` : 'Daily story';
  elBody.textContent = story.body || '';
}

function setActive(listEl, activeKey) {
  for (const btn of listEl.querySelectorAll('button[data-key]')) {
    const on = btn.getAttribute('data-key') === activeKey;
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
    btn.classList.toggle('active', on);
  }
}

async function loadIndex() {
  // Preferred: content/stories/index.json
  // Fallback: content/porch-sittin.json (single story)
  try {
    const index = await fetchJson('./content/stories/index.json');
    return index;
  } catch (e) {
    return null;
  }
}

async function loadStoryByFile(filePath) {
  return await fetchJson(filePath);
}

async function initStorageStories() {
  const list = document.getElementById('story-tabs');
  const status = document.getElementById('story-status');

  const index = await loadIndex();

  if (!index || !Array.isArray(index.stories) || index.stories.length === 0) {
    // fallback: show the latest single story
    try {
      const s = await fetchJson('./content/porch-sittin.json');
      renderStory(s);
      status.textContent = '';
    } catch (e) {
      status.textContent = 'Could not load stories. Please try again later.';
    }
    return;
  }

  // Newest first by convention (index is written that way)
  const stories = index.stories;

  // Build “tabs” (a vertical tablist)
  list.innerHTML = '';
  for (const item of stories) {
    const key = item.date || item.file;
    const btn = el('button', {
      type: 'button',
      class: 'tabBtn',
      'data-key': key,
      role: 'tab',
      'aria-selected': 'false'
    }, [
      el('div', { class: 'tabTitle', text: item.title || 'Untitled' }),
      el('div', { class: 'tabMeta', text: item.date || '' })
    ]);

    btn.addEventListener('click', async () => {
      status.textContent = 'Loading…';
      try {
        const s = await loadStoryByFile(item.file);
        renderStory(s);
        setActive(list, key);
        status.textContent = '';
        history.replaceState(null, '', `#${encodeURIComponent(item.date || '')}`);
      } catch (e) {
        status.textContent = 'Could not load that story.';
      }
    });

    list.appendChild(btn);
  }

  // Default: most recent, or hash date if present
  const hashDate = decodeURIComponent((location.hash || '').replace(/^#/, '') || '');
  let selected = stories[0];
  if (hashDate) {
    const found = stories.find(s => s.date === hashDate);
    if (found) selected = found;
  }

  status.textContent = 'Loading…';
  try {
    const s = await loadStoryByFile(selected.file);
    renderStory(s);
    setActive(list, selected.date || selected.file);
    status.textContent = '';
  } catch (e) {
    status.textContent = 'Could not load the latest story.';
  }
}

document.addEventListener('DOMContentLoaded', initStorageStories);
