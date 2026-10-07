TeknoPulse — Icon Set (teknopulse.id)
=====================================
Dibuat: 2026-10-08

Konsep
------
Pulse / heartbeat (EKG) — "denyut" berita teknologi.
Tile gradien #FFA34D → #E4502B — turunan langsung palet situs
(primary #F47825, accent #E25936). Mark putih di atas tile.

Isi folder
----------
SVG:
  favicon.svg ................... drop-in untuk situs — salin ke public/favicon.svg
                                  (menimpa favicon Astro bawaan; garis lebih tebal
                                  agar tetap tajam di 16/32 px)
  favicon.ico ................... fallback browser lama (16+32+48 px, siap pakai)
  teknopulse-favicon.svg ........ sama dengan favicon.svg (nama eksplisit)
  teknopulse-icon.svg ........... master SVG full-bleed 1024x1024 — vektor, bisa diedit
  teknopulse-icon-rounded.svg ... versi squircle (sudut membulat, latar transparan)
  teknopulse-mark.svg ........... mark saja (tanpa tile) — untuk header di samping
                                  tulisan "TeknoPulse"
  teknopulse-icon-maskable.svg .. versi maskable (Android/PWA, isi di safe zone 80%)

PNG (latar transparan kecuali disebut lain):
  teknopulse-icon-16.png ........ rounded, sumber garis tebal (favicon fallback)
  teknopulse-icon-32.png ........ rounded, sumber garis tebal (favicon fallback)
  teknopulse-icon-48/64/128/180/192/256/512/1024.png
                                  full-bleed persegi (tanpa sudut transparan);
                                  180 = apple-touch-icon, 192/512 = PWA/manifest
  teknopulse-icon-rounded-128/256/512/1024.png   sudut membulat, transparan
  teknopulse-icon-maskable-192/512.png           maskable
  teknopulse-mark-256/512.png                    mark saja (oranye)
  alternatif/teknopulse-icon-dark.svg / -512.png / -1024.png
                                  tile gelap hangat + garis oranye (untuk latar gelap)
  alternatif/teknopulse-mark-putih.svg / -256.png / -512.png
                                  mark putih (untuk latar gelap)
  preview.png / preview.html .... pratinjau semua varian + simulasi tab browser,
                                  header situs, dan avatar bulat

Pasang di situs (Astro) — cara tercepat
---------------------------------------
1) Salin favicon.svg ke folder public/ (timpa favicon.svg bawaan Astro).
   Selesai — browser modern otomatis memakai favicon SVG ini.
   Opsional: salin juga favicon.ico ke public/ untuk fallback browser lama.
2) Opsional, Apple touch icon: salin teknopulse-icon-180.png menjadi
   public/apple-touch-icon.png, lalu tambahkan di <head> (Layout.astro):
     <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
3) Opsional, PWA/manifest: pakai teknopulse-icon-192.png, -512.png,
   dan maskable 192/512 dengan "purpose": "maskable".
4) Opsional, mark di header: sebelum teks "TeknoPulse" pada nav, mis.:
     <img src="/teknopulse-mark.svg" alt="" width="28" height="28" />
   (mark putih tersedia bila header berganti ke tema gelap)

Edit cepat
----------
- Warna gradien: buka SVG, ubah stop-color pada <linearGradient id="grad">
  (saat ini #FFA34D -> #E4502B).
- Ukuran 16/32 px selalu pakai favicon.svg / sumber garis tebal —
  jangan mengecilkan master (garis 96) untuk ukuran sangat kecil.
- Regenerasi semua PNG dari SVG: jalankan ./render-all.sh
  (butuh resvg-js CLI; lihat komentar di dalam skrip).

Catatan
-------
- Semua file bebas dipakai & diedit untuk teknopulse.id.
- 16/32 px dibuat dari sumber khusus (stroke 112) agar tetap terbaca di tab browser.
- Simulasi pemakaian ada di preview.png: tab browser terang/gelap, header situs,
  avatar bulat, dan uji di latar gelap.
