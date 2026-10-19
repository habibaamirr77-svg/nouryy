// ===== المشهد والكاميرا + دوال مساعدة =====
const R = new THREE.WebGLRenderer({ antialias: true });
R.setPixelRatio(Math.min(devicePixelRatio, 2));
R.setSize(innerWidth, innerHeight);
R.outputEncoding = THREE.sRGBEncoding;
R.toneMapping = THREE.ACESFilmicToneMapping;
R.toneMappingExposure = 1.1;
R.shadowMap.enabled = true;
R.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(R.domElement);

const S = new THREE.Scene();
S.background = new THREE.Color(0x1a1714);

const C = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, .1, 100);
C.position.set(0, 1.65, 6);
C.rotation.order = 'YXZ';

addEventListener('resize', () => {
  R.setSize(innerWidth, innerHeight);
  C.aspect = innerWidth / innerHeight;
  C.updateProjectionMatrix();
});

// رسم على canvas وتحويله لخامة
function cv(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}
const std = (o) => new THREE.MeshStandardMaterial(o);
function box(w, h, d, m, x, y, z, parent) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  b.position.set(x, y, z);
  (parent || S).add(b);
  return b;
}
