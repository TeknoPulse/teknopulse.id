---
title: 'Bagaimana Uber Membangun Genie: Arsitektur RAG Penjawab Pertanyaan Engineer Skala Masif'
slug: 'arsitektur-genie-uber-rag-enterprise'
summary: 'Menangani 45.000 pertanyaan per bulan di Slack dan menghemat 13.000 jam kerja engineer, Uber membangun Genie. ByteByteGo membedah arsitektur ETL Spark, Sia vector DB, sitasi sub-konteks, dan evaluasi ganda berbasis LLM-as-a-judge.'
metaDescription: 'Bedah arsitektur Genie Uber untuk on-call support copilot: integrasi Spark, Sia vector DB, pembagian sub-konteks, eskalasi Slack, dan evaluasi dokumen.'
publishedAt: 2026-10-20
category: Software
tags:
  - ByteByteGo
  - Uber
  - RAG
  - Enterprise AI
  - System Design
  - LLM
author: 'TeknoPulse Redaksi'
draft: true
coverImage: '../../assets/images/arsitektur-genie-uber-rag-enterprise-skala-besar-16x9.png'
coverImageAlt: 'Diagram arsitektur sistem retrieval-augmented generation dan orkestrasi bot cerdas enterprise'
format: 'konteks'
source:
  - name: 'ByteByteGo — How Uber Built a Genie to Answer Questions Correctly'
    url: 'https://blog.bytebytego.com/p/how-uber-built-a-genie-to-answer-051'
    primary: true
---

_Catatan: Analisis teknis ini disarikan dan dikembangkan dari laporan arsitektur sistem terdistribusi ByteByteGo yang mengulas arsitektur copilot rekayasa Uber, Genie._

Di perusahaan teknologi berskala global dengan ribuan perekayasa perangkat lunak, salah satu beban operasional terbesar yang jarang terlihat dari luar adalah **dukungan teknis internal (_internal tech support_)**.

Tim-tim pengembang platform inti—seperti tim pipeline data, infrastruktur _deployment_, dan alur kerja _machine learning_—harus secara bergiliran menugaskan insinyur mereka sebagai _on-call support_. Tugas harian mereka bukan hanya menangani insiden sistem yang padam, melainkan menjawab ratusan pertanyaan repetitif di kanal Slack: bagaimana cara mengatur konfigurasi fitur tertentu, mengapa sebuah job komputasi gagal berjalan, atau di mana letak dokumentasi API terbaru.

Di Uber, volume pertanyaan di kanal-kanal dukungan internal mencapai **45.000 pertanyaan setiap bulannya**.

Informasi untuk menjawab pertanyaan tersebut sebenarnya sudah ada, namun tercecer di berbagai silo: Engwiki (wiki internal Uber), Stack Overflow internal, dan dokumen desain sistem. Mencari dokumen yang tepat sering kali memakan waktu lebih lama daripada menanyakannya langsung ke rekan kerja.

Untuk memecahkan kebuntuan ini, Uber meluncurkan **Genie**—asisten kecerdasan buatan berbasis _Retrieval-Augmented Generation_ (RAG) yang terintegrasi langsung di kanal Slack. Pada tahun pertama setelah Genie dirilis pada September 2023, sistem ini menjawab **lebih dari 70.000 pertanyaan di 154 kanal Slack dan menghemat 13.000 jam kerja engineer**. Dalam laporannya, [ByteByteGo](https://blog.bytebytego.com/p/how-uber-built-a-genie-to-answer-051) membedah tumpukan teknologi di balik Genie.

---

## 1. Mengapa RAG, Bukan Fine-Tuning?

Langkah awal arsitektur Genie dimulai dari keputusan strategis: apakah model harus dilatih ulang (_fine-tuning_) dengan basis data internal Uber, atau menggunakan RAG?

Uber memilih **RAG** karena pertimbangan pragmatis:

1. **Kecepatan Adopsi:** RAG dapat langsung memanfaatkan ribuan dokumen yang sudah ada tanpa perlu menyusun dataset pelatihan beranotasi tinggi.
2. **Kemudahan Pembaruan Pengetahuan:** Prosedur internal dan konfigurasi platform terus berubah setiap pekan. Dengan RAG, memperbarui pengetahuan cukup dilakukan dengan memperbarui indeks eksternal, tanpa perlu melatih ulang model dasar (_base model_) yang memakan biaya komputasi besar.
3. **Keterlacakan Sumber (_Attribution & Traceability_):** Dalam rekayasa perangkat lunak, jawaban yang tampak meyakinkan namun salah (_hallucination_) dapat merusak lingkungan produksi. RAG memungkinkan setiap klaim jawaban ditautkan langsung ke URL dokumen sumber resminya.

---

## 2. Pipeline Penyiapan Pengetahuan: Apache Spark dan Sia Vector DB

Penyiapan dokumen pengetahuan dilakukan secara terpisah dari proses melayani pertanyaan pengguna (_serving_) melalui pipeline ETL (Extract, Transform, Load) berbasis **Apache Spark**:

```
Pipeline ETL Penyiapan Pengetahuan Uber Genie:
[Engwiki & Stack Overflow Internal]
                │
                ▼
      ┌──────────────────┐
      │   Apache Spark   │ ◄─── Ekstraksi & Pembagian DataFrame Terdistribusi
      └─────────┬────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│  LangChain   │ │    OpenAI    │
│   Chunking   │ │  Embeddings  │ ◄─── Fungsi Python Kustom via Spark
└───────┬──────┘ └───────┬──────┘
        └───────┬───────┘
                ▼
      ┌──────────────────┐
      │  Pusher Stage    │
      └─────────┬────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Sia Vector DB│ │  Terrablob   │ ◄─── Distribusi Snapshot ke Serving Leaves
│(Indeks Aktif)│ │(Blob Storage)│
└──────────────┘ └──────────────┘
```

1. **Ekstraksi Data Terdistribusi:** Spark menarik konten dari Engwiki dan Stack Overflow internal, lalu memasukkannya ke dalam Spark DataFrame. Yang krusial: URL sumber selalu dipertahankan berdampingan dengan teks di setiap baris data demi atribusi nanti.
2. **Chunking & Embedding:** Uber menggunakan LangChain untuk memecah dokumen menjadi unit-unit kecil (_chunks_), lalu menjalankan fungsi Python terdistribusi melalui Spark untuk memanggil model embedding OpenAI.
3. **Pusher Stage:** Indeks vektor yang dihasilkan diunggah ke **Sia** (solusi _vector database_ internal milik Uber) dan berkas snapshot disimpan di **Terrablob** (penyimpanan blob Uber). Mesin pelayan (_serving leaves_) mengunduh snapshot ini untuk melayani pencarian secara lokal dengan latensi rendah.

---

## 3. Alur Kerja Layanan: Knowledge Service dan Sitasi Sub-Konteks

Ketika seorang developer memposting pertanyaan di Slack, alur pemrosesan ditangani oleh **Knowledge Service**:

```
Pertanyaan di Slack: "Bagaimana cara menaikkan batas memori job Spark?"
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Ubah pertanyaan menjadi vektor embedding                │
│ 2. Cari potongan dokumen relevan di Sia Vector DB           │
│ 3. Kembalikan pasangan teks + URL sumber asli               │
└─────────────────────────────┬──────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Rekonstruksi Prompt LLM:                                    │
│ • Setiap bagian referensi disajikan sebagai Sub-Context unik│
│ • Model diinstruksikan hanya menjawab berdasarkan bukti     │
│ • Wajib menyertakan URL rujukan sebagai sitasi inline       │
└─────────────────────────────┬──────────────────────────┘
                              │
                              ▼
Jawaban di Slack + Tombol Aksi: [Buka Sumber] [Tanya Lanjutan] [Eskalasi ke Manusia]
```

Jika Genie merasa informasi yang tersedia tidak mencukupi untuk menjawab pertanyaan, ia tidak akan memaksakan diri atau mengarang jawaban. Sistem secara jujur memberi tahu bahwa data tidak ditemukan, lalu **mengarahkan pengguna ke engineer on-call yang bertugas dan secara otomatis membisukan (_mute_) dirinya sendiri** agar tidak mengganggu percakapan antar-manusia.

---

## 4. Evaluasi Ganda: Evaluasi Jawaban dan Evaluasi Dokumen

Kekuatan arsitektur Uber terletak pada sistem umpan balik dan evaluasinya yang berlapis:

1. **Umpan Balik Pengguna Nyata:** Pengguna di Slack dapat memilih salah satu dari empat kategori respons: _Resolved_, _Helpful_, _Not Helpful_, atau _Not Relevant_. Data ini dialirkan melalui Apache Kafka ke tabel Apache Hive untuk dianalisis di dashboard manajemen.
2. **Evaluasi Jawaban (_Answer Evaluation_):** Pipeline evaluator menggunakan metode _LLM as a judge_ di platform **Michelangelo** milik Uber untuk memeriksa apakah respons Genie benar-benar didukung oleh sub-konteks yang diberikan dan bebas dari halusinasi.
3. **Evaluasi Dokumen Sumber (_Document Evaluation_):** Ini adalah inovasi paling bernilai. Jika sebuah dokumen internal ditulis dengan buruk, ambigu, atau prasyaratnya tidak lengkap, sistem RAG tercanggih sekalipun akan menghasilkan jawaban yang buruk. Uber menjalankan LLM judge untuk **menilai kualitas dokumen Engwiki itu sendiri**, memberikan skor kejelasan, dan menghasilkan saran perbaikan konkret kepada penulis dokumen.

---

## Pelajaran bagi Penerapan RAG Enterprise

Keberhasilan Uber Genie membuktikan bahwa membangun aplikasi AI untuk kebutuhan enterprise bukan sekadar menyambungkan LLM ke basis data vektor.

Nilai sejati sistem terletak pada **desain alur kerja yang menyeluruh**: integrasi ke ruang kerja yang sudah dipakai karyawan (Slack), perlindungan terhadap halusinasi melalui sitasi eksplisit, jalur eskalasi mulus ke manusia, serta audit kualitas berkelanjutan terhadap dokumen sumber itu sendiri.

---

## Sumber dan Rujukan Terkait

- [ByteByteGo — How Uber Built a Genie to Answer Questions Correctly](https://blog.bytebytego.com/p/how-uber-built-a-genie-to-answer-051)
- [Uber Engineering Blog — Genie: Uber’s Gen AI On-Call Copilot](https://www.uber.com/us/en/blog/genie-ubers-gen-ai-on-call-copilot/)
- [Meet Michelangelo: Uber’s Machine Learning Platform](https://www.uber.com/us/en/blog/michelangelo-machine-learning-platform/)
