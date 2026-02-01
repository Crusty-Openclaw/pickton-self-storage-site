(function(){
  try {
    var host = (window.location && window.location.hostname) ? window.location.hostname : '';
    var isPreview = (host === '127.0.0.1' || host === 'localhost');
    if (!isPreview) return;

    var bar = document.createElement('div');
    bar.setAttribute('role','status');
    bar.style.position='sticky';
    bar.style.top='0';
    bar.style.zIndex='9999';
    bar.style.background='rgba(255, 214, 102, .96)';
    bar.style.color='#241a10';
    bar.style.borderBottom='1px solid rgba(0,0,0,.15)';
    bar.style.padding='10px 12px';
    bar.style.fontFamily='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    bar.style.fontWeight='750';
    bar.style.letterSpacing='.2px';
    bar.textContent='PREVIEW MODE — this site is being served from the Pi (localhost).';

    document.body.insertBefore(bar, document.body.firstChild);
  } catch (e) {}
})();
