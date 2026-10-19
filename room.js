// ===== القاعة: أرضية، جدران، سقف، إضاءة =====
const glow = new THREE.MeshBasicMaterial({ color: 0xfff2d8 });
const wallM = std({ color: 0xf1ede6, roughness: .95 });
const accM  = std({ color: 0x3b4a47, roughness: .95 });
const baseM = std({ color: 0xffffff, roughness: .6 });

// أرضية باركيه
const floorTex = cv(1024, 1024, (g, w, h) => {
  const rows = 8;
  for (let i = 0; i < rows; i++) for (let j = 0; j < 4; j++) {
    g.fillStyle = `hsl(28,${42 + Math.random()*10}%,${34 + Math.random()*10}%)`;
    const pw = w/4, ph = h/rows, x = ((j + (i % 2) * .5) % 4) * pw;
    g.fillRect(x, i*ph, pw-2, ph-2);
    if (x + pw > w) g.fillRect(x - w, i*ph, pw-2, ph-2);
  }
});
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(6, 4);
floorTex.anisotropy = 8;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std({ map: floorTex, roughness: .35, metalness: .05 }));
floor.rotation.x = -Math.PI / 2;
S.add(floor);

// سقف
const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std({ color: 0xfaf8f4, roughness: 1 }));
ceil.rotation.x = Math.PI / 2; ceil.position.y = H;
S.add(ceil);

// جدران
box(W, H, .3, accM,  0, H/2, -D/2 - .15);
box(W, H, .3, wallM, 0, H/2,  D/2 + .15);
box(.3, H, D, wallM, -W/2 - .15, H/2, 0);
box(.3, H, D, wallM,  W/2 + .15, H/2, 0);

// نِعال الجدران (baseboards)
box(W, .18, .06, baseM, 0, .09, -D/2 + .03);
box(W, .18, .06, baseM, 0, .09,  D/2 - .03);
box(.06, .18, D, baseM, -W/2 + .03, .09, 0);
box(.06, .18, D, baseM,  W/2 - .03, .09, 0);

// أعمدة
[[-4.5, -8.6], [4.5, -8.6]].forEach(([x, z]) => box(.5, H, .5, wallM, x, H/2, z));

// إضاءة السقف
for (let x = -8; x <= 8; x += 8) for (let z = -5; z <= 5; z += 5) box(3, .05, .5, glow, x, H - .03, z);
S.add(new THREE.HemisphereLight(0xfff4e0, 0x4a3a2a, .55));
[[-8,-3],[8,-3],[0,4]].forEach(([x, z]) => {
  const l = new THREE.PointLight(0xffe6c0, .6, 18, 1.6);
  l.position.set(x, H - .6, z);
  S.add(l);
});

// ===== إضاءة موجهة بظلال حقيقية =====
const shadowLight = new THREE.SpotLight(0xfff0d8, 1.4, 40, 1.05, .6, 1);
shadowLight.position.set(6, H - .3, 5);
shadowLight.target.position.set(0, 0, 0);
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.set(1024, 1024);
shadowLight.shadow.bias = -.0004;
S.add(shadowLight, shadowLight.target);

// ===== عوارض السقف =====
const beamM = std({ color: 0x6b4a2e, roughness: .6 });
[-7.5, -2.5, 2.5, 7.5].forEach(z => box(W, .25, .35, beamM, 0, H - .125, z));

// ===== نوافذ بضوء النهار =====
const sky = cv(128, 128, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#9ec9ff'); gr.addColorStop(1, '#f4f9ff');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.7)';
  [[30,40,18],[60,50,24],[95,35,16],[80,85,22]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill(); });
});
[-1, 1].forEach(side => {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), new THREE.MeshBasicMaterial({ map: sky }));
  glass.position.z = .01; g.add(glass);
  box(2.6, .12, .1, baseM, 0,  1.3, .05, g); box(2.6, .12, .1, baseM, 0, -1.3, .05, g);
  box(.12, 2.6, .1, baseM, -1.25, 0, .05, g); box(.12, 2.6, .1, baseM, 1.25, 0, .05, g);
  box(.06, 2.6, .06, baseM, 0, 0, .05, g); box(2.4, .06, .06, baseM, 0, 0, .05, g);
  box(2.9, .1, .35, baseM, 0, -1.35, .15, g);
  g.position.set(side * (W/2 - .03), 2.4, 0);
  g.rotation.y = side < 0 ? Math.PI/2 : -Math.PI/2;
  S.add(g);
});
