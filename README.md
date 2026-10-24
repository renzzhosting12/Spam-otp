# OTP Lab — Testing Simulator

Dashboard modern untuk menguji tampilan log, event simulasi, dan endpoint OTP dummy.

## Fitur
- Simulasi 10–100 event langsung di browser.
- Dashboard total event, berhasil, dibatasi, dan grafik aktivitas.
- Endpoint server membuat OTP dummy 6 digit.
- Rate limit server: maksimal 3 permintaan endpoint OTP per menit per IP.
- Tidak ada integrasi SMS, WhatsApp, nomor telepon, atau penyedia OTP eksternal.

## Persyaratan
- Node.js 18 atau lebih baru
- npm

## Menjalankan lokal
```bash
npm install
npm start
```
Buka `http://localhost:3000`.

## Menjalankan di panel hosting Node.js
1. Upload dan ekstrak ZIP ke folder aplikasi.
2. Atur startup command ke `npm start`.
3. Pastikan versi Node.js minimal 18.
4. Install dependency (`npm install`) jika panel tidak melakukannya otomatis.
5. Buka port yang ditentukan panel melalui environment variable `PORT`.

## Cara menguji
- Klik **Jalankan simulasi** untuk membuat sampai 100 event dummy lokal. Ini tidak mengirim request ke server atau mengirim SMS.
- Klik **Buat satu OTP dummy via server** untuk menguji endpoint server.
- Endpoint `/api/request-otp` dibatasi 3 kali per menit per IP. Setelah batas tercapai, server mengembalikan HTTP 429.
- Klik **Reset data** untuk membersihkan log yang terlihat.

## Catatan keamanan
Project ini sengaja tidak mengirim OTP sungguhan. OTP server hanya untuk demo, tidak disimpan ke database, dan tidak boleh digunakan untuk autentikasi produksi. Untuk sistem OTP produksi, gunakan provider resmi, persetujuan pengguna, verifikasi nomor, logging, dan batasan pengiriman yang sesuai.
