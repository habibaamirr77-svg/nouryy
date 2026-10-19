// ===== اللوحات ورفع الصور =====
const slots = [];
const frameM = std({ color: 0x1d1510, roughness: .4, metalness: .2 });
const goldM  = std({ color: 0xc9a15b, roughness: .3, metalness: .8 });
// أنماط الإطارات: [حجم خارجي, مادة, حجم داخلي, مادة]
const FRAMES = [
  [1.1,  goldM, 1.06, frameM],                                  // كلاسيكي
  [1.04, std({ color: 0x0e0e0e, roughness: .3 }), 1.0, frameM], // عصري
  [1.09, wood,  1.04, std({ color: 0x3a2514, roughness: .6 })], // خشبي
];

function placeholder(i) {
  return cv(512, 384, (g, w, h) => {
    const hu = (i * 47) % 360;
    const gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, `hsl(${hu},60%,30%)`); gr.addColorStop(1, `hsl(${hu+60},70%,60%)`);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 14; k++) {
      g.globalAlpha = .5;
      g.fillStyle = `hsl(${hu + Math.random()*120},70%,${40 + Math.random()*30}%)`;
      g.beginPath();
      if (k % 2) g.arc(Math.random()*w, Math.random()*h, 20 + Math.random()*80, 0, 6.3);
      else g.rect(Math.random()*w, Math.random()*h, 40 + Math.random()*120, 30 + Math.random()*80);
      g.fill();
    }
    g.globalAlpha = 1; g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '22px sans-serif'; g.textAlign = 'center';
    g.fillText('جارٍ تحميل الصورة...', w/2, h - 18);
  });
}

// لوحة الاسم تحت اللوحة
function drawPlaque(s) {
  const g = s.pc.getContext('2d'), w = s.pc.width, h = s.pc.height;
  g.fillStyle = '#1b1713'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#c9a15b'; g.lineWidth = 3; g.strokeRect(4, 4, w-8, h-8);
  g.fillStyle = '#f4efe6'; g.font = 'bold 26px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(s.title, w/2, h/2);
  s.pt.needsUpdate = true;
}

function createSlot([x, y, z, ry, w, h], i) {
  const g = new THREE.Group();
  const f = FRAMES[i % FRAMES.length];
  box(f[0], f[0], .08, f[1], 0, 0, 0, g);
  box(f[2], f[2], .1,  f[3], 0, 0, .01, g);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: placeholder(i) }));
  m.position.z = .065; g.add(m);

  // مصباح فوق اللوحة
  const lamp = new THREE.Group();
  box(.7, .06, .2, std({ color: 0x222222 }), 0, 0, 0, lamp);
  box(.6, .02, .12, glow, 0, -.04, 0, lamp);
  lamp.scale.set(1/w, 1/h, 1); lamp.position.set(0, .5 + .25/h, .2);
  g.add(lamp);

  // لوحة الاسم
  const pc = document.createElement('canvas'); pc.width = 256; pc.height = 64;
  const pt = new THREE.CanvasTexture(pc); pt.encoding = THREE.sRGBEncoding;
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: pt }));
  plaque.scale.set(.9 / w, .22 / h, 1); plaque.position.set(0, -.5 - .23/h, .06);
  g.add(plaque);

  g.position.set(x, y, z); g.rotation.y = ry; g.scale.set(w, h, 1);
  S.add(g);

  // إضاءة موجهة على اللوحة
  const n = new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry));
  const sp = new THREE.SpotLight(0xffe2b8, 1.6, 12, .75, .7, 1.4);
  sp.position.set(x, H - .25, z).addScaledVector(n, 2.2);
  sp.target.position.set(x, y, z);
  S.add(sp, sp.target);

  const s = { g, m, w, h, maxW: w, maxH: h, pc, pt, title: 'لوحة ' + (i + 1) };
  drawPlaque(s);
  m.userData.slot = s;
  slots.push(s);
}
SLOTS.forEach(createSlot);

// وضع صورة داخل لوحة مع ضبط النسبة
function setImage(s, url, name) {
  const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous');
  loader.load(url, t => {
    t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
    const a = t.image.width / t.image.height;
    let w = s.maxH * a, h = s.maxH;
    if (w > s.maxW) { w = s.maxW; h = s.maxW / a; }
    s.g.scale.set(w, h, 1);
    s.m.material.map = t; s.m.material.needsUpdate = true;
    if (name) { s.title = name.replace(/\.[^.]+$/, '').slice(0, 24); drawPlaque(s); }
    // إعادة ضبط أبعاد لوحة الاسم والمصباح بعد تغيير الحجم
    s.g.children.forEach(c => {
      if (c.isGroup) { c.scale.set(1/w, 1/h, 1); c.position.y = .5 + .25/h; }
      else if (c.geometry && c.geometry.type === 'PlaneGeometry' && c !== s.m) { c.scale.set(.9/w, .22/h, 1); c.position.y = -.5 - .23/h; }
    });
    s.w = w; s.h = h;
    if (typeof zoom !== 'undefined' && zoom && zoom.s === s) document.getElementById('ztitle').textContent = s.title;
  }, undefined, () => console.warn('تعذر تحميل الصورة:', url));
}

// ---- تحميل الصور الثابتة من config.js
IMAGES.forEach((url, i) => { if (slots[i]) setImage(slots[i], url); });
