(() => {
  'use strict';
  const cv = document.getElementById('game'); const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const timeEl = document.getElementById('time'), misEl = document.getElementById('mistakes');
  const overlay = document.getElementById('overlay'), ovTitle = document.getElementById('ov-title'), ovSub = document.getElementById('ov-sub');
  const N = 9, CELL = W / N;
  let puzzle, sol, given, sel, mistakes, over, timer, secs;

  function shuffled(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function valid(b, r, c, v) {
    for (let i = 0; i < 9; i++) if (b[r * 9 + i] === v || b[i * 9 + c] === v) return false;
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (b[(br + i) * 9 + bc + j] === v) return false;
    return true;
  }
  function fill(b) {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (b[r * 9 + c]) continue;
      for (const v of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (valid(b, r, c, v)) { b[r * 9 + c] = v; if (fill(b)) return true; b[r * 9 + c] = 0; }
      }
      return false;
    }
    return true;
  }
  function reset() {
    sol = Array(81).fill(0); fill(sol);
    puzzle = sol.slice(); given = Array(81).fill(false);
    const cells = shuffled([...Array(81).keys()]);
    let removed = 0;
    for (const i of cells) { if (removed >= 45) break; puzzle[i] = 0; given[i] = false; removed++; }
    for (let i = 0; i < 81; i++) if (puzzle[i]) given[i] = true;
    sel = -1; mistakes = 0; over = false; secs = 0; timeEl.textContent = '0'; misEl.textContent = '0';
    if (timer) clearInterval(timer);
    timer = setInterval(() => { if (!over) { secs++; timeEl.textContent = secs; } }, 1000);
    overlay.classList.add('hidden');
  }
  function checkWin() { for (let i = 0; i < 81; i++) if (puzzle[i] !== sol[i]) return false; return true; }
  function draw() {
    ctx.fillStyle = '#1a1c3a'; ctx.fillRect(0, 0, W, H);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const x = c * CELL, y = r * CELL, i = r * 9 + c;
      if (i === sel) { ctx.fillStyle = 'rgba(108,123,255,0.35)'; ctx.fillRect(x, y, CELL, CELL); }
      ctx.strokeStyle = (c % 3 === 0) ? '#6c7bff' : '#34386e'; ctx.lineWidth = (c % 3 === 0) ? 2 : 1;
      ctx.strokeRect(x, y, CELL, CELL);
      if (puzzle[i]) {
        if (over) clearInterval(timer);
        ctx.fillStyle = given[i] ? '#eef0ff' : (puzzle[i] === sol[i] ? '#43d97a' : '#ff5c7a');
        ctx.font = 'bold ' + (CELL * 0.55) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(puzzle[i], x + CELL / 2, y + CELL / 2);
      }
    }
    ctx.strokeStyle = '#6c7bff'; ctx.lineWidth = 3; ctx.strokeRect(0, 0, W, H);
    for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(0, i * 3 * CELL); ctx.lineTo(W, i * 3 * CELL); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i * 3 * CELL, 0); ctx.lineTo(i * 3 * CELL, H); ctx.stroke(); }
  }
  cv.addEventListener('click', e => { const rect = cv.getBoundingClientRect(); const px = (e.clientX - rect.left) / rect.width * W, py = (e.clientY - rect.top) / rect.height * H; sel = Math.floor(py / CELL) * 9 + Math.floor(px / CELL); });
  cv.addEventListener('touchend', e => { const t = e.changedTouches[0]; const rect = cv.getBoundingClientRect(); const px = (t.clientX - rect.left) / rect.width * W, py = (t.clientY - rect.top) / rect.height * H; sel = Math.floor(py / CELL) * 9 + Math.floor(px / CELL); }, { passive: true });
  window.addEventListener('keydown', e => {
    if (over || sel < 0) return;
    if (e.key >= '1' && e.key <= '9') { if (given[sel]) return; const v = +e.key; if (v !== sol[sel]) { mistakes++; misEl.textContent = mistakes; } puzzle[sel] = v; if (checkWin()) { over = true; ovTitle.textContent = '完成！'; ovSub.textContent = '错误 ' + mistakes + ' 次'; overlay.classList.remove('hidden'); } }
    else if (e.key === '0' || e.key === 'Backspace') { if (!given[sel]) puzzle[sel] = 0; }
  });
  document.getElementById('new').addEventListener('click', reset);
  document.getElementById('ov-btn').addEventListener('click', reset);
  function loop() { draw(); requestAnimationFrame(loop); }
  reset(); requestAnimationFrame(loop);
})();
