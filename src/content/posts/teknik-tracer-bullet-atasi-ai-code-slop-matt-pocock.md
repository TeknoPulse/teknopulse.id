---
title: 'Teknik Tracer Bullet: Menjinakkan AI Code Slop dengan Disiplin Pemrograman Klasik'
slug: 'teknik-tracer-bullet-atasi-ai-code-slop-matt-pocock'
summary: 'AI cenderung menghasilkan kode instan dalam skala masif tanpa menguji jalur kritis. Belajar dari The Pragmatic Programmer, Matt Pocock membedah mengapa teknik tracer bullet adalah rem paling efektif melawan halusinasi arsitektur agen AI.'
metaDescription: 'Cara mengatasi AI code slop menggunakan teknik tracer bullet dari The Pragmatic Programmer: buat irisan vertikal end-to-end dengan loop umpan balik cepat.'
publishedAt: 2026-10-16
category: Developer
tags:
  - AI Coding
  - Matt Pocock
  - Software Engineering
  - Agentic Workflows
  - Best Practices
  - TypeScript
author: 'TeknoPulse Redaksi'
draft: true
coverImage: '../../assets/images/teknik-tracer-bullet-atasi-ai-code-slop-matt-pocock-16x9.png'
coverImageAlt: 'Visualisasi aliran eksekusi kode end-to-end dari antarmuka pengguna hingga penyimpanan basis data'
format: 'konteks'
source:
  - name: 'AI Hero — Tracer Bullets: Keeping AI Slop Under Control'
    url: 'https://www.aihero.dev/tracer-bullets'
    primary: true
---

_Catatan: Esai ini membedah panduan teknis Matt Pocock di AI Hero mengenai penerapan prinsip rekayasa perangkat lunak klasik pada era coding agents._

Pernahkah Anda meminta agen AI (*coding agent*) untuk membangun sebuah fitur baru, lalu beberapa menit kemudian mendapati ratusan baris kode baru yang tampak meyakinkan namun sama sekali tidak bisa dijalankan saat dites?

Fenomena ini kian lumrah di kalangan perekayasa perangkat lunak modern. Agen AI memiliki kecenderungan bawaan untuk bersikap menyenangkan (*sycophantic*). Begitu menerima instruksi, model langsung bersemangat merancang solusi menyeluruh sekaligus: membuat skema database, mendefinisikan puluhan *endpoint* API (GET, POST, PUT, DELETE), menambahkan *middleware*, otentikasi, pembatas laju (*rate limiting*), hingga *logging*. 

Namun, ketika kode dijalankan, koneksi database gagal karena format *connection string* keliru atau tipe data kolom tidak cocok. Model membangun terlalu banyak hal di ruang gelap tanpa pernah memvalidasi asumsi dasar. Andrew Hunt dan David Thomas dalam buku legendaris *The Pragmatic Programmer* menyebut kondisi ini sebagai **"outrunning your headlights"**—melaju lebih cepat daripada jangkauan lampu sorot mobil di malam hari.

Dalam edisi terbaru [AI Hero](https://www.aihero.dev/tracer-bullets), Matt Pocock mengingatkan kita pada satu solusi klasik yang terbukti ampuh menjinakkan kekacauan ini: **Tracer Bullets**.

---

## 1. Anatomi "AI Slop": Mengapa Agen AI Terjebak Lapisan Horizontal?

Ketika manusia menginstruksikan AI tanpa pagar pembatas yang ketat, model secara alami menyusun kode secara **horizontal**:

```
Pendekatan Horizontal (AI Alami - Rawan Slop):
┌────────────────────────────────────────────────────────┐
│ Lapisan 1: 10 Endpoint API & Router                    │
├────────────────────────────────────────────────────────┤
│ Lapisan 2: Skema Validasi Zod & DTO                    │
├────────────────────────────────────────────────────────┤
│ Lapisan 3: Middleware Auth & Rate Limiting             │
├────────────────────────────────────────────────────────┤
│ Lapisan 4: Driver Database & ORM (Titik Kegagalan!)   │
└────────────────────────────────────────────────────────┘
Semua lapisan dibangun bersamaan sebelum ada satu pun yang teruji jalan.
```

Beban terberat dari pola horizontal ini jatuh ke pundak manusia: *review burden*. Developer harus menyisir tumpukan kode yang rumit hanya untuk menemukan bahwa fondasi awalnya cacat.

---

## 2. Solusi Pragmatis: Irisan Vertikal Tipis (*Vertical Slices*)

Konsep *tracer bullet* (peluru penjejak) diambil dari dunia militer: peluru fosfor yang menyala dalam gelap di antara rentetan amunisi biasa untuk menunjukkan lintasan tembakan secara langsung ke sasaran.

Dalam rekayasa perangkat lunak, **tracer bullet** adalah irisan fungsionalitas yang sangat kecil namun menembus **seluruh lapisan sistem dari ujung ke ujung (*end-to-end*)**:

```
Pendekatan Tracer Bullet (Vertikal Tipis):
        UI / Trigger
             │
             ▼
        Endpoint API
             │
             ▼
        Logika Bisnis
             │
             ▼
      Database / Driver
             │
             ▼
    [Validasi Seketika!] ──► Jalur terbukti hidup, baru kembangkan fitur lain.
```

Siklus kerjanya sangat terukur:
1. Bangun satu skenario fitur mini yang menembus backend hingga UI.
2. Uji langsung dengan pengujian otomatis (*automated feedback loop*).
3. Evaluasi hasil dan perbaiki kekeliruan arsitektur sedini mungkin.
4. Buka jendela konteks baru (*fresh context window*), lalu lanjutkan ke irisan berikutnya.

---

## 3. Studi Kasus Nyata: Mengimplementasikan Fitur Sistem Berkas

Matt Pocock mendemonstrasikan teknik ini saat menangani isu riil (Issue #161) pada editor videonya, yaitu menambahkan fitur *"Reveal in File System"*:

Alih-alih langsung menyuruh AI menambahkan menu konteks di empat lokasi UI sekaligus, ia memecahnya ke dalam instruksi terstruktur:
1. **Tracer bullet:** Bangun *endpoint* backend yang mengeksekusi perintah PowerShell untuk membuka Windows Explorer dari WSL, lalu sambungkan ke satu tombol uji di UI.
2. Tambahkan aksi ke menu konteks video mandiri.
3. Tambahkan aksi ke dropdown editor video.
4. Tambahkan aksi ke menu konteks video pada bilah samping (*sidebar*).

Dengan menguji langkah pertama terlebih dahulu, Pocock memastikan jembatan antara WSL dan sistem operasi host Windows berjalan mulus sebelum menduplikasi antarmuka di berbagai tempat.

---

## 4. Prompt Siap Pakai untuk Menahan Laju Agen AI

Untuk memaksa agen AI berpikir dalam skala kecil dan bertahap, sisipkan instruksi berikut ke dalam *system prompt* atau berkas skill agen Anda:

> **Tracer Bullets Rule:**  
> *"When building features, do not build horizontal layers in isolation. Build a tiny, end-to-end slice of the feature first that touches all layers (from UI/API down to data storage). Test and seek feedback immediately before expanding out. Validate assumptions early so we never outrun our headlights."*

---

## Sumber dan Rujukan Terkait

* [AI Hero — Tracer Bullets: Keeping AI Slop Under Control](https://www.aihero.dev/tracer-bullets)
* [Andrew Hunt & David Thomas — The Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
* [Matt Pocock Official AI Engineering Resources](https://www.aihero.dev)
