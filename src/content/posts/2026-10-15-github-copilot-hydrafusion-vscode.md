---
title: 'GitHub Copilot Rilis HydraFusion, AI Pilih Model Terbaik Otomatis di VS Code'
summary: 'GitHub secara resmi membawa HydraFusion ke Visual Studio Code, fitur riset yang secara otomatis memilih model AI dan pola kerja terbaik untuk setiap tugas pengodean di GitHub Copilot.'
publishedAt: 2026-10-15T06:22:00+07:00
tags: ['GitHub', 'VS Code', 'AI Coding', 'Developer Tools']
category: Developer
author: 'TeknoPulse Redaksi'
draft: false
slug: 'github-copilot-hydrafusion-vscode'
metaDescription: 'GitHub Copilot Hadirkan HydraFusion di VS Code, otomatis pilih model AI & pola kerja untuk pengodean. Tersedia untuk Pro, Pro+, Business, Enterprise.'
coverImage: '../../assets/images/2026-10-15-github-copilot-hydrafusion-vscode-16x9.png'
source:
  - name: 'GitHub Blog'
    url: 'https://github.blog/changelog/2026-10-01-github-copilot-in-vs-code-september-2026-releases'
    primary: true
---

Halo, pembaca setia! Ada perkembangan menarik dari dunia alat pengembang perangkat lunak. GitHub resmi membawa fitur **HydraFusion** ke Visual Studio Code, dan ini mengubah cara kita berpikir tentang asisten kode AI.

## Apa Itu HydraFusion?

HydraFusion adalah fitur riset dari GitHub yang sebelumnya hanya tersedia di Copilot CLI. Sejak 30 September 2026, fitur ini juga hadir di VS Code versi 1.140 ke atas dan aplikasi Copilot.

Konsepnya sederhana tapi powerful: alih-alih memilih satu model AI secara manual, HydraFusion secara otomatis memilih model dan pola kerja terbaik untuk setiap tugas pengodean yang kamu kerjakan. Ini berarti Copilot tidak lagi sekadar menjawab, tapi benar-benar mengoordinasikan berbagai model AI di balik layar.

## Tiga Pola Kerja Cerdas

HydraFusion bekerja dengan tiga pola eksekusi berbeda, dipilih secara otomatis berdasarkan kompleksitas tugas:

**Single** — Satu model dipilih langsung untuk menyelesaikan tugas. Cocok untuk tugas sederhana yang tidak membutuhkan banyak tenaga.

**Cascade** — Model yang lebih ringan membuat draf solusi terlebih dahulu. Sebuah quality gate memutuskan apakah hasil sudah cukup baik atau perlu diteruskan ke model yang lebih kuat. Pendekatan ini secara ekonomi cerdas karena banyak permintaan tidak benar-benar membutuhkan model premium.

**Critique** — Model pertama membuat draf, lalu model kedua dari keluarga berbeda bertugas sebagai peninjau read-only. Model pertama kemudian merevisi hasilnya sekali sebelum disajikan. Pendekatan ini mengikuti pola yang sama dengan Rubber Duck di Copilot CLI.

## Apa Bedanya dengan Mode Auto?

Sebelum HydraFusion, GitHub sudah punya mode Auto yang memilih satu model terbaik untuk setiap permintaan. HydraFusion melangkah lebih jauh: ia tidak hanya memilih model, tapi memilih bagaimana model-model tersebut bekerja sama.

Mode Auto menyelesaikan pertanyaan "model mana yang terbaik?" HydraFusion menjawab pertanyaan yang lebih dalam: "bagaimana tugas ini seharusnya dikerjakan?"

## Dampaknya untuk Pengembang

Bagi pengembang yang sehari-hari bekerja dengan VS Code dan GitHub Copilot, HydraFusion menawarkan beberapa keuntungan konkret. Pertama, tidak perlu lagi menebak-nebak model mana yang tepat untuk tugas tertentu. Kedua, transparansi yang lebih baik selama proses berjalan. GitHub menambahkan laporan kemajuan langkah demi langkah sehingga kamu bisa mengikuti apa yang sedang terjadi. Ketiga, secara potensial mengurangi biaya karena tugas sederhana tidak selalu menggunakan model premium.

GitHub menyebut bahwa evaluasi internal mereka menunjukkan pengurangan biaya alur kerja hingga 36-67 persen dibandingkan baseline Claude Opus 5 di beberapa tolok ukur coding agent, meskipun hasil ini masih dari pengujian yang dilakukan GitHub sendiri dan belum diverifikasi pihak independen.

## Status dan Pertimbangan

HydraFusion saat ini masih berstatus research preview. Ini berarti perilakunya bisa berubah, model yang digunakan tidak dipublikasikan secara lengkap, dan belum siap untuk menjadi dasar alur kerja produksi tanpa pengawasan manusia.

Fitur ini tersedia untuk pengguna Copilot Pro, Pro+, Business, dan Enterprise. Pengguna organisasi perlu memastikan administrator telah mengaktifkan fitur preview agar opsi HydraFusion muncul di model picker.

Di luar HydraFusion, pembaruan September 2026 untuk VS Code dan Copilot juga membawa beberapa kemampuan lain yang layak diperhatikan: sesi agent multi-folder secara eksperimental, kemampuan automasi terjadwal, agent merge untuk menangani konflik pull request, dan computer use preview yang memungkinkan Copilot berinteraksi dengan aplikasi desktop.

Intinya, ekosistem asisten kode AI sedang bergerak dari sekadar autocomplete menuju ke arah orkestrasi otomatis yang lebih kompleks. HydraFusion di VS Code adalah salah satu bukti nyata dari pergeseran ini.

## Sumber

- GitHub Blog, "GitHub Copilot in VS Code, September 2026 releases", 1 Oktober 2026 — https://github.blog/changelog/2026-10-01-github-copilot-in-vs-code-september-2026-releases
- CrazyCodersLab, "VS Code 1.140: Multi-Folder Agent Sessions and the Copilot Harness", 4 Oktober 2026
- beyondthe.news, "GitHub brings HydraFusion multi-model coding workflows into VS Code", 1 Oktober 2026
- aifeed.space, "GitHub Copilot Adds HydraFusion, Workflows and App Control", 7 Oktober 2026
