---
title: "Anthropic Tangkap Tujuh Lab AI China Kerahkan Jutaan Permintaan untuk Dapatkan Data Claude"
summary: "Anthropic menuding tujuh laboratorium AI asal China, termasuk Alibaba dan DeepSeek, melakukan kampanye penggalian data skala industri terhadap model Claude demi melatih model pesaing mereka."
publishedAt: 2026-09-25T06:00:00+07:00
tags: ["AI", "Keamanan", "AS-China"]
category: "Security"
author: "TeknoPulse Redaksi"
draft: false
coverImage: "../../assets/images/claude-chinese-ai-distillation-16x9.png"
---

Perusahaan AI asal Amerika Serikat, Anthropic, pada 10 September 2026 merilis laporan ancaman yang mengejutkan industri teknologi global. Dalam laporan *Threat Intelligence* edisi terbaru itu, Anthropic menuding tujuh laboratorium AI asal China melakukan kampanye penggalian data secara sistematis dan berskala industri terhadap model Claude — untuk kemudian dipakai melatih model pesaing mereka sendiri.

Jumlah yang terungkap sangat besar. Dalam rentang waktu yang dicakup laporan, Anthropic mendeteksi hampir 200 juta percakapan yang dikirimkan ke Claude oleh tujuh entitas yang disasar. Angka ini menjadikannya salah satu kasus pembajakan data model AI terbesar yang pernah terdokumentasi.

## Apa Itu Distilasi?

*Distilasi model* adalah teknik pelatihan AI yang sudah lama dikenal di kalangan pengembang. Cara kerjanya sederhana: sebuah model yang lebih besar dan canggih — dalam hal ini Claude — dijadikan "guru". Jawabannya, termasuk alur penalarannya, lalu dipakai sebagai data latihan untuk melatih model lain yang lebih kecil atau lebih murah.

Teknik ini legal dan lazim dilakukan di dalam satu perusahaan. Namun yang dilarang dan digolongkan sebagai "distilasi tidak sah" oleh Anthropic adalah kasus di mana satu pihak secara tersembunyi dan tanpa izin menggunakan output dari model orang lain secara masif untuk membangun kemampuan model pesaing.

## Alibaba: Kampanye Terbesar dalam Sejarah

Dari tujuh laboratorium yang dituding, Alibaba grup menjadi yang paling banyak dibahas. Menurut Antropic, entitas yang terafiliasi dengan Alibaba mengirim lebih dari 151 juta permintaan ke Claude antara Mei hingga Juli 2026. Pada puncaknya, angka itu mendekati tiga juta permintaan per hari.

Semua itu dilakukan menggunakan lebih dari 3.500 akun palsu yang menggunakan identitas palsu dan metode pembayaran yang dicuri. Para penyerang bahkan menggunakan satu format *prompt* yang tetap untuk memancing Claude membuka jejak penalaran internalnya sebelum memberikan jawaban akhir. Hasilnya, Anthropic menuding data tersebut dipakai untuk meningkatkan model Qwen 3.5, 3.6, dan 3.7.

## Moonshot AI: Data Pribadi Pengguna Dikirim ke Claude

Anthropic juga menuding Moonshot AI — perusahaan di balik asisten AI Kimi — menggunakan 5.380 akun palsu untuk meneruskan hampir 300.000 permintaan pelanggan ke Claude dalam tempo hanya 10 hari. Pengguna Kimi yang percaya sedang berbicara dengan model sendiri justru melihat jawaban yang dihasilkan oleh Claude, tanpa sepengetahuan mereka.

Yang lebih mengkhawatirkan, beberapa permintaan yang diteruskan itu berisi informasi sensitif milik individu dan perusahaan. Dalam satu kasus yang diuraikan Anthropic, sebuah akun yang dinilai terafiliasi dengan militer China mengirimkan rekaman pengawasan dari ratusan kamera CCTV di Chengdu ke Claude, lalu meminta sistem menentukan apakah seseorang yang dipantau "berperilaku tidak normal."

DeepSeek, laboratorium AI asal China yang namanya sering dibandingbandingkan dengan GPT-4, juga dituding melakukan hal serupa. Lebih dari 12 juta permintaan terkait aktivitas DeepSeek terdeteksi dalam tempo dua minggu di Juli. Beberapa di antaranya berisi kredensial dan data sensitif.

Empat laboratorium lain — Zhipu, Xiaomi, SenseTime, dan MiniMax — juga disebut namanya dalam laporan yang sama, meski dengan volume yang lebih kecil.

## Beijing Menolak Semua Tuduhan

Reaksi China tidak menunggu lama. Pada 9 September 2026, Kementerian Luar Negeri China melalui juru bicaranya menyatakan tuduhan tersebut "tidak berdasar" dan menuduh Washington mempolitisasi risiko AI untuk menghambat perkembangan teknologi China. Kementerian Perdagangan China bahkan memperingatkan akan ada "langkah balasan tegas" jika Amerika Serikat menggunakan tuduhan ini untuk membatasi akses perusahaan AI China.

Tuduhan ini bukan muncul mendadak. Pada 8 September 2026, tiga lembaga pemerintah Amerika Serikat — termasuk NSA dan FBI — sudah lebih dulu menerbitkan peringatan bersama yang menunjuk enam perusahaan AI China karena melakukan "aktivitas distilasi agresif dan berskala industri."

## Langkah Anthropic

Anthropic menegaskan seluruh aktivitas yang dituding telah berhasil dihentikan. Perusahaan telah memblokir seluruh akun yang teridentifikasi, memperketat sistem deteksi di level API, serta memperkenalkan verifikasi identitas untuk beberapa jenis akses baru.

Yang menarik, kampanye distilasi ini tidak pernah berhasil menembus model paling canggih Anthropic, yaitu Claude Fable dan Mythos. Seluruh permintaan yang berhasil dikumpulkan para penyerang ditujukan pada model-model yang sudah tersedia untuk umum, bukan model dengan kemampuan paling tinggi.

Bagi pengguna dan perusahaan yang menggunakan layanan AI routing atau perantara pihak ketiga, laporan Anthropic menjadi pengingat penting: selalu periksa ke mana permintaan Anda sebenarnya diteruskan, dan pastikan platform yang Anda gunakan memiliki kebijakan privasi yang transparan.

## Sumber

- **Reuters**, "Anthropic disrupts Russian, Chinese AI campaigns targeting its Claude models," 10 September 2026
- **TechCrunch**, "Anthropic details distillation campaigns from Alibaba, Moonshot AI, and DeepSeek," 11 September 2026
- **CNBC**, "Anthropic says Chinese AI firms routed millions of queries through Claude," 11 September 2026
- **BBC**, "Anthropic accuses China-based AI firms of 'illicit distillation' of Claude model," 11 September 2026
- **Global Times / Reuters**, "China rejects US AI distillation claims, warns of countermeasures," 9 September 2026
