---
title: "DLSS 5 Mulai Bocor, Modder Berhasil Jalankan di RTX 40 Series"
summary: "File inti DLSS 5 Neural Rendering dari game NBA 2K27 bocor ke publik dan langsung dibajak komunitas modder untuk dijalankan di kartu grafis RTX 40 Series yang seharusnya tidak didukung."
publishedAt: 2026-08-29T17:00:00+07:00
tags: ["Nvidia", "DLSS", "Gaming", "Modding"]
category: DevTools
author: "TeknoPulse Redaksi"
draft: false
coverImage: "../../assets/images/2026-08-29-dlss5-rtx40-crack-16x9.png"
---

# DLSS 5 Mulai Bocor, Modder Berhasil Jalankan di RTX 40 Series

Siang, pembaca setia! Kabar menarik datang dari dunia modding grafis PC. Nvidia belum resmi mengumumkan DLSS 5, tapi file intinya sudah lebih dulu bocor ke publik — dan dalam hitungan jam, komunitas modder berhasil menjalankannya di luar perangkat keras yang seharusnya didukung.

## Bagaimana Ceritanya?

Semuanya bermula dari game NBA 2K27 versi early access yang dirilis akhir Agustus 2026. Di dalam file instalasi game basket itu, pengguna menemukan sebuah pustaka dinamis bernama nvngx_dlssnr.dll dengan ukuran sekitar 158 MB. File ini kemudian dikonfirmasi sebagai komponen DLSS 5 Neural Rendering versi 310.8.0.0 — teknologi yang dijanjikan Nvidia akan meluncur musim gugur ini untuk seri RTX 50.

Menurut rencana resmi Nvidia, DLSS 5 Neural Rendering seharusnya hanya bisa berjalan di kartu grafis RTX 50 Series berbasis arsitektur Blackwell. Namun komunitas modder di Discord RenoDX segera mengambil tindakan.

## Terobosan di Luar Batas

Pengembang modder bernama Uncle Burrito memimpin upaya pembajakan ini. Dengan pendekatan rekayasa balik, ia menganalisis file DLL dan menemukan bahwa pembatasan sebenarnya bukan karena masalah perangkat keras, melainkan karena Nvidia menanamkan kode biner CUDA yang hanya bisa dibaca oleh arsitektur Blackwell.

Yang menarik, DLSS 5 Neural Rendering menggunakan format data FP8 — dan kartu grafis RTX 40 Series sudah memiliki Tensor Core generasi keempat yang secara natively mendukung FP8. Jadi secara teknis, RTX 4090 dan RTX 4080 sebenarnya mampu menjalankan teknologi ini.

Uncle Burrito lalu mengganti kode biner CUDA yang tidak kompatibel dengan arsitektur Ada Lovelace, menggantinya dengan versi yang bisa dibaca oleh RTX 40 Series. Hasilnya, patch tersebut berhasil menjalankan DLSS 5 Neural Rendering di RTX 4090, RTX 4080 Super, dan sejumlah model RTX 50 Series lainnya.

Komunitas RenoDX kemudian memperluas pencapaian ini. Dalam waktu kurang dari 48 jam, DLSS 5 sudah diuji di lebih dari belasan game, termasuk Control, The Elder Scrolls V: Skyrim, Grand Theft Auto: San Andreas, dan Final Fantasy VII Rebirth.

## Hasil Visuals? Campuran

Dalam uji coba awal, hasilnya bervariasi tergantung jenis game. Di Control, Neural Rendering berhasil menambah detail pada lingkungan seperti gedung dan permukaan tanpa mengorbankan keseluruhan kualitas gambar. Game ini punya geometri yang cukup konsisten sehingga DLSS 5 punya data struktur yang baik untuk diproses.

Namun di game yang lebih bergantung pada karakter, hasilnya kurang ideal. Di Final Fantasy VII Rebirth, wajah karakter utama seperti Cloud bisa berubah secara drastis dari satu frame ke frame berikutnya — mulus sesaat, lalu terasa artifisial di momen berikutnya. Di GTA: San Andreas, karakter CJ malah terlihat lebih sintetis dibanding aslinya.

## Harga Performanya Berat

Salah satu temuan paling signifikan dari uji coba komunitas adalah dampak performa yang sangat besar. Di RTX 5070 Ti saat menjalankan Control pada resolusi 4K, Neural Rendering menyebabkan penurunan frame rate hampir 50% — dari sekitar 95 FPS turun jadi 53 FPS. Di RTX 4090, dari 135 FPS turun jadi 82 FPS.

Angka ini bukan akhir yang menentukan karena patch saat ini masih bersifat eksperimental dan belum melalui proses optimasi resmi dari Nvidia. Teknologi DLSS versi sebelumnya — DLSS 3 dan DLSS 4 — justru meningkatkan performa secara signifikan. DLSS 5 Neural Rendering bekerja dengan cara yang berbeda karena tidak sekadar meningkatkan resolusi atau menghasilkan frame baru, melainkan mengubah tampilan visuals secara menyeluruh menggunakan model AI.

Nvidia sendiri sudah menjelaskan bahwa DLSS 5 dirancang agar pengembang game bisa mengontrol di mana dan bagaimana efek neural rendering diterapkan, berbeda dengan mod komunitas yang menyuntikkannya langsung ke pipeline grafis game tanpa persetujuan pengembang.

## Apa Artinya untuk Pemain PC?

Bagi pemain PC yang penasaran, pencapaian ini menawarkan gambaran awal seperti apa DLSS 5 Neural Rendering di luar demo resmi Nvidia. Namun Nvidia belum menentukan jadwal peluncuran resmi, daftar kartu grafis yang didukung, atau spesifikasi akhir teknologi ini.

Yang jelas, komunitas modding sekali lagi membuktikan bahwa batasan perangkat lunak yang dibuat oleh vendor bisa ditembus oleh kreativitas kolektif pengembang independen. Pertanyaannya sekarang adalah apakah Nvidia akan membiarkan komunitas menjalankan DLSS 5 di RTX 40 Series, atau akan memperketat pembatasan di versi resmi nanti.

Sebagai penutup, jika kamu termasuk yang sabar menanti teknologi baru, mungkin sebaiknya tunggu peluncuran resmi DLSS 5 musim gugur ini. Tapi jika kamu memang ingin menjajal sekarang, komunitas RenoDX sudah membagikan patch dan panduan di Discord mereka — dengan catatan, prepare untuk penurunan frame rate yang cukup signifikan.

Tetap pantau terus untuk perkembangan selanjutnya, dan sampai jumpa di berita berikutnya!

## Sumber

- Tom's Hardware, "DLSS 5 Neural Rendering Berhasil Diuji di Lebih Banyak Game", 29 Agustus 2026
- WCCFtech, "NVIDIA DLSS 5 Cracked Into Control Hours After Modders Found Hidden DLL", 27 Agustus 2026
- IGN India, "Nvidia's DLSS 5 Leaks Online, and Modders Have Already Turned It Into a Slop Filter", 28 Agustus 2026
- VideoCardz, "Leaked DLSS 5 Sudah Berjalan di RTX 40 Series", 28 Agustus 2026
- Techmeme, "Modders Get Experimental NVIDIA DLSS 5 Running in Over a Dozen Games", 28 Agustus 2026
