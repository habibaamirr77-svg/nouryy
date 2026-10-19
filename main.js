// ===== حلقة التشغيل =====
const clock = new THREE.Clock();
let bob = 0, lastStep = 0, T = 0;

(function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), .05); T += dt;

  if (!updateZoom(dt)) {
    const f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - mv.y;
    const s = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + mv.x;
    if (keys.ArrowLeft)  yaw += dt * 1.6;
    if (keys.ArrowRight) yaw -= dt * 1.6;

    const sp = 4 * dt;
    const dx = (-Math.sin(yaw) * f + Math.cos(yaw) * s) * sp;
    const dz = (-Math.cos(yaw) * f - Math.sin(yaw) * s) * sp;
    if (!blocked(C.position.x + dx, C.position.z)) C.position.x += dx;
    if (!blocked(C.position.x, C.position.z + dz)) C.position.z += dz;

    if (f || s) {
      bob += dt * 9;
      const st = Math.floor(bob / Math.PI);
      if (st !== lastStep) { lastStep = st; step(); }
    }
    C.position.y = 1.65 + Math.sin(bob) * .025 * (f || s ? 1 : 0);
    C.rotation.set(pitch, yaw, 0);
  }

  sculpture.rotation.y += dt * .6;
  sculpt2.rotation.y += dt * .3; sculpt3.rotation.y -= dt * .4;
  dust.rotation.y += dt * .01; dust.position.y = Math.sin(T * .2) * .15;
  R.render(S, C);
})();
