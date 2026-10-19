// ===== صوت الخطوات على الباركيه (مولّد بالكود، بدون ملفات) =====
let AC, master;

function audioInit() {
  if (AC) return;
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = .6; master.connect(AC.destination);
}

function step() {
  if (!AC) return;
  const len = AC.sampleRate * .12 | 0, b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const s = AC.createBufferSource(); s.buffer = b;
  const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 300 + Math.random() * 150;
  const g = AC.createGain(); g.gain.value = .5;
  s.connect(f); f.connect(g); g.connect(master); s.start();
}

// المتصفحات تشترط تفاعل المستخدم قبل تشغيل الصوت
addEventListener('pointerdown', audioInit, { once: true });
addEventListener('keydown', audioInit, { once: true });
