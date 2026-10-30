module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const panel = process.env.PTERO_PANEL_URL;
  const token = process.env.PTERO_CLIENT_API_KEY;
  const serverId = process.env.PTERO_SERVER_ID;

  if (!panel || !token || !serverId) {
    return res.status(503).json({
      error: "Konfigurasi backend belum lengkap. Periksa Environment Variables Vercel."
    });
  }

  let base;
  try {
    base = new URL(panel);
    if (base.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    return res.status(500).json({ error: "PTERO_PANEL_URL harus berupa URL HTTPS yang valid." });
  }

  try {
    const url = new URL(
      `/api/client/servers/${encodeURIComponent(serverId)}/resources`,
      base.origin
    );
    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.pterodactyl.v1+json",
        "Content-Type": "application/json"
      }
    });

    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const code = upstream.status === 401 ? 502 : upstream.status;
      return res.status(code).json({
        error: upstream.status === 401
          ? "Panel menolak API key. Pastikan Client API key benar."
          : `Pterodactyl merespons HTTP ${upstream.status}.`
      });
    }

    const a = payload.attributes || {};
    const r = a.resources || {};
    const limits = a.limits || {};
    return res.status(200).json({
      state: a.current_state || "unknown",
      suspended: Boolean(a.is_suspended),
      cpu: Number(r.cpu_absolute || 0),
      memory: Number(r.memory_bytes || 0),
      disk: Number(r.disk_bytes || 0),
      memoryLimit: Number(limits.memory || 0) * 1024 * 1024,
      diskLimit: Number(limits.disk || 0) * 1024 * 1024,
      uptime: Number(r.uptime || 0)
    });
  } catch {
    return res.status(502).json({
      error: "Tidak dapat menghubungi Pterodactyl. Periksa URL panel dan koneksi server."
    });
  }
};
