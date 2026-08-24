---
title: "NVIDIA Pamer Arsitektur AI Baru, Model Claude Melesat dari 30% ke 100%"
summary: "NVIDIA lewat sistem AVO membuktikan bahwa 'tali kekang' arsitektur di sekitar model AI bisa lebih menentukan performa dibanding model itu sendiri. Skor ARC-AGI-3 Claude Opus 5 melompat dari 30% jadi 100% hanya karena ditambahkan AVO."
publishedAt: 2026-08-24T17:00:00+07:00
tags: ["AI", "NVIDIA", "Tech"]
category: "AI"
author: "TeknoPulse Redaksi"
draft: false
coverImage: "../../assets/images/nvidia-arc-agi-3-avo-16x9.png"
---

Dalam dunia AI, sering kali yang jadi sorotan adalah model-language model-yang jadi otak di balik layanan chatbot atau asisten digital. Namun NVIDIA lewat riset barunya menunjukkan bahwa kadang yang lebih penting bukanlah otaknya, melainkan kerangka kerja yang membungkusnya. Hasil ini datang dari sistem bernama AVO (Agentic Variation Operators), dan dampaknya cukup mengejutkan: model yang sama bisa meloncat dari 30% ke 100% hanya karena ditambahkan arsitektur yang tepat.

## Apa Itu ARC-AGI-3?

Untuk memahami kenapa temuan ini menarik, kita perlu tahu dulu apa itu ARC-AGI-3. ARC-AGI adalah singkatan dari Abstraction and Reasoning Corpus for Artificial General Intelligence, sebuah benchmark yang dirancang khusus untuk menguji kemampuan penalaran umum AI. Berbeda dari tes yang mengukur Hafalan atau pengetahuan faktual, ARC-AGI meminta AI masuk ke lingkungan yang tidak familiar, tanpa instruksi, tanpa aturan yang jelas, dan tanpa tujuan yang stated. AI harus menekan-nekan, mengamati apa yang berubah, menyimpulkan apa tujuannya, lalu merencanakan langkah efisien untuk menyelesaikan setiap level.

Benchmark ini punya reputasi keras di kalangan peneliti AI. Bahkan model-model paling canggih pun selama bertahun-tahun cuma mampu menyelesaikan kurang dari 1% dari total level yang ada. Ketika skor 30% saja sudah dianggap lompatan besar bagi model Claude Opus 5 dari Anthropic, mudah dipahami kenapa banyak yang menyebut ARC-AGI sebagai "benchmark yang tidak bisa dimanipulasi."

## AVO: Arsitektur di Belakang Lonjakan Skor

NVIDIA AVO adalah sistem agen AI otonom yang membungkus model bahasa frontier dengan tiga komponen utama. Komponen pertama adalah memori persistensi yang menyimpan hasil evaluasi, implementasi sebelumnya, dan proses penalaran di setiap langkah. Alih-alih memulai dari nol setiap kali, agen AVO bisa langsung resume dari posisi terakhir yang ditinggalkan. Komponen kedua adalah loop kerja empat tahap: inspect (inspeksi), plan (rencana), implement (implementasi), dan evaluate (evaluasi). Loop ini berjalan berulang sampai tugas selesai atau tidak bisa dilanjutkan. Komponen ketiga adalah supervisor, mekanisme pemantau yang mendeteksi ketika agen tersangkut di pola yang tidak produktif dan langsung mengarahkan ulang ke strategi yang berbeda.

Pendekatan ini terbukti sangat efektif ketika tim NVIDIA menggunakan AVO untuk menyelesaikan tugas yang sangat berbeda dari yang awalnya diperuntukkan. AVO awalnya dirancang untuk mengoptimalkan kode CUDA, komponen perangkat lunak yang berjalan langsung di atas GPU NVIDIA. Dalam pengujian selama tujuh hari, AVO mengeksplorasi lebih dari 500 arah optimasi berbeda dan menghasilkan 40 versi kernel yang lebih cepat. Pada hardware NVIDIA DGX B200, kernel attention yang dihasilkan AVO mengungguli cuDNN sampai 3,5% dan FlashAttention-4 sampai 10,5%. Itu bukan angka main-main untuk perangkat lunak yang mengatur cara GPU memproses data.

Ketika arsitektur yang sama diarahkan ke ARC-AGI-3, AVO menyelesaikan seluruh 183 level pada set publik dengan skor 100,00 RHAE. Sebagai perbandingan, sistem pembanding bernama VISTA yang juga menggunakan Claude Opus 5 membutuhkan 7.542 action lingkungan untuk menyelesaikan set yang sama. AVO hanya menggunakan 6.624 action, alias sekitar 12% lebih sedikit.

## Apa yang Bisa Kita Ambil dari Hasil Ini?

NVIDIA sendiri yang angkat bicara soal implikasi dari temuan ini. Dalam posting blog resminya, tim NVIDIA menulis bahwa model bahasa frontier hanya satu komponen dari sebuah agen AI. Yang sebenarnya menentukan performa adalah bagaimana sistem di sekitar model menerima konteks, menggunakan alat, menjaga state, merespons feedback, pulih dari kegagalan, dan mempertahankan progress selama tugas jangka panjang.

Pengakuan ini mengubah asumsi lama di industri AI. Selama ini, banyak yang percaya bahwa satu-satunya jalan meningkatkan performa AI adalah membuat model yang lebih besar dan lebih mahal. Hasil AVO menunjukkan bahwa investasi yang sama efeknya bisa datang dari sisi rekayasa sistem di luar model, termasuk memori, alat, dan mekanisme supervisi. Ini bukan berarti model tidak penting, tapi bahwa arsitektur di sekitarnya sama-sama krusial.

Ada juga catatan penting yang perlu diingat. Angka 30% untuk Claude Opus 5 di ARC-AGI-3 berasal dari setup evaluasi resmi ARC Prize yang berbeda dari setup NV. Demikian pula, angka 100% AVO hanya berlaku untuk set publik. Set evaluasi privat dan semi-privat masih belum teruji dan bisa jadi tingkat kesulitan yang berbeda. NVIDIA sendiri tidak mengklaim bahwa AVO menyelesaikan ARC-AGI secara keseluruhan, melainkan hanya bagian publik yang tersedia untuk umum.

## Implikasi ke Depan

Bagi dunia AI secara luas, hasil ini memberi gambaran baru tentang arah pengembangan. Alih-alih berburu model yang selalu lebih besar, peneliti dan perusahaan mungkin mulai invests lebih banyak ke infrastruktur sistem di sekitar model. Memori yang bertahan lama, alat yang bisa digunakan agen secara otonom, dan mekanisme supervisi yang bisa mengarahkan ulang saat proses mandek adalah tiga elemen yang terbukti efektif di AVO. Ini membuka peluang bagi pengembang untuk meningkatkan performa model yang sudah ada tanpa menunggu datangnya model generasi baru.

Bagi kamu yang mengikuti perkembangan AI, story AVO ini jadi pengingat bahwa di balik setiap angka benchmark yang menakjubkan, ada arsitektur yang tidak kalah pentingnya dari model di dalamnya. AI bukan hanya soal siapa yang paling besar, tapi juga siapa yang paling pintar dalam merangkai sistem.

## Sumber

- NVIDIA Developer Blog, "NVIDIA AVO Reaches 100% on ARC-AGI-3, Demonstrating a Frontier-Level General-Purpose Architecture for Long-Horizon Autonomous Agents," 21 Agustus 2026 (https://developer.nvidia.com/blog/nvidia-avo-reaches-100-on-arc-agi-3-demonstrating-a-frontier-level-general-purpose-architecture-for-long-horizon-autonomous-agents/)
- AI Weekly, "NVIDIA's AVO Hits 100 on ARC-AGI-3, Uses 12% Fewer Actions," 22 Agustus 2026 (https://aiweekly.co/alerts/nvidias-avo-hits-100-on-arc-agi-3-uses-12-fewer-actions)
- Duck-IT Tech News, "NVIDIA AVO Scores 100 on ARC AGI 3 After Starting as a CUDA Optimization Agent," 24 Agustus 2026 (https://www.duckittech.com/news/nvidia-avo-scores-100-on-arc-agi-3-after-starting-as-a-cuda-optimization-agent)
