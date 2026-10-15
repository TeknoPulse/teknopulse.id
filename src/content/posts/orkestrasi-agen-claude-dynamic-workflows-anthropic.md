---
title: 'Orkestrasi Multi-Agen Claude: Membedah Dynamic Workflows Anthropic Berbasis Filosofi Unix'
slug: 'orkestrasi-agen-claude-dynamic-workflows-anthropic'
summary: 'Anthropic memperkenalkan Dynamic Workflows di AI Engineer New York 2026—mengadopsi filosofi Unix untuk membiarkan Claude mendesain topologi multi-agen sendiri, memecah tugas secara terisolasi, dan mengkristalkan memori lewat dreaming.'
metaDescription: 'Bedah mendalam Dynamic Workflows Anthropic untuk Claude Managed Agents: topologi agen mandiri, isolasi konteks, kontrol anggaran, dan fitur dreaming.'
publishedAt: 2026-10-13
category: Developer
tags:
  - Anthropic
  - Claude
  - Multi-Agent
  - AI Agents
  - Dynamic Workflows
  - Software Architecture
  - Latent Space
author: 'TeknoPulse Redaksi'
draft: true
coverImage: '../../assets/images/orkestrasi-agen-claude-dynamic-workflows-anthropic-16x9.png'
coverImageAlt: 'Manifold klep kuningan berpatina dengan pipa tembaga di dinding plester terkelupas bengkel tua, kunci pas tergeletak di bangku kayu berdebu'
format: 'konteks'
source:
  - name: 'Latent Space — How Anthropic’s Dynamic Workflows Coordinate Claude Agents'
    url: 'https://www.latent.space/p/claude-dynamic-workflows'
    primary: true
---

_Catatan: Tulisan ini mengulas dan membedah paparan teknis Anthropic dalam workshop AI Engineer New York 2026 yang dilaporkan oleh Latent Space._

Bagi para perekayasa perangkat lunak yang intensif membangun sistem berbasis agen AI (_agentic workflows_), ada satu keluhan umum yang kian nyata di ruang kerja: **manusia kini menjadi simpul kemacetan (_bottleneck_) terbesar.**

Ketika satu tim menjalankan puluhan agen otonom untuk merefaktor kode, menambal celah keamanan, dan menulis pengujian, _pull request_ (PR) di repositori GitHub menumpuk dalam jumlah ratusan. Developer terjebak meninjau PR tanpa henti hanya untuk memastikan para agen tidak saling bertabrakan atau merusak arsitektur dasar.

Dalam lokakarya pembuka [AI Engineer New York 2026](https://www.latent.space/p/claude-dynamic-workflows), dua insinyur dari tim teknis Anthropic—CJ Avilla dan Harrison Stall—memperkenalkan terobosan orkestrasi terbaru untuk Claude Managed Agents: **Dynamic Workflows** (atau disingkat **"Flows"**).

Bukan sekadar perbaikan API biasa, fitur ini membawa pergeseran mendasar dalam cara kita memandang koordinasi multi-agen: **membiarkan Claude merancang dan mengelola topologi multi-agennya sendiri secara dinamis**, terinspirasi langsung dari filosofi sistem operasi Unix puluhan tahun silam.

---

## 1. Pelajaran dari Ken Thompson dan Linus Torvalds: Agen Butuh Struktur Unix

Presentasi Anthropic dibuka dengan analogi sejarah komputasi yang sangat relevan. Ketika Ken Thompson dan Dennis Ritchie merancang Unix di Bell Labs, mereka tidak membangun satu program raksasa yang serba bisa. Mereka menciptakan sistem operasi di mana setiap modul kecil melakukan satu tugas dengan sangat baik (_do one thing and do it well_), memiliki batas status yang terisolasi, dan dapat dihubungkan secara modular.

Hal serupa terjadi ketika Linux berevolusi dari proyek solo Linus Torvalds menjadi ekosistem raksasa: sistem membutuhkan tingkatan _maintainer_ tepercaya yang memiliki yurisdiksi atas subsistem masing-masing.

Pendekatan multi-agen konvensional selama ini cenderung kaku:

1. **Model Roster Statis (_Static Roster_):** Pengembang harus secara manual mendefinisikan koordinator, menentukan agen A untuk menulis kode, agen B untuk meninjau, dan agen C untuk membuat dokumentasi.
2. **Keterbatasan Skala:** Begitu kompleksitas pekerjaan melonjak—misalnya memodifikasi sistem monolitik dengan ribuan dependensi—rantai koordinasi manual ini runtuh di bawah beban _prompt bloat_ dan kebingungan konteks antar-agen.

Melalui Dynamic Workflows, Anthropic mengubah paradigma tersebut: **Claude memimpin proses dengan bertindak sebagai arsitek orkestrasi.** Agen utama (_lead agent_) menganalisis objektif, menyusun rencana kerja, lalu secara otomatis menulis _orchestration program_ mini yang meluncurkan sub-agen, membagi tugas, mengumpulkan hasil, dan mengatur aliran data tanpa intervensi manual developer.

---

## 2. Cara Kerja Topologi Mandiri: Dari Dekomposisi hingga Isolasi Konteks

Secara mekanis, Dynamic Workflows membagi pemecahan masalah ke dalam beberapa fase terverifikasi:

```
[User Objective / Task Prompt]
                │
                ▼
      ┌──────────────────┐
      │   Lead Agent     │ ◄─── Menyusun Execution Plan & Topologi
      └─────────┬────────┘
                │ Menulis Orchestration Program
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Sub-Agent 1  │ │ Sub-Agent 2  │ ◄─── Konteks Terisolasi (Isolated Context)
│ (Ticker / Mod)│ │ (Ticker / Mod)│      Shared Filesystem
└───────┬──────┘ └───────┬──────┘
        └───────┬───────┘
                ▼
      ┌──────────────────┐
      │   Review Phase   │ ◄─── Evaluasi & Sintesis Hasil
      └─────────┬────────┘
                ▼
        [Final Deliverable]
```

### A. Isolasi Konteks (_Context Isolation_)

Salah satu penyebab utama kegagalan agen AI pada pekerjaan besar adalah "pencemaran konteks" (_context pollution_). Ketika semua informasi disuntikkan ke dalam satu jendela konteks (_context window_), model kehilangan fokus pada detail penting.

Dalam contoh pemindaian saham (_watchlist scanner_) yang didemonstrasikan Anthropic:

- Fase pemindaian (_scan phase_) mendistribusikan setiap emiten ke sub-agen individual dengan konteks yang sepenuhnya bersih dan terisolasi.
- Setiap sub-agen hanya menerima data yang relevan untuk unit kerja tersebut.
- Hasil dari unit kerja yang telah diverifikasi kemudian diagregasi dan diteruskan ke fase peninjauan (_review phase_) untuk sintesis akhir.

### B. Komunikasi Berbasis Sistem Berkas (_Shared Filesystem_)

Menariknya, sub-agen di dalam Dynamic Workflows tidak saling berkirim pesan obrolan secara langsung (_peer-to-peer chat_ via API). Alih-alih demikian, mereka berbagi sistem berkas (_shared filesystem_). Agen menulis hasil kerja ke _disk_, membaca artefak rekan satu alurnya, dan membangun konsensus melalui dokumen kerja konkret. Pola ini mencegah terjadinya _hallucination loop_ yang sering timbul ketika dua LLM saling bertukar teks tanpa dasar artefak nyata.

---

## 3. Dua Tantangan Besar: Kontrol Anggaran dan Kristalisasi Memori

Meskipun menawarkan kekuatan komputasi yang luar biasa, menjalankan puluhan hingga ratusan sub-agen secara paralel memunculkan kekhawatiran operasional yang sangat nyata bagi para engineer: **biaya token yang tak terkendali.**

Dalam sesi tanya jawab di konferensi, dua solusi krusial diungkapkan oleh Anthropic:

### A. Mengapa Agen Tidak Tahu Berapa Anggaran Mereka?

Peserta lokakarya bertanya: apakah agen utama mengetahui batas anggaran dolar yang dimilikinya?

Harrison Stall menjawab bahwa model **tidak** diberi tahu sisa saldo anggarannya saat sedang berjalan. Pengembang menentukan _session budget_ di tingkat platform (Claude Console). Menariknya, Stall berkelakar bahwa jika model diberitahu sisa anggarannya secara eksplisit, agen tersebut cenderung menjadi "cemas" (_anxious_)—membuatnya mengambil jalan pintas berkualitas rendah atau mengabaikan langkah verifikasi krusial karena panik kehabisan dana.

Sebaliknya, eksekusi dipagari dengan pembatas keras (_hard ceiling_) dan parameter _default_ paralelisme yang konservatif, yang hanya dinaikkan untuk beban kerja yang secara eksplisit membutuhkan eksplorasi luas.

### B. Fitur "Dreaming": Kristalisasi Memori Jangka Panjang

Bagaimana tim dapat membuat alur kerja berulang (_repeated flows_) menjadi lebih hemat dan efisien dari waktu ke waktu?

CJ Avilla menunjuk pada fitur riset pratinjau (_research preview_) Anthropic yang dinamai **Dreaming**. Konsep ini terinspirasi dari fungsi biologis tidur:

- _Dreaming_ membaca basis memori yang ada bersama transkrip sesi-sesi sebelumnya.
- Sistem secara otomatis menghapus entri yang usang atau kontradiktif, menggabungkan data duplikat, dan mengkristalkan wawasan baru ke dalam basis memori terkompresi.
- Melalui siklus _dreaming_, alur kerja generasi berikutnya tidak perlu mempelajari kembali struktur kode atau aturan bisnis dari nol, sehingga memangkas konsumsi token secara dramatis.

---

## 4. Test-Time Compute: Membawa Skala Sains ke Publik

Diskusi paling menarik muncul ketika seorang peserta menanyakan apakah Dynamic Workflows dapat diterapkan pada penemuan ilmiah berskala raksasa, mengacu pada pencapaian pembuktian matematika kompleks seperti masalah Navier–Stokes.

Jawaban Stall menegaskan visi strategis Anthropic:

> _"Flows pada dasarnya adalah cara menyalurkan test-time compute ke masalah-masalah berat demi menarik kemampuan model lebih cepat. Melalui layanan API, membuka kapabilitas ini adalah langkah pertama agar kemajuan ilmiah dan riset tingkat tinggi dapat diakses secara luas oleh komunitas umum."_

Ketika komputasi waktu pelatihan (_training-time compute_) mulai membentur batas penskalaan data, **test-time compute**—memberikan model waktu, ruang kerja, dan pembagian tugas multi-agen untuk merenung, memvalidasi hipotesis, dan memverifikasi kesalahan sebelum memberikan jawaban akhir—menjadi garda depan baru rekayasa AI.

---

## Pelajaran Praktis bagi Rekayasa Perangkat Lunak Indonesia

Bagi developer dan arsitek sistem yang sedang merancang produk berbasis agen pintar, ada beberapa pelajaran penting dari pendekatan Anthropic:

1. **Hentikan Monolit Prompt:** Jangan membebani satu agen dengan _system prompt_ setebal buku manual. Pecah masalah menjadi unit kerja independen dengan konteks steril.
2. **Gunakan Artefak sebagai Bahasa Antar-Agen:** Komunikasi terbaik antar-agen adalah kode, skema JSON, dan berkas nyata—bukan percakapan obrolan bebas tanpa format yang rawan halusinasi.
3. **Posisikan Observabilitas di Garis Depan:** Melalui Claude Console, developer dapat membedah setiap _payload_ transisi dalam grafik orkestrasi. Jangan pernah menerapkan sistem multi-agen otonom tanpa kapabilitas inspeksi langkah demi langkah (_traceability_).
4. **Bersiap untuk Orkestrasi Mandiri:** Peran perekayasa perangkat lunak bergeser dari "pengatur giliran bicara agen" menjadi "penyedia pagar pengaman (_guardrails_), alat (_tools_), dan metrik evaluasi (_evals_)".

---

## Sumber dan Rujukan Terkait

- [Latent Space — How Anthropic’s Dynamic Workflows Coordinate Claude Agents](https://www.latent.space/p/claude-dynamic-workflows)
- [Anthropic Official Documentation on Claude Managed Agents & Flows](https://docs.anthropic.com)
- [AI Engineer New York 2026 Conference Materials](https://www.ai.engineer/)
