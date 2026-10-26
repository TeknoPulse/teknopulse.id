---
title: 'Dua Buku Rekayasa Perangkat Lunak untuk Engineer di Era AI'
slug: 'buku-pilihan-pocock-era-ai-coding'
summary: 'Dua buku tentang desain perangkat lunak dan praktik pemrograman memberi landasan berguna saat engineer bekerja dengan coding agent.'
metaDescription: 'Kenali dua buku rekayasa perangkat lunak yang membahas desain sistem dan praktik pemrograman, serta relevansinya bagi engineer di era AI coding.'
publishedAt: 2026-10-20
category: Developer
tags:
  - Matt Pocock
  - AI Hero
  - AI Coding
  - Software Engineering
  - Books
  - Best Practices
author: 'TeknoPulse Redaksi'
draft: true
coverImage: '../../assets/images/tiga-buku-wajib-software-engineer-era-ai-matt-pocock-16x9.png'
coverImageAlt: 'Tiga buku teknik bersampul kain usang bertumpuk di meja kayu, ditemani laptop tertutup, kacamata, dan buku catatan'
format: 'konteks'
source:
  - name: 'John Ousterhout — A Philosophy of Software Design'
    url: 'https://web.stanford.edu/~ouster/cgi-bin/book.php'
    primary: true
  - name: 'Pragmatic Bookshelf — The Pragmatic Programmer'
    url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/'
    primary: true
---

_Catatan: Esai ini merangkum dua buku rekayasa perangkat lunak yang tersedia dari penerbit dan penulisnya. Tidak menyatakan bahwa Matt Pocock merekomendasikan kedua buku tersebut._

Di era di mana asisten koding berbasis kecerdasan buatan (_AI coding agents_) mampu menulis ratusan baris kode dalam hitungan detik, banyak developer tergoda untuk meyakini bahwa keterampilan dasar ilmu komputer telah usang. Untuk apa bersusah payah mempelajari arsitektur piranti lunak jika model bahasa besar dapat menyusun kode untuk kita?

Namun, prinsip desain dan praktik rekayasa perangkat lunak tetap penting ketika engineer menggunakan alat bantu AI.

Berikut dua buku klasik dan pokok bahasan yang dapat dipetik dari masing-masingnya—tanpa mengatribusikan rekomendasi kepada Pocock.

---

## 1. A Philosophy of Software Design (John Ousterhout, 2018)

Dalam bukunya, Profesor John Ousterhout memperkenalkan istilah yang sangat berkesan: **"Tactical Tornado"**.

_Tactical tornado_ adalah tipikal programmer yang sangat produktif memompa keluar fitur dengan kecepatan luar biasa tinggi, namun bekerja secara murni taktis tanpa pernah memikirkan masa depan arsitektur. Mereka mengirimkan kode dengan cepat (_ship fast_), tetapi meninggalkan jejak kehancuran (_wake of destruction_) yang harus dibersihkan oleh seluruh anggota tim lainnya.

```
Peran Software Engineer di Era AI:
┌─────────────────────────────────────────────────────────────┐
│ Kemampuan Agen AI: Pemrograman Taktis Cepat (Kecepatan)    │
│ • Menulis boilerplate, implementasi fungsi, scaffold tes    │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼ (Dibutuhkan Kendali Manusia!)
┌─────────────────────────────────────────────────────────────┐
│ Peran Manusia: Pemrograman Strategis (Arsitektur Jangka Panjang)
│ • Merancang Deep Modules (antarmuka sederhana, logika kaya) │
│ • Menjaga bentuk codebase agar mudah diubah dan diperluas   │
└─────────────────────────────────────────────────────────────┘
```

Solusi dari Ousterhout adalah membangun **Deep Modules**—modul dengan antarmuka (_interface_) publik yang sangat sederhana dan konsisten, namun menyembunyikan kompleksitas fungsionalitas yang mendalam di balik dinding implementasinya (seperti cara kerja `JSON.parse`). Ketika sebuah basis kode dirancang dengan modul-modul mendalam, agen AI memiliki ruang yang jauh lebih sempit untuk menciptakan kekacauan arsitektur.

---

## 2. The Pragmatic Programmer (Andy Hunt & Dave Thomas, 1999)

Buku ini membahas siklus pengembangan, komunikasi, dan tanggung jawab profesional. Gagasan tentang kebutuhan yang berubah dapat menjadi pengingat untuk memperjelas spesifikasi sebelum meminta coding agent mengerjakan fitur.

Ketika seorang agen AI membangun hal yang keliru, developer sering kali terburu-buru menyimpulkan bahwa model AI tersebut "salah paham" atau "berhalusinasi". Namun, kenyataannya jauh lebih mendasar: **kesalahan tersebut adalah gejala klasik dari ketiadaan spesifikasi yang jelas (_under-specification_)**.

Pengembang sendiri belum benar-benar memahami apa yang ingin dibangunnya, atau gagal mengomunikasikannya dengan batasan yang presisi.

Itulah mengapa Pocock mengadopsi alur kerja interaktif seperti `/grill-me`—di mana sebelum agen diizinkan menulis satu baris kode pun, agen tersebut harus "menginterogasi" developer terlebih dahulu dengan serangkaian pertanyaan skenario ekstrem (_edge cases_), validasi asumsi, dan pembuatan prototipe cepat.

---

## Menghubungkan prinsip buku dengan kerja bersama AI

Saat memakai coding agent, pemahaman atas desain modul dan praktik pemrograman membantu engineer menilai hasil, memperjelas kebutuhan, serta memutuskan bagian mana yang perlu ditinjau manusia. Ini adalah penerapan editorial atas tema buku, bukan kutipan atau rekomendasi Matt Pocock.

---

## Kesimpulan: Realitas Vibe Code

Jika sebuah aplikasi sebagian besar kodenya ditulis oleh agen AI dan Anda sebagai insinyur tidak pernah benar-benar membaca dan memahami strukturnya secara mendalam, maka kode tersebut secara instan telah menjadi _legacy code_.

Buku-buku klasik di atas ditulis puluhan tahun sebelum era AI, namun masalah yang ingin diselesaikannya tidak peduli siapa yang mengetik kode tersebut—apakah jari manusia atau jaringan saraf buatan. Semakin cepat AI menghasilkan kode, semakin mendesak pula kebutuhan kita untuk kembali ke fondasi rekayasa perangkat lunak yang abadi.

---

## Sumber dan Rujukan Terkait

- [John Ousterhout — A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php)
- [Andrew Hunt & David Thomas — The Pragmatic Programmer (20th Anniversary Edition)](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
- [Matt Pocock — tracer bullet untuk mengatasi AI code slop](https://teknopulse.id/posts/teknik-tracer-bullet-atasi-ai-code-slop-matt-pocock/)
