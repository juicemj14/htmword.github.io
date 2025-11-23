// Basic Word-like editor using document.execCommand for quick demo.
const editor = document.getElementById('editor');
const toolbar = document.querySelector('.toolbar');

// Delegate toolbar button clicks
toolbar.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-cmd]');
  if (btn) {
    const cmd = btn.getAttribute('data-cmd');
    document.execCommand(cmd, false, null);
    editor.focus();
  }
});

// Font name & size
document.getElementById('fontName').addEventListener('change', (e) => {
  document.execCommand('fontName', false, e.target.value);
  editor.focus();
});

document.getElementById('fontSize').addEventListener('change', (e) => {
  document.execCommand('fontSize', false, e.target.value);
  editor.focus();
});

// Colors
document.getElementById('foreColor').addEventListener('input', (e) => {
  document.execCommand('foreColor', false, e.target.value);
  editor.focus();
});

document.getElementById('hiliteColor').addEventListener('input', (e) => {
  // Some browsers use backColor/hiliteColor
  document.execCommand('hiliteColor', false, e.target.value);
  document.execCommand('backColor', false, e.target.value);
  editor.focus();
});

// Link insertion
document.getElementById('createLink').addEventListener('click', () => {
  const url = prompt('Enter a URL:', 'https://');
  if (url) {
    document.execCommand('createLink', false, url);
  }
  editor.focus();
});

// Insert image
document.getElementById('insertImage').addEventListener('click', () => {
  const url = prompt('Enter an image URL:', 'https://');
  if (url) {
    document.execCommand('insertImage', false, url);
  }
  editor.focus();
});

// Undo/redo
document.getElementById('undo').addEventListener('click', () => { document.execCommand('undo'); editor.focus(); });
document.getElementById('redo').addEventListener('click', () => { document.execCommand('redo'); editor.focus(); });

// File open
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    if (file.name.match(/\.html?$|\.htm$/i)) {
      editor.innerHTML = text;
    } else {
      // plain text
      editor.innerText = text;
    }
  };
  reader.readAsText(file);
});

// Downloads
function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getFullHtml() {
  return `<!doctype html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Export</title></head><body>\n${editor.innerHTML}\n</body></html>`;
}

document.getElementById('downloadHtml').addEventListener('click', () => {
  download('document.html', getFullHtml(), 'text/html');
});

document.getElementById('downloadDoc').addEventListener('click', () => {
  // Many word processors accept HTML saved with .doc and MIME application/msword
  download('document.doc', getFullHtml(), 'application/msword');
});

document.getElementById('downloadTxt').addEventListener('click', () => {
  download('document.txt', editor.innerText, 'text/plain');
});

// Print
document.getElementById('printBtn').addEventListener('click', () => {
  const w = window.open('', '_blank');
  w.document.write(getFullHtml());
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
});

// Nice: Ctrl+S save to HTML (prevent browser save)
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    download('document.html', getFullHtml(), 'text/html');
  }
});

// Minimal autosave to localStorage (optional convenience)
setInterval(() => {
  try { localStorage.setItem('online-word-autosave', editor.innerHTML); } catch (err) {}
}, 5000);

// Load from autosave on startup if present
window.addEventListener('load', () => {
  const saved = localStorage.getItem('online-word-autosave');
  if (saved && confirm('Load autosaved content?')) {
    editor.innerHTML = saved;
  }
});
