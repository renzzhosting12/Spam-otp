PTERODACTYL → VERCEL BRIDGE (READ-ONLY)

Isi:
- index.html: dashboard monitor.
- api/status.js: backend Vercel Function yang membaca resource satu server dari Client API.
- vercel.json: konfigurasi Vercel.

Deploy:
1. Upload isi folder project ini ke repository GitHub baru.
2. Import repository itu di Vercel. Framework Preset: Other.
3. Di Vercel Project → Settings → Environment Variables, tambahkan:
   PTERO_PANEL_URL = https://yatimpiatumamaklu.pteroq.xyz
   PTERO_CLIENT_API_KEY = Client API key milik akun Pterodactyl kamu
   PTERO_SERVER_ID = identifier server dari URL halaman server di panel
4. Pilih Production (dan Preview bila diperlukan), lalu Save.
5. Redeploy project.
6. Buka website Vercel. Endpoint /api/status harus mengembalikan JSON status resource.

Mendapatkan Client API key:
- Login ke panel menggunakan akun milikmu.
- Buka Account → API Credentials (umumnya /account/api).
- Buat Client API key. Jangan gunakan Application API key untuk endpoint Client API.
- Simpan token hanya di Environment Variables Vercel. Jangan tempel token di chat, GitHub, HTML, atau JavaScript browser.

Catatan:
- Integrasi ini hanya GET/read-only untuk satu server.
- Tidak ada endpoint start/stop/restart, console command, pengelolaan file, spam, OTP, atau aksi terhadap akun lain.
- PTERO_SERVER_ID adalah identifier server (biasanya 8 karakter pada Pterodactyl 1.x; gunakan identifier/UUID yang ditampilkan URL panel).
- Bila versi panel berbeda, API Client tetap memakai path /api/client; cek dokumentasi versi panel.
- Jika muncul 401: API key salah/jenis salah.
- Jika muncul 403: akun tidak punya akses ke server.
- Jika muncul 404: server identifier salah.
- Jangan bagikan API key atau kredensial login kepada siapa pun.
