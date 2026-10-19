// ===== الديكورات: بنشات، سجادة، منحوتة، نباتات =====
const wood    = std({ color: 0x5a3a22, roughness: .5 });
const leather = std({ color: 0x2a2420, roughness: .7 });
const obst = []; // عوائق الحركة (التصادم)

function bench(x, z, rot) {
  const g = new THREE.Group();
  box(3, .12, .9, leather, 0, .48, 0, g);
  [-1.3, 1.3].forEach(a => box(.1, .45, .8, wood, a, .22, 0, g));
  g.position.set(x, 0, z); g.rotation.y = rot;
  S.add(g);
  obst.push({ x, z, hx: rot ? .5 : 1.6, hz: rot ? 1.6 : .5 });
}

function plant(x, z) {
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.35, .28, .7, 20), std({ color: 0xb8683f, roughness: .8 }));
  pot.position.set(x, .35, z); S.add(pot);
  const leafM = std({ color: 0x2f6b3a, roughness: .8 });
  for (let i = 0; i < 14; i++) {
    const a = i * 2.4, r = .1 + Math.random() * .3;
    const s = new THREE.Mesh(new THREE.SphereGeometry(.28, 10, 8), leafM);
    s.scale.set(1, 1.6, .5);
    s.position.set(x + Math.cos(a)*r, 1.1 + Math.random()*.9, z + Math.sin(a)*r);
    s.rotation.set(Math.random() - .5, a, Math.random() - .5);
    S.add(s);
  }
  obst.push({ x, z, hx: .4, hz: .4 });
}

// سجادة
const rug = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), std({
  map: cv(256, 160, (g, w, h) => {
    g.fillStyle = '#6d2f2a'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d8b878'; g.lineWidth = 4; g.strokeRect(8, 8, w-16, h-16);
    g.lineWidth = 1.5; g.strokeRect(18, 18, w-36, h-36);
    for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(w/2, 26); g.arc(28 + i*25, h/2, 10, 0, 6.3); g.stroke(); }
  }), roughness: 1 }));
rug.rotation.x = -Math.PI / 2; rug.position.y = .012;
S.add(rug);

bench(0, -2.2, 0);
bench(0,  2.2, 0);

// قاعدة + منحوتة
const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(.55, .65, 1.1, 32), std({ color: 0xe9e5de, roughness: .5 }));
pedestal.position.set(0, .55, 0); S.add(pedestal);
const sculpture = new THREE.Mesh(new THREE.TorusKnotGeometry(.35, .1, 120, 16), std({ color: 0xc9a15b, metalness: .9, roughness: .25 }));
sculpture.position.set(0, 1.65, 0); S.add(sculpture);
obst.push({ x: 0, z: 0, hx: .7, hz: .7 });

[[-12,-8],[12,-8],[-12,8],[12,8]].forEach(p => plant(...p));

// ===== منحوتات إضافية أمام النوافذ =====
function pedestalWith(x, z, geo, mat) {
  const p = new THREE.Mesh(new THREE.CylinderGeometry(.4, .45, 1.2, 24), std({ color: 0xe9e5de, roughness: .5 }));
  p.position.set(x, .6, z); S.add(p);
  const m = new THREE.Mesh(geo, mat); m.position.set(x, 1.2 + .4, z); S.add(m);
  obst.push({ x, z, hx: .5, hz: .5 });
  return m;
}
const sculpt2 = pedestalWith(-11.4, 0, new THREE.SphereGeometry(.4, 32, 24), std({ color: 0xf5f2ec, roughness: .15, metalness: .1 }));
const sculpt3 = pedestalWith( 11.4, 0, new THREE.IcosahedronGeometry(.42, 0), std({ color: 0x3b4a47, roughness: .3, metalness: .6 }));

// ===== غبار عائم في الهواء =====
const DN = 250, dpos = new Float32Array(DN * 3);
for (let i = 0; i < DN; i++) { dpos[i*3] = (Math.random() - .5) * (W - 2); dpos[i*3+1] = Math.random() * H; dpos[i*3+2] = (Math.random() - .5) * (D - 2); }
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xfff0d0, size: .035, transparent: true, opacity: .5, depthWrite: false }));
S.add(dust);

// ===== تفعيل الظلال لكل الأجسام الحقيقية =====
S.traverse(o => { if (o.isMesh && !o.material.isMeshBasicMaterial) { o.castShadow = true; o.receiveShadow = true; } });
