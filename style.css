(() => {
  'use strict';
  const cv = document.getElementById('game'); const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const youEl = document.getElementById('you'), cpuEl = document.getElementById('cpu');
  const overlay = document.getElementById('overlay'), ovTitle = document.getElementById('ov-title'), ovSub = document.getElementById('ov-sub');
  const N = 8, CELL = W / N;
  const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  let board, over;

  const opp = p => p === 1 ? 2 : 1;
  const inB = (r, c) => r >= 0 && r < N && c >= 0 && c < N;
  function flipsFor(p, r, c) {
    if (board[r * N + c]) return [];
    let total = [];
    for (const [dr, dc] of DIRS) {
      let rr = r + dr, cc = c + dc; const line = [];
      while (inB(rr, cc) && board[rr * N + cc] === opp(p)) { line.push(rr * N + cc); rr += dr; cc += dc; }
      if (inB(rr, cc) && board[rr * N + cc] === p && line.length) total = total.concat(line);
    }
    return total;
  }
  const valid = p => { const m = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!board[r * N + c] && flipsFor(p, r, c).length) m.push([r, c]); return m; };
  function place(p, r, c) { const fl = flipsFor(p, r, c); board[r * N + c] = p; fl.forEach(i => board[i] = p); }
  function counts() { let a = 0, b = 0; for (const v of board) { if (v === 1) a++; else if (v === 2) b++; } return [a, b]; }

  function move(r, c) {
    if (over) return;
    if (board[r * N + c] || !flipsFor(1, r, c).length) return;
    place(1, r, c); updateScore();
    if (endCheck()) return;
    cpuTurn();
  }
  function cpuTurn() {
    const m = valid(2);
    if (m.length) {
      let best = m[0], bestF = -1;
      for (const [r, c] of m) { const f = flipsFor(2, r, c).length; if (f > bestF) { bestF = f; best = [r, c]; } }
      place(2, best[0], best[1]); updateScore();
    }
    if (endCheck()) return;
    if (!valid(1).length) { if (valid(2).length) cpuTurn(); }
  }
  function updateScore() { const [a, b] = counts(); youEl.textContent = a; cpuEl.textContent = b; }
  function endCheck() {
    if (valid(1).length || valid(2).length) return false;
    over = true; const [a, b] = counts();
    ovTitle.textContent = a > b ? '你赢了！' : (b > a ? '电脑赢了' : '平局');
    ovSub.textContent = '黑 ' + a + ' : 白 ' + b; overlay.classList.remove('hidden'); return true;
  }
  function draw() {
    ctx.fillStyle = '#1f7a4d'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#0c3a25'; ctx.lineWidth = 1;
    for (let i = 0; i <= N; i++) { ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke(); }
    const mv = valid(1);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const x = c * CELL, y = r * CELL;
      if (!board[r * N + c]) {
        if (mv.some(([mr, mc]) => mr === r && mc === c)) { ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(x + CELL / 2, y + CELL / 2, CELL * 0.12, 0, Math.PI * 2); ctx.fill(); }
        continue;
      }
      ctx.fillStyle = board[r * N + c] === 1 ? '#111' : '#f5f5f5';
      ctx.beginPath(); ctx.arc(x + CELL / 2, y + CELL / 2, CELL * 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
    }
  }
  cv.addEventListener('click', e => { const rect = cv.getBoundingClientRect(); const px = (e.clientX - rect.left) / rect.width * W, py = (e.clientY - rect.top) / rect.height * H; move(Math.floor(py / CELL), Math.floor(px / CELL)); });
  cv.addEventListener('touchend', e => { const t = e.changedTouches[0]; const rect = cv.getBoundingClientRect(); const px = (t.clientX - rect.left) / rect.width * W, py = (t.clientY - rect.top) / rect.height * H; move(Math.floor(py / CELL), Math.floor(px / CELL)); }, { passive: true });
  function reset() {
    board = Array(N * N).fill(0);
    board[3 * N + 3] = 2; board[4 * N + 4] = 2; board[3 * N + 4] = 1; board[4 * N + 3] = 1;
    over = false; updateScore(); overlay.classList.add('hidden');
  }
  document.getElementById('new').addEventListener('click', reset);
  document.getElementById('ov-btn').addEventListener('click', reset);
  function loop() { draw(); requestAnimationFrame(loop); }
  reset(); requestAnimationFrame(loop);
})();
