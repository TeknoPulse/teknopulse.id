---
title: "Robot Humanoid Bisa Masuk Rumah Baru dan Langsung Kerja, Tanpa Latihan"
summary: "Figure AI luncurkan Helix 2.5, model baru yang memungkinkan robotFigure 03 masuk ke 30 rumah di Bay Area dan langsung melakukan tugas rumah tangga tanpa perlu training tambahan di lokasi tersebut."
publishedAt: 2026-09-25T17:00:00+07:00
tags: ["AI", "Robot", "Figure AI", "Helix 2.5"]
category: AI
author: "TeknoPulse Redaksi"
draft: false
coverImage: "../../assets/images/2026-09-25-robot-figure-helix-25-rumah-baru-16x9.png"
---

# Robot Humanoid Bisa Masuk Rumah Baru dan Langsung Kerja, Tanpa Latihan

Siapa bilang robot harus belajar dari nol setiap kali masuk rumah baru? Figure AI punya jawabannya. Pada 17 September 2026, perusahaan robotika asal Amerika Serikat itu resmi memperkenalkan Helix 2.5, model jaringan saraf pengendali robot paling canggih yang pernah mereka bangun. Lewat model ini, robot humanoid Figure 03 berhasil masuk ke 30 rumah berbeda di kawasan San Francisco Bay Area dan langsung menyelesaikan tugas rumah tangga tanpa ada sesi pelatihan di lokasi tersebut.

## Langsung Bekerja Tanpa Data di Lokasi

Selama ini, salah satu hambatan terbesar dunia robotika adalah apa yang para insinyur sebut sebagai masalah "belajar per lingkungan." Robot konvensional perlu dilatih berulang kali di lokasi tempat robot akan beroperasi. Kalau berganti rumah, robot harus memetakan ulang seluruh ruangan, menyesuaikan diri dengan perabot baru, dan belajar menavigasi setiap sudut. Ini membuat robot rumah tangga sulit diandalkan secara praktis.

Helix 2.5 mengubah cara pandang itu. Alih-alih mengajarkan robot untuk menghafal satu rumah, Figure menggunakan dataset raksasa bernama Index untuk membekali robot dengan pemahaman umum tentang bagaimana manusia melakukan tugas-tugas rumah tangga. Dataset Index sendiri terus bertumbuh secara real-time, menghasilkan sekitar 35 menit data perilaku manusia baru setiap detiknya.

Dari satu model dasar itu, Figure menghasilkan tiga kemampuan berbeda: merapikan ruang tamu, melipat handuk, dan membereskan tempat tidur. Ketiga tugas ini dipilih karena semuanya menuntut kombinasi gerakan penuh tubuh, termasuk berjalan, meraih benda, mengoordinasikan kedua tangan, serta menyusun kembali benda-benda yang berserakan.

Untuk menguji klaim ini, Figure menyewa 30 rumah di Bay Area yang benar-benar baru bagi robot. Tidak ada data lokasi yang dikumpulkan sebelumnya. Tidak ada proses fine-tuning. Robot langsung dikumpulkan, diangkut ke lokasi, dan diminta bekerja.

## Hasil Pengujian yang Menggembirakan

Hasil pengujian menunjukkan peningkatan dramatis. Dalam serangkaian percobaan yang mencakup 420 kesempatan tugas, robot dengan Helix 2.5 berhasil menyelesaikan tugas secara penuh dalam 56 persen kasus. Bandingkan dengan model yang dilatih tanpa Index, yang hanya mencapai angka 9 persen dalam kondisi yang persis sama.

Jika dirinci per tugas, hasilnya semakin menarik. Pembuatan tempat tidur mencatat tingkat keberhasilan 67 persen, pelipatan handuk 62 persen, dan perapian mainan di ruang tamu 40 persen. Perlu dicatat bahwa kriteria keberhasilan yang ditetapkan Figure sangat ketat. Tugas hanya dianggap berhasil jika selesai seluruhnya, tanpa point parsial. Jika robot gagal di satu tahap saja, keseluruhan tugas dinilai gagal.

Yang tak kalah penting, robot menunjukkan kemampuan untuk memperbaiki kesalahannya sendiri secara spontan. Ketika gagal mengambil benda dalam sekali percobaan, robot mundur, mengubah posisi tubuh, lalu mencoba lagi. Ketika melipat sprei, robot berjalan mengitari tempat tidur untuk memastikan seluruh permukaan tersusun rapi.

## scaling Law ala Robot

Penemuan lain yang menonjol dari proyek ini adalah temuan yang menyerupai hukum penskalaan, atau scaling law, yang sebelumnya identik dengan model bahasa besar. Tim Figure menemukan bahwa ketika volume data Index digandakan secara berulang, kemampuan robot dalam memprediksi gerakan tubuh meningkat secara mulus dan dapat diprediksi. Bahkan, eksperimen kecil sudah mampu memperkirakan hasil dari eksperimen terbesar dengan akurasi hingga empat angka desimal.

Implikasinya besar. Kalau hukum penskalaan ini konsisten berlaku di dunia robotika, maka menambah volume data perilaku manusia secara langsung akan meningkatkan kemampuan robot secara andal. Ini membuka jalan bagi pengembangan robot yang semakin cepat dan murah.

Figure sendiri telah mengalokasikan sumber daya komputasi senilai 3,5 miliar dolar Amerika untuk melatih keluarga model Helix. Kerja sama dengan penyedia infrastruktur AI Nscale juga mengamankan akses terhadap sekitar 100.000 chip GPU NVIDIA Vera Rubin untuk mendukung pelatihan ini.

## Pilar Dataset Index

Kunci keberhasilan Helix 2.5 terletak pada dataset Index, sebuah kumpulan data perilaku manusia berskala global yang sengaja dirancang untuk melatih robot. Pendekatan Figure unik karena tidak menggunakan video robot untuk melatih robot. Mereka justru mengumpulkan rekaman aktivitas rumah tangga biasa yang dilakukan manusia dalam kehidupan sehari-hari.

Saat ini, lebih dari 1,6 juta segmen video dari sukarelawan di berbagai belahan dunia telah masuk ke dalam Index. Figure telah membayar sekitar 15 juta dolar Amerika kepada kontributor data ini. Kontribusi mingguan terus bertambah, dengan lebih dari 90.000 orang aktif memberikan data setiap minggunya.

Pendekatan ini membuktikan bahwa robot tidak harus belajar dari pengalaman robot lainnya. Cukup dengan mengamati bagaimana manusia menjalani aktivitas harian, robot sudah bisa menggeneralisasi kemampuan itu ke konteks baru yang belum pernah dijumpai.

## Langkah Besar Menuju Robot Rumah Tangga

Tentu saja, angka keberhasilan 56 persen bukan akhir cerita. Ini berarti robot masih gagal dalam 44 persen kasus, dan untuk tugas-tugas yang melibatkan banyak benda kecil seperti merapikan mainan, tingkat keberhasilannya baru 40 persen. Namun, kemajuan dari 9 menjadi 56 persen dalam satu generasi model adalah lompatan yang sangat signifikan.

Figure sendiri mengakui bahwa robotika humanoid umum belum sepenuhnya terselesaikan. Kendati demikian, Helix 2.5 menjadi bukti pertama bahwa kecerdasan seluruh tubuh bisa dipelajari dari pengalaman manusia dan ditransfer ke skenario baru tanpa harus membangun ulang dari awal setiap kali.

Kalau pendekatan ini terus dikembangkan, masa depan di mana robot membantu pekerjaan rumah tangga di berbagai rumah tanpa perlu adaptasi khusus di setiap lokasi bukan lagi khayalan. Langkah selanjutnya tinggal meningkatkan keandalan, memperluas jenis tugas, dan tentu saja menekan harga agar robot semacam ini bisa dijangkau oleh lebih banyak keluarga.

## Sumber

1. Figure AI, "Helix 2.5: Zero-Shot 30-Home Generalization," figure.ai, 17 September 2026.
2. TechRepublic, "Figure's Robot Entered 30 Unseen Homes — and Succeeded 56% of the Time," techrepublic.com, 21 September 2026.
3. Spatial Insiders, "Figure Introduces Helix 2.5, Bringing LLM-Style Scaling to Robot Learning," spatialinsiders.com, 17 September 2026.
