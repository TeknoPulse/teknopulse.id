---
title: "GitHub Pindahkan Copilot ke Rust dengan AI, Satu Engineer Selesai dalam 14,5 Minggu"
summary: "GitHub menyelesaikan migrasi runtime Copilot dari TypeScript ke 832.378 baris Rust dalam 14,5 minggu, dengan satu engineer sebagai penggerak utama dan AI yang menulis sebagian besar kode. Performa melonjak drastis."
publishedAt: 2026-09-28T17:00:00+07:00
tags: ["GitHub", "Copilot", "Rust", "AI Agents", "TypeScript", "Developer Tools"]
category: Developer
author: "TeknoPulse Redaksi"
draft: false
coverImage: '../../assets/images/placeholder-16x9.png'
---

GitHub resmi mengumumkan keberhasilan migrasi besar-besaran pada 16 September 2026. Runtime agen yang menjadi otak di balik GitHub Copilot CLI, Copilot app, dan Copilot SDK telah ditulis ulang sepenuhnya dari TypeScript ke lebih dari 832.000 baris Rust. Yang paling mengejutkan: sebagian besar kode ditulis oleh AI, dan proyek ini diselesaikan oleh satu engineer utama.

## Bukan Sekadar Ganti Bahasa

Langkah ini bukan sekadar tren atau eksperimen. Menurut Stephen Toub, Distinguished Engineer Microsoft yang memimpin proyek ini, arsitektur lama berbasis TypeScript di atas Node.js dan V8 punya masalah mendasar. Setiap kali SDK Copilot digunakan di bahasa seperti C#, Python, Go, atau Rust, sistem harus menjalankan proses Node.js terpisah sebagai perantara. Satu sesi SDK memakan tambahan setidaknya 100 MB memori, dan setiap event, pesan, hingga pembacaan file harus melewati batas antarproses.

Dengan Rust, semua itu hilang. Runtime baru mengekspos 19 fungsi C ABI yang langsung dipanggil SDK tanpa proses tambahan. Hasilnya terasa nyata di angka-angka performa yang dipublikasikan GitHub.

## Lonjakan Performa yang Drastis

Berikut perbandingan yang dipublikasikan oleh Toub dalam dokumentasi teknis proyek:

- Pembuatan sesi, eksekusi satu langkah, dan penutupan: dari 5,25 detik jadi 292 milidetik.
-Throughput: dari 7,55 siklus per detik (TypeScript) melonjak jadi 120 siklus per detik (Rust dalam proses).
- Memori untuk sepuluh klien secara bersamaan: dari 1.383 MB turun jadi 126 MB.

Dengan kata lain, sistem yang sama kini mampu menangani hampir 16 kali lebih banyak beban kerja per detik, dan konsumsi memorinya menyusut hingga lebih dari 90 persen.

## Proses 14,5 Minggu, $120.000, dan Seorang Engineer

Migrasi ini dimulai pada 12 Mei 2026 dan rampung pada 21 Agustus 2026. Selama rentang waktu tersebut, 128 pull request berhasil digabungkan ke branch utama, dan 135 rilis dipublikasikan secara bertahap. Tim tidak melakukan migrasi besar-besaran dalam satu langkah, melainkan mengganti satu per satu komponen di balik antarmuka yang stabil sehingga kode lama dan baru bisa hidup berdampingan.

Biaya token AI yang digunakan tercatat sekitar $120.000 untuk 136,3 miliar token, dengan tingkat prompt cache hit mencapai 96,22 persen yang membantu menekan tagihan. Meskipun biaya itu terdengar besar, Toub menegaskan bahwa alternatif sebelum adanya agen AI akan membutuhkan tim selama satu hingga dua tahun — jauh melampaui kapasitas satu engineer.

Dalam sesi kerja yang tercatat, agen-agen AI melakukan 630.423 panggilan shell, 590.988 pembacaan file, dan 281.783 pencarian dengan ripgrep. Yang menarik,GitHub mencatat bahwa agen menghabiskan waktu eksplorasi sekitar 10 kali lipat lebih banyak dibandingkan menulis kode baru.

## Tes Lama yang Jadi Penuntun

Migrasi ini tidak sembarangan. GitHub mengandalkan 174.675 tes end-to-end TypeScript yang sudah ada sebagai oracle verifikasi. Setiap komponen baru langsung diuji terhadap suite tes tersebut agar perilaku tidak berubah. Meskipun begitu, puluhan regresi tetap muncul selama proses dan semuanya sudah ditelusuri serta diperbaiki sebelum 14 September 2026.

Toub menekankan bahwa proyek ini tidak akan berhasil tanpa tes yang bisa dipercaya sebagai acuan perilaku. Kualitas kode yang dihasilkan AI sangat bergantung pada kelengkapan pengujian — tanpa perangkat prediksi perilaku yang andal, generasi kode semurah apapun tidak akan memberikan nilai nyata.

## Implikasi untuk Dunia Development

Migrasi Copilot runtime ini bukan sekadar kemenangan performa. Ini adalah bukti nyata bahwa ekonomi rekayasa perangkat lunak sedang bergeser. Proyek yang dulunya dianggap terlalu mahal atau terlalu berisiko untuk ditulis ulang kini bisa dikejar oleh satu engineer selama beberapa bulan, asalkan ada tes yang solid dan panduan manusia yang jelas.

Toub sendiri tidak memposisikan ini sebagai perubahan paradigma yang radikal. Agn AI tidak serta-merta menggantikan engineer — mereka mengubah harga proyek. Keputusan arsitektural, desain sistem, dan validasi akhir tetap di tangan manusia. Namun skala pekerjaan yang sekarang bisa ditangani oleh satu orang dengan bantuan AI telah benar-benar berubah.

---

## Sumber

1. GitHub Blog — "Migrating the GitHub Copilot runtime to Rust, using Copilot" (16 September 2026)
2. The Machine Herald — "GitHub Rewrites the Copilot Agent Runtime Into 800,000 Lines of Rust" (21 September 2026)
3. TechGig — "AI agents enable major Rust rewrites for GitHub, Anthropic" (18 September 2026)
4. Beyond the News — "GitHub rewrote Copilot's 800,000-line agent runtime in Rust" (21 September 2026)
