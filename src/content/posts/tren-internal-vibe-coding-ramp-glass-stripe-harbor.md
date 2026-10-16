---
title: 'Tren Internal Vibe-Coding: Mengapa Ramp dan Stripe Memilih Bangun Platform AI Sendiri'
slug: 'tren-internal-vibe-coding-platforms'
summary: 'Alih-alih membeli SaaS eksternal seperti Lovable atau Replit, Ramp membangun Glass dan Stripe merilis Harbor. Gergely Orosz membongkar fenomena mengapa perusahaan teknologi terdepan lebih memilih meracik platform vibe-coding in-house untuk karyawan non-engineer.'
metaDescription: 'Analisis The Pragmatic Engineer soal tren internal vibe-coding di Ramp (Glass) dan Stripe (Harbor): keamanan data hingga adopsi non-engineer.'
publishedAt: 2026-10-16
category: Software
tags:
  - The Pragmatic Engineer
  - Vibe Coding
  - Ramp
  - Stripe
  - Internal Tools
  - AI Engineering
author: 'TeknoPulse Redaksi'
draft: true
coverImage: '../../assets/images/tren-internal-vibe-coding-ramp-glass-stripe-harbor-16x9.png'
coverImageAlt: 'Ruang kantor modern dengan dinding kaca dan area kerja bersama'
format: 'konteks'
source:
  - name: 'The Pragmatic Engineer — The Pulse: new trend of building internal vibe-coding apps'
    url: 'https://newsletter.pragmaticengineer.com/p/the-pulse-new-trend-of-building-internal-aeb'
    primary: true
---

_Catatan: Tulisan ini mengulas dan membedah laporan investigasi Gergely Orosz dalam The Pragmatic Engineer mengenai pergeseran strategi adopsi AI di Silicon Valley._

Istilah _vibe-coding_—membangun aplikasi perangkat lunak fungsional hanya dengan mendeskripsikan kebutuhan dalam bahasa alami tanpa menulis kode baris demi baris—telah menjadi topik paling hangat di ekosistem pengembang sepanjang tahun 2026. Berbagai vendor komersial seperti Lovable, Replit Agent, v0, dan Retool berlomba-lomba memperebutkan pasar enterprise.

Namun, laporan terbaru dari [The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/the-pulse-new-trend-of-building-internal-aeb) mengungkap tren menarik di kalangan perusahaan teknologi teratas: **mereka tidak membeli produk vendor, melainkan membangun platform vibe-coding mereka sendiri secara internal.**

Dua raksasa teknologi finansial terkemuka, **Ramp** dan **Stripe**, menjadi pelopor nyata dari gelombang ini.

---

## 1. Glass di Ramp dan Harbor di Stripe

Saat mengunjungi kantor pusat Ramp di New York, Gergely Orosz bertemu dengan tim kecil beranggotakan empat engineer yang merancang **Glass**—yang secara internal kerap dijuluki _"internal Lovable"_.

Platform ini memungkinkan karyawan non-teknis (seperti tim operasional, pemasaran, dan kepatuhan) merakit aplikasi internal yang rumit. Salah satu anggota tim pemasaran bahkan berhasil membuat sistem CRM kustom dengan lebih dari 50 bidang data dan filter visual. Proyek Glass sendiri dinilai sangat berhasil hingga Ramp akhirnya meluncurkannya ke publik sebagai produk komersial—bukan CRM kustom tadi.

Hal serupa dilakukan oleh Stripe melalui **Harbor**, sebuah platform pembuatan prototipe berbasis AI yang dirancang oleh **hanya satu orang engineer dalam waktu enam minggu**.

---

## 2. Mengapa Membangun Sendiri Alih-Alih Berlangganan Vendor?

Jika solusi seperti Lovable atau Retool sudah matang, mengapa perusahaan rela mengalokasikan waktu teknis untuk membangun roda dari awal? Orosz merangkum enam alasan fundamental:

1. **Investasi Waktu yang Sangat Terjangkau:** Proyek Harbor hanya membutuhkan satu insinyur selama enam minggu, sementara Glass dirintis oleh dua insinyur dalam hitungan minggu. Bagi perusahaan dengan ratusan developer, investasi ini relatif kecil.
2. **Keamanan Data Sensitif Perusahaan:** Membuka akses database internal, log transaksi finansial, dan data pelanggan ke platform pihak ketiga menimbulkan risiko kepatuhan yang besar. Membangun platform internal membuat eksposur data sensitif ke pihak ketiga jauh lebih terkendali karena sumber data tetap berada di dalam lingkungan yang dikelola perusahaan sendiri.
3. **Penyelarasan Desain (_Design System Libraries_):** Aplikasi internal yang dibuat oleh karyawan secara otomatis mewarisi komponen UI resmi perusahaan (seperti tombol, tipografi, dan navigasi) tanpa perlu konfigurasi tambahan.
4. **Adopsi Massal Karyawan Non-Teknis:** Di Ramp, membuat alat kerja pertama menggunakan Glass bahkan dimasukkan ke dalam kurikulum orientasi karyawan baru (_onboarding_).
5. **Menghindari Birokrasi Pengadaan:** Memilih vendor enterprise sering kali menambah lapisan proses, mulai dari negosiasi harga, peninjauan keamanan, hingga audit kepatuhan, sebelum alat apa pun bisa dipakai.
6. **Membangun Keahlian AI Internal:** Proyek semacam ini menjadi wahana pelatihan berharga bagi insinyur internal untuk memahami arsitektur agen AI, _context routing_, dan orkestrasi model secara langsung.

---

## Pelajaran bagi Ekosistem Teknologi

Fenomena ini menegaskan bahwa nilai terbesar kecerdasan buatan di lingkungan enterprise bukan terletak pada penggantian tenaga kerja teknis, melainkan **pemberdayaan tenaga kerja non-teknis untuk memecahkan hambatan operasional mereka sendiri**.

Ketika para insinyur membangun pagar pengaman (_harness_) dan pustaka komponen yang tepat, setiap divisi perusahaan dapat berinovasi dengan kecepatan yang belum pernah terjadi sebelumnya.

---

## Sumber dan Rujukan Terkait

- [The Pragmatic Engineer — The Pulse: new trend of building “internal vibe-coding apps”](https://newsletter.pragmaticengineer.com/p/the-pulse-new-trend-of-building-internal-aeb)
- [Ramp — Introducing Glass](https://ramp.com/blog/introducing-glass)
- [Stripe — Harbor: Stripe’s AI-assisted prototyping tool](https://stripe.dev/blog/harbor-stripes-ai-assisted-prototyping-tool)
