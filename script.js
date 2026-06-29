/* ==========================================================================
   1. DATA — thêm / sửa mẫu demo ở đây
   Mỗi mẫu cần: text (văn bản gốc) và audio (đường dẫn tới file âm thanh
   tương ứng, đặt trong thư mục audio/).
   ========================================================================== */
const samples = [
  {
    text: "Xin chào, đây là bản demo chuyển văn bản thành giọng nói.",
    audio: "audio/sample-1.mp3",
  },
  {
    text: "Hệ thống có thể đọc số liệu, ví dụ doanh thu quý hai tăng 18 phần trăm so với năm trước, đạt 4,2 tỷ đồng.",
    audio: "audio/sample-2.mp3",
  },
  {
    text: "Đoạn văn bản này pha trộn tiếng Việt và một vài từ tiếng Anh như AI, deadline hay email, để kiểm tra khả năng đọc đa ngôn ngữ.",
    audio: "audio/sample-3.mp3",
  },
];

/* ==========================================================================
   2. RENDER + PLAYER LOGIC
   ========================================================================== */
const listEl = document.getElementById("sample-list");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const BAR_COUNT = 28;

const ICON_PLAY = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>`;
const ICON_PAUSE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>`;

function formatTime(sec) {
  if (!isFinite(sec)) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Giữ tham chiếu tới tất cả audio đang quản lý, để khi phát một mẫu
// thì tạm dừng các mẫu khác.
const allAudio = [];

samples.forEach((sample, i) => {
  const card = document.createElement("article");
  card.className = "sample";

  const bars = Array.from({ length: BAR_COUNT }, () => `<span class="bar"></span>`).join("");

  card.innerHTML = `
    <span class="sample-index">${String(i + 1).padStart(2, "0")}</span>
    <button class="play-btn" type="button" aria-label="Phát mẫu ${i + 1}">${ICON_PLAY}</button>
    <div class="sample-body">
      <p class="sample-text">${sample.text}</p>
      <div class="waveform" aria-hidden="true">${bars}</div>
    </div>
    <span class="sample-meta">--:--</span>
  `;

  const audio = new Audio(sample.audio);
  audio.preload = "metadata";
  allAudio.push(audio);

  const btn = card.querySelector(".play-btn");
  const meta = card.querySelector(".sample-meta");
  const barEls = card.querySelectorAll(".bar");
  let waveformTimer = null;

  audio.addEventListener("loadedmetadata", () => {
    meta.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("error", () => {
    meta.textContent = "lỗi file";
  });

  function animateWaveform() {
    if (reduceMotion) {
      barEls.forEach((b) => (b.style.height = "16px"));
      return;
    }
    barEls.forEach((b) => {
      const h = 5 + Math.round(Math.random() * 17);
      b.style.height = `${h}px`;
    });
    waveformTimer = setTimeout(animateWaveform, 90);
  }

  function resetWaveform() {
    if (waveformTimer) clearTimeout(waveformTimer);
    barEls.forEach((b) => (b.style.height = "6px"));
  }

  function setPlayingUI(isPlaying) {
    card.classList.toggle("is-playing", isPlaying);
    btn.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
    btn.setAttribute("aria-label", isPlaying ? `Tạm dừng mẫu ${i + 1}` : `Phát mẫu ${i + 1}`);
    if (isPlaying) {
      animateWaveform();
    } else {
      resetWaveform();
      meta.textContent = formatTime(audio.duration);
    }
  }

  btn.addEventListener("click", () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    // Chỉ cho phép một mẫu phát cùng lúc.
    allAudio.forEach((a) => {
      if (a !== audio) a.pause();
    });
    audio.currentTime = 0;
    audio.play().catch(() => {
      meta.textContent = "không phát được";
    });
  });

  audio.addEventListener("play", () => setPlayingUI(true));
  audio.addEventListener("pause", () => setPlayingUI(false));
  audio.addEventListener("ended", () => setPlayingUI(false));

  listEl.appendChild(card);
});
