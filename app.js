const $ = (id) => document.getElementById(id);
let batchSize = 100;
let events = [];
let eventId = 0;
const fmtTime = (date = new Date()) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

function syncBatch() {
  $("batchValue").textContent = batchSize;
  $("batchRange").value = batchSize;
  $("minusBtn").disabled = batchSize <= 10;
  $("plusBtn").disabled = batchSize >= 100;
}
$("batchRange").addEventListener("input", (e) => { batchSize = Number(e.target.value); syncBatch(); });
$("minusBtn").addEventListener("click", () => { batchSize = Math.max(10, batchSize - 10); syncBatch(); });
$("plusBtn").addEventListener("click", () => { batchSize = Math.min(100, batchSize + 10); syncBatch(); });

function addEvent(label, status, mode = "BATCH SIM") {
  events.unshift({ id: ++eventId, label, status, mode, time: fmtTime() });
  if (events.length > 150) events.length = 150;
}
function render() {
  const total = events.length;
  const success = events.filter(e => e.status === "Berhasil").length;
  const limited = events.filter(e => e.status === "Dibatasi").length;
  $("totalCount").textContent = total.toLocaleString("id-ID");
  $("successCount").textContent = success.toLocaleString("id-ID");
  $("limitedCount").textContent = limited.toLocaleString("id-ID");
  $("chartTotal").textContent = total.toLocaleString("id-ID");
  $("eventCount").textContent = `${total} events`;
  const rows = events.slice(0, 9);
  $("eventRows").innerHTML = rows.length ? rows.map(e => `<tr><td><b>#EVT-${String(e.id).padStart(4,"0")}</b></td><td>${escapeHtml(e.label)}</td><td>${escapeHtml(e.mode)}</td><td><span class="status ${e.status === "Berhasil" ? "ok" : "limited"}">${e.status}</span></td><td>${e.time}</td></tr>`).join("") : '<tr><td colspan="5" class="empty-row">Belum ada aktivitas. Jalankan simulasi untuk mulai.</td></tr>';
  renderChart(success, limited);
}
function renderChart(success, limited) {
  const chart = $("chartBars");
  if (!events.length) { chart.innerHTML = '<div class="empty-chart">Jalankan simulasi untuk melihat aktivitas</div>'; return; }
  const chunks = [];
  for (let i = 0; i < 10; i++) {
    const start = Math.floor(i * events.length / 10);
    const end = Math.floor((i + 1) * events.length / 10);
    const subset = events.slice(start, Math.max(start + 1, end));
    chunks.push({ ok: subset.filter(e => e.status === "Berhasil").length, limited: subset.filter(e => e.status === "Dibatasi").length });
  }
  const max = Math.max(1, ...chunks.map(c => c.ok + c.limited));
  chart.innerHTML = chunks.map(c => {
    const okHeight = Math.max(2, c.ok / max * 100);
    const limHeight = c.limited ? Math.max(3, c.limited / max * 100) : 0;
    return `<div class="bar-group"><div class="bar" title="${c.ok} berhasil" style="height:${okHeight}%"></div><div class="bar limited" title="${c.limited} dibatasi" style="height:${limHeight}%"></div></div>`;
  }).join("");
}
$("runSimulation").addEventListener("click", () => {
  const label = $("testLabel").value.trim().slice(0, 40) || "Sesi simulasi";
  // Local-only synthetic records; this loop makes no network requests.
  for (let i = 0; i < batchSize; i++) {
    const isLimited = (i + 1) % 10 === 0; // illustrative rate-limit outcomes
    addEvent(label, isLimited ? "Dibatasi" : "Berhasil");
  }
  render();
  $("runSimulation").innerHTML = '<span>✓</span> Simulasi selesai <b>→</b>';
  setTimeout(() => { $("runSimulation").innerHTML = '<span>▶</span> Jalankan simulasi <b>→</b>'; }, 1400);
});

$("requestOtp").addEventListener("click", async () => {
  const result = $("otpResult");
  result.classList.remove("hidden");
  result.textContent = "Membuat OTP dummy...";
  try {
    const response = await fetch("/api/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testLabel: $("testLabel").value.trim() || "Sesi lokal" })
    });
    const data = await response.json();
    if (!response.ok) {
      result.textContent = data.error || "Permintaan dibatasi. Coba lagi nanti.";
      addEvent("Permintaan server", "Dibatasi", "SERVER DEMO");
    } else {
      result.innerHTML = `<div>OTP dummy berhasil dibuat · berlaku ${data.expiresInSeconds} detik</div><div class="otp-code">${escapeHtml(data.otp)}</div><div>${escapeHtml(data.message)}</div>`;
      addEvent(data.testLabel, "Berhasil", "SERVER DEMO");
    }
    render();
  } catch (_err) {
    result.textContent = "Server belum aktif. Jalankan npm start lalu buka ulang halaman.";
  }
});
$("clearBtn").addEventListener("click", () => {
  events = [];
  eventId = 0;
  $("otpResult").classList.add("hidden");
  render();
});
syncBatch();
render();
