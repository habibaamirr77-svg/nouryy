// ===== التحكم: ماوس + كيبورد + لمس + تكبير اللوحة =====
let yaw = 0, pitch = 0;
const keys = {}, mv = { x: 0, y: 0 }, ptr = {};
const ray = new THREE.Raycaster();
let zoom = null; // حالة التكبير

const zui = document.getElementById('zoomui'), ztitle = document.getElementById('ztitle');
document.getElementById('zclose').onclick = () => closeZoom();

addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'Escape') closeZoom(); });
addEventListener('keyup',   e => keys[e.code] = false);

function openZoom(s) {
  if (zoom) return;
  const ry = s.g.rotation.y, n = new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry));
  const t = Math.tan(THREE.MathUtils.degToRad(C.fov / 2));
  const d = Math.max(1.6, Math.max(s.h / 2 / t, s.w / 2 / (t * C.aspect)) * 1.2 + .3);
  zoom = { s, saved: { p: C.position.clone(), yaw, pitch }, tp: s.g.position.clone().addScaledVector(n, d), ty: ry, tpitch: 0, closing: false };
  zoom.tp.y = s.g.position.y;
  ztitle.textContent = s.title;
  zui.hidden = false;
  Object.keys(keys).forEach(k => keys[k] = false); mv.x = mv.y = 0;
}
function closeZoom() {
  if (!zoom || zoom.closing) return;
  zoom.closing = true; zui.hidden = true;
  zoom.tp = zoom.saved.p; zoom.ty = zoom.saved.yaw; zoom.tpitch = zoom.saved.pitch;
}
// يرجع true أثناء التكبير (الحركة العادية تتوقف)
function updateZoom(dt) {
  if (!zoom) return false;
  const k = 1 - Math.exp(-dt * 5);
  C.position.lerp(zoom.tp, k);
  const dy = ((zoom.ty - yaw + Math.PI) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI) - Math.PI;
  yaw += dy * k; pitch += (zoom.tpitch - pitch) * k;
  C.rotation.set(pitch, yaw, 0);
  if (zoom.closing && C.position.distanceTo(zoom.tp) < .05 && Math.abs(dy) < .02) { zoom = null; }
  return true;
}

R.domElement.addEventListener('pointerdown', e => {
  R.domElement.setPointerCapture(e.pointerId);
  const mode = e.pointerType === 'touch' && e.clientX < innerWidth / 2 ? 'move' : 'look';
  ptr[e.pointerId] = { mode, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY };
});

R.domElement.addEventListener('pointermove', e => {
  const p = ptr[e.pointerId]; if (!p || zoom) return;
  if (p.mode === 'look') {
    yaw   -= (e.clientX - p.x) * .004;
    pitch -= (e.clientY - p.y) * .004;
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
    p.x = e.clientX; p.y = e.clientY;
  } else {
    mv.x = Math.max(-1, Math.min(1, (e.clientX - p.sx) / 50));
    mv.y = Math.max(-1, Math.min(1, (e.clientY - p.sy) / 50));
  }
});

function pointerUp(e) {
  const p = ptr[e.pointerId]; if (!p) return;
  const tap = Math.hypot(e.clientX - p.sx, e.clientY - p.sy) < 6;
  if (zoom) { if (tap) closeZoom(); }
  else if (p.mode === 'look' && tap) {
    ray.setFromCamera({ x: e.clientX / innerWidth * 2 - 1, y: -(e.clientY / innerHeight) * 2 + 1 }, C);
    const hit = ray.intersectObjects(slots.map(s => s.m))[0];
    if (hit && hit.distance < 16) openZoom(hit.object.userData.slot);
  }
  if (p.mode === 'move') mv.x = mv.y = 0;
  delete ptr[e.pointerId];
}
R.domElement.addEventListener('pointerup', pointerUp);
R.domElement.addEventListener('pointercancel', pointerUp);

// تصادم مع الجدران والأثاث
function blocked(x, z) {
  if (Math.abs(x) > W/2 - .8 || Math.abs(z) > D/2 - .8) return true;
  return obst.some(b => Math.abs(x - b.x) < b.hx + .3 && Math.abs(z - b.z) < b.hz + .3);
}
