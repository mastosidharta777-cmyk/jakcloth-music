# Aturan Preview dan Paywall — JakCloth Music

Status: **Keputusan produk untuk rilis katalog penuh. Belum aktif dalam demo saat ini.**

## 1. Album kompilasi

Pengunjung boleh memilih lagu apa pun dari album yang sama untuk **3 kesempatan pemutaran penuh tanpa bayar**. Ketiga kesempatan bisa:
- tiga lagu berbeda dengan urutan bebas;
- tiga lagu berurutan;
- satu lagu yang sama diulang tiga kali;
- kombinasi di atas.

**Aturan UX yang disetujui**
1. **Pemutaran #1:** lagu diputar dari awal hingga selesai tanpa interupsi. Setelah lagu selesai, ajakan dukungan kecil ditampilkan **di bawah player yang sama**, bukan popup dan tidak menutupi kontrol pemutar. CTA nominal mulai Rp10.000 boleh dipilih; tersedia pilihan lanjut gratis.
2. **Pemutaran #2 dan #3:** bisa memilih lagu mana saja dari album yang sama; keduanya selesai utuh tanpa popup atau gangguan wajib.
3. **Permintaan pemutaran #4:** tampilkan paywall **sebelum** audio dimulai. Jangan menghentikan lagu yang sedang berlangsung. Jelaskan bahwa tiga kesempatan gratis telah digunakan, dan tawarkan **Pay What You Want** mulai Rp10.000 untuk membuka keseluruhan album.
4. **Sudah membeli album:** semua lagu di album tersebut bebas diputar tanpa kuota, sepanjang hak akses aktif sesuai produk yang disepakati.
5. **Tiap album mempunyai kuota tersendiri**. Hitungan lagu pada album A tidak mengurangi album B.

### Penghitungan agar tidak merugikan pendengar

- Satu kesempatan adalah satu permintaan pemutaran lagu yang sudah diberi izin dan mulai diputar. Lagu dapat terus didengar sampai selesai meskipun hitungan telah mencapai 3.
- Pause, resume, penggeseran posisi, atau gangguan jaringan yang melanjutkan **sesi pemutaran yang sama** tidak menambah hitungan.
- Memilih lagu lain atau memulai replay baru dihitung sebagai kesempatan berikutnya. Jangan menambah hitungan hanya dari event browser berulang.
- Penawaran *soft selling* hanya setelah lagu gratis pertama selesai. Jangan terus-menerus memunculkannya pada pemutaran #2 dan #3.
- Nominal Rp10.000 adalah minimum **untuk satu album**, bukan harga untuk satu lagu. Kontrak royalti setiap artis harus terpisah dari aturan preview.

### Teknis sebelum produksi

- Hitungan yang benar harus dikelola **server-side**, terkait identitas/sesi yang sesuai; `localStorage` hanya boleh dipakai sebagai bantuan UI, bukan penegak akses.
- Akses media penuh tidak boleh tersedia bebas melalui `public/media`; gunakan media privat dengan hak akses singkat atau mekanisme streaming terlindungi.
- Backend harus menangani play grant/idempotency sehingga retry, buffering, dan pause/resume tidak menghabiskan jatah.
- Hanya webhook pembayaran **terverifikasi** yang boleh memberikan entitlements untuk album yang dibeli.
- Penyalahgunaan multi-device, pengunjung anonim, pemulihan akses setelah pembelian dan batas perangkat perlu diselesaikan sebelum go-live.
- Ukur: conversion/100 pendengar unik, total penjualan, pendapatan bersih, jumlah artis berbeda didengar, paywall abandon, dan keluhan pendengar. Batas 3 kali adalah **hipotesis bisnis**, bukan klaim hasil terbaik.

## 2. Konser live panjang

- Produk terpisah dari kompilasi.
- Untuk rekaman konser 30–60 menit, hipotesis awal adalah **dua lagu penuh** (opsi pengujian 2–3) sebelum tawaran akses untuk sisa konser.
- Tawaran dilakukan **pada jeda antar-lagu**, tidak memotong chorus atau satu lagu di tengah-tengah; hak akses dan royalti khusus rekaman konser harus disepakati.
- Pembelian per konser tidak otomatis berarti membeli semua rekaman artis lain.

## 3. Apa yang benar-benar berfungsi di demo sekarang?

- Baru ada **satu file lagu per album**: Daun Jatuh, The Skit, dan Undelayed. Lagu lain masih hanya baris katalog.
- Ketiga lagu contoh boleh diputar **penuh dan tanpa batas**, tanpa pemblokiran pada pemutaran #4.
- CTA dukungan dapat muncul di bawah inline player setelah lagu selesai.
- Satu rekaman live For Revenge dapat diputar utuh.
- Checkout dan voucher hanya simulasi; **belum ada transaksi, hak akses, royalti, penghitung produksi, atau paywall asli**.

**Jangan mengaktifkan aturan 3 kali pada demo yang hanya punya satu lagu per album tanpa sistem pembayaran dan katalog lengkap.**
