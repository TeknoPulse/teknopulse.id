---
title: '3 Buku Klasik yang Wajib Dibaca Software Engineer di Era AI Coding: Refleksi Matt Pocock'
slug: 'tiga-buku-wajib-software-engineer-era-ai-matt-pocock'
summary: 'Di tengah maraknya coding agent, Matt Pocock justru kembali ke buku klasik. Dari konsep tactical tornado Ousterhout, jebakan under-specification Hunt & Thomas, hingga ubiquitous language Evans—prinsip dasar kini 10x lebih krusial.'
metaDescription: 'Mengapa buku klasik pemrograman jadi senjata utama software engineer era AI: bedah A Philosophy of Software Design, The Pragmatic Programmer, dan DDD.'
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
  - name: "AI Hero — 3 books I'd hand every engineer using AI"
    url: 'https://www.aihero.dev/s/matt-bookshelf'
    primary: true
---

_Catatan: Esai reflektif ini disarikan dan dikembangkan dari buletin teknis Matt Pocock di AI Hero mengenai relevansi literatur klasik rekayasa perangkat lunak di tengah gelombang AI coding._

Di era di mana asisten koding berbasis kecerdasan buatan (_AI coding agents_) mampu menulis ratusan baris kode dalam hitungan detik, banyak developer tergoda untuk meyakini bahwa keterampilan dasar ilmu komputer telah usang. Untuk apa bersusah payah mempelajari arsitektur piranti lunak jika model bahasa besar dapat menyusun kode untuk kita?

Namun, bagi Matt Pocock—pencipta Total TypeScript dan figur di balik [AI Hero](https://www.aihero.dev/s/matt-bookshelf)—fakta di lapangan justru menunjukkan hal yang sebaliknya.

Sepanjang tahun 2026, di tengah fokus intensifnya mengeksplorasi batas-batas terdepan rekayasa AI, buku-buku yang paling berharga di rak kerjanya bukanlah buku baru tentang _prompt engineering_, melainkan **karya-karya klasik rekayasa perangkat lunak yang ditulis puluhan tahun silam**.

Pocock merumuskan tiga buku esensial yang wajib dibaca oleh setiap _software engineer_ yang menggunakan alat bantu AI hari ini, lengkap dengan cara penerapannya di ruang kerja modern.

---

## 1. A Philosophy of Software Design (John Ousterhout, 2018)

Dalam bukunya, Profesor John Ousterhout memperkenalkan istilah yang sangat berkesan: **"Tactical Tornado"**.

_Tactical tornado_ adalah tipikal programmer yang sangat produktif memompa keluar fitur dengan kecepatan luar biasa tinggi, namun bekerja secara murni taktis tanpa pernah memikirkan masa depan arsitektur. Mereka mengirimkan kode dengan cepat (_ship fast_), tetapi meninggalkan jejak kehancuran (_wake of destruction_) yang harus dibersihkan oleh seluruh anggota tim lainnya.

Pocock mencatat:

> _"Bagi saya, itulah persisnya perilaku agen AI ketika dibiarkan berjalan sendiri tanpa kendali. Agen AI adalah tornado taktis sempurna: menghasilkan volume pekerjaan yang mencengangkan tanpa sedikit pun kepedulian terhadap pemeliharaan kode di masa depan."_

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

Kutipan yang paling sering diulang Pocock dari buku legendaris ini adalah satu kalimat sederhana namun menghujam:

> _"No one knows exactly what they want." (Tidak ada yang benar-benar tahu apa yang mereka inginkan)._

Ketika seorang agen AI membangun hal yang keliru, developer sering kali terburu-buru menyimpulkan bahwa model AI tersebut "salah paham" atau "berhalusinasi". Namun, kenyataannya jauh lebih mendasar: **kesalahan tersebut adalah gejala klasik dari ketiadaan spesifikasi yang jelas (_under-specification_)**.

Pengembang sendiri belum benar-benar memahami apa yang ingin dibangunnya, atau gagal mengomunikasikannya dengan batasan yang presisi.

Itulah mengapa Pocock mengadopsi alur kerja interaktif seperti `/grill-me`—di mana sebelum agen diizinkan menulis satu baris kode pun, agen tersebut harus "menginterogasi" developer terlebih dahulu dengan serangkaian pertanyaan skenario ekstrem (_edge cases_), validasi asumsi, dan pembuatan prototipe cepat.

---

## 3. Domain-Driven Design (Eric Evans, 2003)

Prinsip terpenting dari buku klasik Eric Evans adalah **Ubiquitous Language (Bahasa yang Ada di Mana-Mana)**: kata-kata yang digunakan oleh tim bisnis dalam rapat perencanaan harus menjadi kata-kata yang sama persis yang tertulis di dalam baris kode.

Menamai variabel dan konsep bisnis adalah hal tersulit dalam ilmu komputer; menjaganya tetap konsisten di seluruh proyek adalah hal yang jauh lebih sulit lagi.

Dengan AI, Pocock memanfaatkan pendekatan dokumentasi terstruktur (_doc-driven grilling_): alih-alih mendefinisikan istilah secara kaku di awal, glosarium bahasa bisnis dibiarkan muncul secara alami melalui diskusi awal bersama agen. Glosarium istilah yang konsisten inilah yang kemudian menjadi kompas penunjuk jalan bagi agen AI agar tidak melenceng dari konteks bisnis saat bekerja mandiri.

---

## Kesimpulan: Realitas Vibe Code

Pocock menutup refleksinya dengan pandangan yang tajam dan provokatif:

> _"A vibe-coded codebase is indistinguishable from a legacy codebase."_  
> _(Basis kode hasil vibe-coding pada hakikatnya tidak bisa dibedakan dari legacy codebase)._

Jika sebuah aplikasi sebagian besar kodenya ditulis oleh agen AI dan Anda sebagai insinyur tidak pernah benar-benar membaca dan memahami strukturnya secara mendalam, maka kode tersebut secara instan telah menjadi _legacy code_.

Buku-buku klasik di atas ditulis puluhan tahun sebelum era AI, namun masalah yang ingin diselesaikannya tidak peduli siapa yang mengetik kode tersebut—apakah jari manusia atau jaringan saraf buatan. Semakin cepat AI menghasilkan kode, semakin mendesak pula kebutuhan kita untuk kembali ke fondasi rekayasa perangkat lunak yang abadi.

---

## Sumber dan Rujukan Terkait

- [AI Hero — 3 books I'd hand every engineer using AI](https://www.aihero.dev/s/matt-bookshelf)
- [John Ousterhout — A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php)
- [Andrew Hunt & David Thomas — The Pragmatic Programmer (20th Anniversary Edition)](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
- [Eric Evans — Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.domainlanguage.com/ddd/)
