# JakCloth Music & Merch — Demo V2

Prototype resmi untuk diskusi produk: pengalaman festival JakCloth yang menghubungkan **tiket event, rekaman live, kompilasi musik, merchandise, dan artis favorit**.

## Pengalaman pengunjung

1. Dari beranda pilih **Tiket**, **Live**, **Kompilasi**, **Merch**, atau **Artis Favorit**.
2. Pengunjung dapat menonton/mendengarkan cuplikan rekaman atau memilih album kompilasi.
3. Tombol **Dukung artis** membuka formulir *pay-what-you-want*, mulai Rp10.000 (contoh nominal Rp10.000/Rp25.000/Rp50.000 atau nominal sendiri).
4. Checkout **hanya simulasi**. Tidak ada tagihan yang dikirim maupun royalti yang dibayarkan.
5. **Ikuti Artis** menyimpan pilihan sementara di browser perangkat, bukan akun penggemar dan belum mengirim notifikasi.
6. Tombol **Events & Tickets** untuk saat ini adalah placeholder; belum menerima pembayaran dan tidak menerbitkan e-ticket.
7. Merchandise, voucher dan kode QR pada demo adalah prototipe; tidak merepresentasikan produk atau voucher yang sudah aktif.

## Aturan preview yang sudah disepakati

Spesifikasi untuk rilis penuh: [Preview 3 pemutaran per album, soft selling, dan paywall live](docs/preview-paywall-policy.md). **Belum diterapkan sebagai pembatasan di demo.**

## Batasan demo dan pekerjaan sebelum peluncuran

- Rekaman For Revenge yang ada adalah **satu lagu**, belum dokumentasi satu pertunjukan 30+ menit. Saat demo, video/audio live ini serta lagu pertama dari setiap kompilasi dapat diputar sampai selesai secara gratis. **Tidak ada paywall otomatis di detik ke-15.** Setelah sebuah lagu selesai, ajakan dukungan muncul tanpa memblokir pemutar. Untuk konser lengkap nantinya, rencana awal adalah **2–3 lagu utuh gratis**, lalu menawarkan akses konser tersisa pada **batas antar-lagu**, bukan di tengah lagu. Durasi/penempatan batas gratis perlu diuji terhadap penonton nyata.
- Jangan memperlakukan pembayaran simulasi sebagai pembayaran resmi; saat produksi dibutuhkan webhook terverifikasi, idempotensi transaksi, dan pemberian akses **berdasarkan album atau konser yang dibeli**.
- Aset audio/video yang berada di `public/media` adalah **publik** dan tidak dapat dipakai sebagai konten berbayar yang terlindungi. Pindahkan master penuh ke penyimpanan privat dan gunakan akses terbatas/signed URLs untuk produksi.
- Tidak semua referensi trek dalam katalog demo memiliki file audio di repository; pemeriksaan aset dibutuhkan.
- Perjanjian hak rekaman, hak karya musik, pembagian hasil, dan pengembalian advance royalty dikelola per artis/konten sesuai kesepakatan.
- Ticketing produksi perlu daftar event, tier harga, stok/ketersediaan, pembayaran, kode tiket unik, pemindai check-in, pencegahan penggunaan ganda, dan alur refund.
- Voucher dan merchandise membutuhkan inventaris dan penukaran terverifikasi di server.
- Belum ada login pengguna, `My Collection`, atau sistem royalti produksi.


## Fan Choice — simulasi interaktif

Fan Choice tersedia **langsung di beranda (`/`)** sesudah bagian Promo Brand di Event (setelah Merchandise). Tombol navigasi menuju bagian `#fan-choice`, tanpa meninggalkan halaman. Alamat **`/fan-choice`** tetap bisa digunakan untuk akses langsung dan memakai komponen serta penyimpanan simulasi yang sama. Bagian lama **Artis Favorit** dengan tombol `+ Ikuti` dihapus karena fungsinya tumpang tindih. Demo mendukung:
- Memilih kota tujuan (Jakarta, Bandung, Surabaya, Yogyakarta, Medan, Bali, atau kota lain).
- Mencari dan mendukung artis pada daftar contoh, dengan dukungan terpisah per kota.
- Mengusulkan artis/band baru, mendeteksi nama yang sama, dan menambahkan dukungan untuk usulan tersebut. Genre dapat diketik bebas dan **boleh dikosongkan**; tanpa pilihan otomatis. Genre yang disampaikan pengunjung bukan klasifikasi resmi dan masih perlu diverifikasi JakCloth.
- Menyimpan dukungan serta usulan di localStorage perangkat, bahkan setelah halaman dimuat ulang.

**Batasan:** tanpa login, backend, moderasi, database publik, peringkat umum, atau penghitungan suara lintas perangkat. Angka dukungan yang ditampilkan hanya milik perangkat ini. Artis di daftar adalah contoh, bukan kandidat resmi atau konfirmasi booking. Jangan gunakan data demo sebagai masukan keputusan booking JakCloth. Produksi membutuhkan akun terverifikasi, deduplikasi di server, perlindungan spam, moderasi nama, dan agregasi kota secara aman.

## Tech stack

Next.js 15, React 18, TypeScript, Tailwind CSS, Supabase (opsional; tidak digunakan untuk voting), dan adapter OpenNext untuk Cloudflare Workers.

## Jalankan lokal

```bash
npm ci
npm run build
npm run dev
```

Pembayaran tidak boleh diaktifkan sebelum audit keamanan dan pengujian end-to-end.
