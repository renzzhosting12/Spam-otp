const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Batas uji tercapai. Maksimal 3 permintaan OTP dummy per menit."
  }
});

app.post("/api/request-otp", otpLimiter, (req, res) => {
  // This endpoint is intentionally dummy-only: it never sends SMS or contacts a provider.
  const testLabel = String(req.body?.testLabel || "Sesi lokal").trim().slice(0, 40);
  const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  res.json({
    ok: true,
    mode: "SIMULASI SAJA",
    testLabel,
    otp,
    expiresInSeconds: 120,
    message: "OTP dummy dibuat lokal. Tidak ada SMS yang dikirim."
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: "dummy-only" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`OTP Testing Simulator berjalan di http://localhost:${PORT}`);
  console.log("Mode dummy-only: tidak ada SMS/OTP sungguhan yang dikirim.");
});
