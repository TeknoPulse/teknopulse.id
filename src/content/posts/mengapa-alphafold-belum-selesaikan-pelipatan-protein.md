---
title: 'Mengapa AlphaFold Belum Menyelesaikan Masalah Pelipatan Protein: Pelajaran Skalabilitas AI dari Google DeepMind dan Biohub'
slug: 'mengapa-alphafold-belum-selesaikan-pelipatan-protein'
summary: 'Bedah diskusi Latent Space bersama Pushmeet Kohli (Google DeepMind) dan Sal Candido (CZ Biohub): mengapa AlphaFold baru memecahkan struktur statis, paradoks The Bitter Lesson di biologi, dan pentingnya kalibrasi ketidakpastian.'
metaDescription: 'Kupas tuntas diskusi DeepMind dan Biohub di Latent Space: AlphaFold bukan akhir biologi molekuler, batasan data biologi, dan masa depan sel virtual.'
publishedAt: 2026-10-10
category: AI
tags:
  - AlphaFold
  - Google DeepMind
  - Pushmeet Kohli
  - Sal Candido
  - Biohub
  - Latent Space
  - Protein Folding
  - Biologi Komputasi
  - AI Scaling Laws
author: 'TeknoPulse Redaksi'
draft: true
source:
  - name: "Latent Space — Why AlphaFold Didn't Solve Protein Folding"
    url: 'https://www.latent.space/p/biohub-deepmind'
    primary: true
---

![Visualisasi komputasi struktur 3D molekul protein bercahaya dengan diagram pemodelan biologi kecerdasan buatan](https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1280&h=720&q=80)

_Catatan: Artikel ini diadaptasi dan diulas secara mendalam dari taklimat dan diskusi teknis [Latent Space](https://www.latent.space/p/biohub-deepmind) bersama Pushmeet Kohli (Google DeepMind) dan Sal Candido (Chan Zuckerberg Biohub) edisi 10 Oktober 2026._

Sejak Google DeepMind merilis AlphaFold 2 pada akhir 2020 hingga puncaknya penganugerahan Hadiah Nobel Kimia baru-baru ini kepada Demis Hassabis dan John Jumper, narasi publik yang mendominasi media sains arus utama terdengar sangat pasti dan seragam:

> *"Kecerdasan buatan telah memecahkan misteri biologi terbesar berusia 50 tahun: masalah pelipatan protein (protein folding problem)."*

Bagi masyarakat umum, ini terdengar seperti akhir dari sebuah babak pencarian ilmiah. Namun, jika Anda masuk ke laboratorium biologi struktural atau berbincang dengan para arsitek di balik model kecerdasan buatan tersebut, Anda akan mendengar jawaban yang sangat kontras: **kami baru saja menggores permukaan terluarnya**.

Dalam sebuah panel diskusi istimewa di podcast **Latent Space** yang dipandu oleh Brandon Anderson, dua tokoh kunci komputasi biologi modern—**Pushmeet Kohli** (Vice President of Research di Google DeepMind) dan **Sal Candido** (Vice President of AI Engineering di Chan Zuckerberg Biohub)—duduk bersama untuk membongkar mitos tersebut.

Mereka membedah secara jujur mengapa AlphaFold belum memecahkan masalah dinamika protein, bagaimana hukum penskalaan (*scaling laws*) menghadapi jalan buntu di dunia biologi basah (*wet lab*), dan mengapa masa depan kedokteran translasi membutuhkan lompatan 10x lipat, bukan sekadar optimasi model bahasa konvensional.

Berikut adalah telaah mendalam dari wawasan arsitektural yang mereka bagikan.

---

## 1. Paradoks "The Bitter Lesson": Mengapa Biologi Tidak Bisa Diselesaikan Hanya dengan Menumpuk Komputasi

Dalam sejarah kecerdasan buatan, esai legendaris Rich Sutton bertajuk *"The Bitter Lesson"* mengajarkan bahwa metode berbasis komputasi umum dan pencarian skala masif pada akhirnya akan selalu mengalahkan metode artisanal yang mengandalkan intuisi manusia.

Namun, apakah prinsip tersebut berlaku mutlak untuk biologi molekuler? Sal Candido menggarisbawahi kesalahpahaman terbesar komunitas pengembang saat ini:

> *"Ada anggapan keliru bahwa hukum penskalaan (scaling laws) ada di mana-mana dan selalu otomatis bekerja. Kenyataannya, separuh dari kerja keras kami adalah mencari di mana hukum penskalaan itu sebenarnya berada."*

Dalam pemrosesan bahasa alami (LLM), teks internet tersedia dalam triliunan token gratis. Di dunia biologi, data eksperimental berkualitas tinggi sangat mahal dan langka:
- **Jebakan Data yang Mudah Didapat:** Peneliti pembelajaran mesin sering kali tergoda mengoptimalkan model pada kumpulan data yang sudah tersedia di repositori publik, bukan pada data yang benar-benar memecahkan masalah klinis paling mendesak.
- **Kekuatan Data Metagenomik yang "Kotor":** Sal Candido membagikan contoh konkret yang mengejutkan. Saat melatih model bahasa protein (*protein language models* / pLM), timnya menyuntikkan sekuens metagenomik dari lingkungan alami yang berkualitas rendah dan belum terkurasi. Menariknya, meskipun banyak sekuens tersebut bukanlah protein utuh, performa model dalam merancang protein fungsional baru justru meningkat pesat karena model mempelajari distribusi statistik evolusi yang jauh lebih luas.

Pushmeet Kohli menambahkan bahwa *"The Bitter Lesson"* sejatinya bukan tentang mendewakan data atau model semata, melainkan tentang **mengutamakan pemecahan masalah**:
> *"Jika Anda mendekati sains dengan sikap fanatik seperti 'Saya adalah orang pemodelan' atau 'Saya adalah orang pembuat data', Anda akan gagal. Masalahnya yang harus datang pertama. Jika masalah butuh rekayasa model, rekayasalah modelnya. Jika masalah butuh pembuatan data baru, buatlah datanya."*

---

## 2. AlphaFold 2 Sebagai Karya Seni Berbias Induktif (*Handcrafted Craftsmanship*)

Di tengah tren AI modern yang beralih ke arsitektur generik berbasis *Transformer* murni, AlphaFold 2 justru merupakan contoh mahakarya yang sarat dengan **bias induktif ilmiah** (*scientific inductive bias*).

Pushmeet Kohli menjelaskan bahwa rancangan AlphaFold 2 bukanlah eksperimen acak:
- Tim DeepMind menyematkan intuisi biofisika langsung ke dalam lapisan jaringan saraf: residu asam amino tidak bergerak secara acak, melainkan dipengaruhi oleh interaksi spasial, ikatan hidrogen, dan orientasi sudut dihedral dari residu tetangga.
- Memberikan "keunggulan tidak adil" (*unfair advantage*) berupa pengetahuan kimiawi ini membuat model menjadi sangat hemat data (*data-efficient*). AlphaFold mampu memprediksi struktur dengan akurasi setara kristalografi sinar-X hanya dari sekitar 170.000 struktur yang tersimpan di *Protein Data Bank* (PDB)—angka yang sangat kecil dibandingkan miliaran parameter model modern.

Namun, Sal Candido mengingatkan adanya titik balik (*tipping point*): ketika volume data biologis nantinya bertambah berlipat ganda, bias induktif manusia yang tidak tepat justru bisa membatasi kemampuan model untuk menemukan prinsip-prinsip fisika baru yang belum pernah disadari manusia.

---

## 3. Fakta Tersembunyi: Protein Bukanlah Blok Bangunan Statis

Salah satu poin paling tajam dari Pushmeet Kohli adalah pengakuannya mengenai metafora populer tentang protein:

> *"Orang-orang sering menyebut protein sebagai balok penyusun kehidupan (building blocks). Saya sendiri sering mengatakannya kepada publik, tetapi sebenarnya saya tidak mempercayainya. Protein bukanlah balok mati; protein sangatlah dinamis, fleksibel, dan memiliki wilayah tanpa struktur teratur (disordered regions)."*

Inilah alasan mendasar mengapa masalah pelipatan protein belum selesai:
1. **Representasi Statis vs Realitas Dinamis:** Yang dipecahkan AlphaFold 2 adalah memprediksi satu bentuk konformasi paling stabil yang didepositkan oleh ilmuwan ke dalam repositori PDB. Padahal di dalam tubuh manusia, protein terus meliuk, berubah bentuk saat berikatan dengan obat (*ligand-induced fit*), dan mengubah perilakunya tergantung suhu, pH cairan sel, atau interaksi molekuler.
2. **Keterbatasan Struktur Kristal:** Struktur kristalografi PDB sering kali mengabaikan dinamika transisi ini.
3. **Masa Depan Mikrograf Cryo-EM:** Pushmeet mengungkapkan visinya untuk melatih model AI langsung pada data mentah mikrograf *Cryo-Electron Microscopy* (cryo-EM). Alih-alih melatih model pada struktur 3D hasil rekonstruksi manusia yang sudah disederhanakan, melatih model langsung pada ribuan partikel gambar mikrograf 2D dapat menangkap spektrum distribusi konformasi dinamis protein secara nyata.

---

## 4. Dari "Jari-Jari Sepeda" Menuju "Sel Virtual": Analogi Sal Candido

Untuk menjelaskan keterbatasan model saat ini kepada para pengembang, Sal Candido menggunakan analogi mekanika yang sangat mengena:

> *"Membangun model struktur protein tunggal saat ini ibarat seseorang yang ingin memahami cara kerja sepeda, tetapi hanya memodelkan satu jari-jari (spoke) pada rodanya. Model jari-jari itu memang bisa dibuat semakin sempurna, tetapi yang sesungguhnya ingin dipahami ilmuwan adalah seluruh rodanya, seluruh sepedanya, dan bagaimana sepeda itu melaju di jalan raya."*

Banyak laboratorium saat ini mencoba menggunakan model tingkat "jari-jari" untuk langsung merancang komponen "truk pikap" (seperti kandidat obat kompleks).

Tantangan akbar berikutnya adalah memindahkan fokus dari pemodelan molekul individual ke **pemodelan sistem biologis terpadu (The Virtual Cell)**: bagaimana jutaan protein berinteraksi di dalam sitoplasma, merespons sinyal antar-sel, dan bagaimana mutasi genetik memicu malfungsi jaringan secara menyeluruh.

---

## 5. Kalibrasi Ketidakpastian Mengalahkan Ilusi Keterpahaman (*Interpretability*)

Fisikawan Richard Feynman pernah menuliskan kalimat terkenalnya di papan tulis menjelang wafatnya: *"What I cannot create, I do not understand"* (Apa yang tidak bisa kubuat, tidak kupahami).

Di era kecerdasan buatan saat ini, paradoks baru muncul: para insinyur dapat dengan mudah membuat molekul pengikat berkekuatan pikomolar (*picomolar binders*) menggunakan model AI tanpa memahami mekanisme biofisika di baliknya.

Menanggapi dilema antara "memahami mekanisme" vs "menghasilkan luaran fungsional", Pushmeet Kohli memberikan perspektif rekayasa yang sangat pragmatis:

- **Bukan Keterpahaman Internal, Melainkan Kalibrasi Ketidakpastian:** Ilmuwan tidak perlu membedah miliaran bobot matematis di dalam jaringan saraf tiruan untuk mempercayai AlphaFold. Yang paling krusial adalah **kalibrasi skor kepercayaan (pLDDT)**.
- Jika sebuah model memberikan prediksi struktur yang keliru namun menyatakan tingkat kepercayaan 99%, seorang ilmuwan bisa menyia-nyiakan waktu dan dana laboratorium selama dua tahun untuk memvalidasi target obat yang salah. Kalibrasi probabilitas yang jujur adalah kunci keselamatan dan adopsi di dunia nyata.
- **Spekulasi Menarik:** Pushmeet mengajukan hipotesis provokatif—mungkin arsitektur AI seperti AlphaFold memang tidak akan pernah bisa dipahami secara intuitif oleh keterbatasan kognitif otak manusia, namun model bahasa frontier masa depan yang jauh lebih cerdas mungkin mampu membaca lapisan aktivasi AlphaFold dan merumuskan teori fisika baru yang menjelaskan cara kerjanya.

---

## 6. Berpikir 10x Lipat: Kunci Menembus Hambatan Penemuan Obat

Saat ditanya kapan kecerdasan buatan akan benar-benar merevolusi dunia klinis dan farmasi, kedua narasumber sepakat bahwa AI sudah digunakan hari ini di setiap lini pipa penemuan obat—mulai dari identifikasi target hingga optimasi senyawa penuntun (*lead optimization*).

Namun, untuk mencapai percepatan 10x hingga 100x yang dramatis dalam menyembuhkan penyakit manusia, Sal Candido menekankan filosofi kerja warisan masa kerjanya di Google dan kini di Biohub:

> *"Terkadang jauh lebih mudah memecahkan masalah dengan bertanya apa yang dibutuhkan untuk membuat terobosan 10x lipat (10x breakthrough) daripada sekadar perbaikan 10% (10% improvement). Jalur 10x memaksa Anda kembali ke prinsip pertama (first principles), membuang asumsi lama, dan melihat solusi dari sudut pandang yang belum pernah disentuh siapa pun."*

---

## Pelajaran Berharga bagi Pengembang dan Peneliti AI

1. **Jaga Kerendahan Hati Ilmiah:** Jangan terbuai oleh klaim bahwa sebuah disiplin sains yang kompleks telah "diselesaikan" oleh satu model AI. Sadari batasan data latih dan kenali ruang lingkup validitas model Anda.
2. **Prioritaskan Kalibrasi Metrik daripada Kepastian Semu:** Dalam aplikasi berisiko tinggi (kesehatan, keuangan, infrastruktur kritis), kemampuan model untuk mengatakan *"saya tidak tahu"* atau menyajikan skor probabilitas yang terkalibrasi jauh lebih bernilai daripada jawaban cepat tanpa batas kesalahan.
3. **Kualitas dan Keanekaragaman Data Mengalahkan Skala Buta:** Menambah triliunan parameter pada arsitektur generik tidak akan memecahkan domain khusus jika distribusi data tidak mencerminkan dinamika dunia nyata. Rancanglah jalur pengumpulan data yang mendekati sumber fenomena alami.

---

## Sumber Rujukan

- Latent Space: *"Why AlphaFold Didn't Solve Protein Folding — Pushmeet Kohli, Google DeepMind & Sal Candido, Biohub"* — 10 Oktober 2026 — https://www.latent.space/p/biohub-deepmind
- Sal Candido — Chan Zuckerberg Biohub — https://biohub.org/team/salvatore-candido/
- Pushmeet Kohli — Google DeepMind Research — https://x.com/pushmeet
