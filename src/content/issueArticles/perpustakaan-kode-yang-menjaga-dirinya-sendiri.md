---
title: 'Perpustakaan kode yang menjaga dirinya sendiri'
dek: 'Sebuah paket kecil dipakai ratusan proyek, dirawat oleh dua orang, dan tidak menghasilkan uang. Bagaimana ia bertahan?'
topic: 'open-source'
kicker: 'Laporan Utama'
author: 'Bagas Wirawan'
publishedAt: 2026-10-11
issue: 1
format: 'laporan'
demo: true
---

Paket itu bernama `rawat`. Ia tidak benar-benar ada. Dalam skenario ini, ia adalah pustaka kecil berisi fungsi untuk membersihkan data sebelum disimpan. Ukurannya tidak sampai seratus kilobyte, dokumentasinya sederhana, dan tidak ada perusahaan besar yang berdiri di belakangnya.

Namun `rawat` dipakai oleh ratusan proyek. Setiap minggu, dua orang membuka daftar masalah, menutup laporan duplikat, memperbarui dependensi, dan menulis catatan rilis. Tidak ada yang membayar mereka.

## Beban yang tidak terlihat

Pemeliharaan open source sering dibayangkan sebagai pekerjaan menulis kode baru. Kenyataannya, sebagian besar waktu habis untuk hal lain: menjawab pertanyaan, memeriksa perubahan kecil, dan memastikan pembaruan tidak merusak pengguna.

Beban itu tidak terlihat karena tidak menghasilkan fitur. Tetapi ketika perawatan berhenti, efeknya langsung terasa. Proyek yang bergantung pada `rawat` harus mencari pengganti, menulis ulang bagian kode, atau tetap memakai versi lama yang punya celah keamanan.

> Infrastruktur digital paling penting sering kali tidak punya anggaran pemasaran, hanya daftar masalah yang panjang.

## Tiga cara bertahan

Skenario ini membayangkan tiga model. Pertama, donasi langsung dari pengguna. Model ini membantu, tetapi pendapatannya tidak stabil. Kedua, dukungan perusahaan yang memakai paket itu. Model ini lebih stabil, tetapi bisa menciptakan ketergantungan pada satu penyandang dana. Ketiga, layanan berbayar untuk hal-hal di luar paket: audit, integrasi, atau jaminan waktu tanggap.

`rawat` memilih kombinasi ketiganya. Tidak ada yang cukup untuk membuat dua perawatnya bekerja penuh waktu, tetapi cukup untuk membayar waktu yang mereka habiskan setiap minggu.

## Siapa yang bertanggung jawab?

Pertanyaan yang lebih sulit adalah tanggung jawab. Pengguna sering menganggap paket open source sebagai layanan gratis. Perawat menganggapnya sebagai sumbangan. Ketika terjadi masalah, kedua pihak bisa merasa pihak lain yang seharusnya bertindak.

Beberapa proyek mencoba menjawab dengan kontrak yang jelas: apa yang dijanjikan, apa yang tidak, dan bagaimana cara melaporkan masalah. Kontrak itu tidak menyelesaikan semua konflik, tetapi membuat ekspektasi lebih jujur.

## Fondasi yang perlu dirawat

Di akhir skenario, `rawat` masih hidup. Bukan karena ada penyelamat, tetapi karena cukup banyak orang memutuskan bahwa memelihara fondasi adalah pekerjaan yang layak dibayar.

Cerita ini tidak memberi resep tunggal untuk semua proyek open source. Ia hanya mengingatkan bahwa setiap kali kita memasang sebuah dependensi, kita ikut bergantung pada seseorang yang mungkin sedang kelelahan. Mengetahui siapa mereka adalah langkah pertama yang sering terlewat.
