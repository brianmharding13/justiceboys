import './style.css';
import { videos } from './videos.js';

// ── state ──────────────────────────────────────────────────────
let player = null;
let current = Math.floor(Math.random() * videos.length); // random cold open
let ready = false;

const els = {
  nowPlaying: document.getElementById('now-playing'),
  playlist: document.getElementById('playlist'),
  fileCount: document.getElementById('file-count'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
};

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

// ── playlist ───────────────────────────────────────────────────
function buildPlaylist() {
  els.playlist.innerHTML = '';
  els.fileCount.textContent = `${String(videos.length).padStart(2, '0')} files`;

  videos.forEach((video, i) => {
    const li = document.createElement('li');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.index = String(i);
    btn.className =
      'group flex w-full items-start gap-3 px-3 py-2.5 text-left transition ' +
      'hover:bg-white/[0.04] focus:outline-none focus-visible:ring-1 focus-visible:ring-steel';

    const num = document.createElement('span');
    num.className = 'w-7 shrink-0 pt-px text-[10px] tracking-widest text-ash group-hover:text-bone';
    num.textContent = roman[i] ?? String(i + 1);

    // titles run long — clamp to 3 lines rather than cutting them at one
    const title = document.createElement('span');
    title.className = 'min-w-0 flex-1 line-clamp-3 text-[11px] uppercase leading-snug tracking-wide';
    title.textContent = video.title;

    const cue = document.createElement('span');
    cue.className = 'shrink-0 pt-px text-[10px] text-bone opacity-0';
    cue.textContent = '●';

    btn.append(num, title, cue);
    li.append(btn);
    els.playlist.append(li);
  });

  els.playlist.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-index]');
    if (btn) play(Number(btn.dataset.index));
  });
}

function paintActive() {
  els.playlist.querySelectorAll('button[data-index]').forEach((btn) => {
    const isActive = Number(btn.dataset.index) === current;
    btn.classList.toggle('bg-white/[0.07]', isActive);
    btn.classList.toggle('text-bone', isActive);
    btn.classList.toggle('text-ash', !isActive);
    btn.setAttribute('aria-current', isActive ? 'true' : 'false');
    btn.lastElementChild.classList.toggle('opacity-0', !isActive);
  });

  const n = String(current + 1).padStart(2, '0');
  els.nowPlaying.textContent = `${n} — ${videos[current].title}`;
}

// ── playback ───────────────────────────────────────────────────
function play(index) {
  current = ((index % videos.length) + videos.length) % videos.length; // wrap both ways
  paintActive();
  if (ready) player.loadVideoById(videos[current].id); // loadVideoById autoplays
}

// ── youtube iframe api ─────────────────────────────────────────
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player('player', {
    videoId: videos[current].id,
    playerVars: {
      playsinline: 1, // no forced fullscreen takeover on iOS
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3, // no annotation overlays
    },
    events: {
      onReady: () => {
        ready = true;
      },
      // advance in fixed order when one ends
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) play(current + 1);
      },
      // dead/private/region-locked video: don't strand the viewer, skip on
      onError: () => play(current + 1),
    },
  });
};

function loadApi() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.append(tag);
}

// ── redaction ──────────────────────────────────────────────────
// :hover can't be trusted on touch, so tap toggles the bar too.
document.querySelectorAll('.redact').forEach((bar) => {
  bar.addEventListener('click', () => bar.classList.toggle('is-clear'));
  bar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      bar.classList.toggle('is-clear');
    }
  });
});

// ── controls ───────────────────────────────────────────────────
els.prev.addEventListener('click', () => play(current - 1));
els.next.addEventListener('click', () => play(current + 1));

document.addEventListener('keydown', (event) => {
  if (event.target.matches('input, textarea')) return;
  if (event.key === 'ArrowLeft') play(current - 1);
  if (event.key === 'ArrowRight') play(current + 1);
});

// ── go ─────────────────────────────────────────────────────────
buildPlaylist();
paintActive();
loadApi();
