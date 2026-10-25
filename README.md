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

## Batasan demo dan pekerjaan sebelum peluncuran

- Rekaman For Revenge yang ada adalah **satu lagu**, belum dokumentasi satu pertunjukan 30+ menit. Batas preview 15 detik hanya untuk memperagakan paywall; rencana produk adalah **2–3 lagu penuh gratis** sebelum akses konser lengkap.
- Jangan memperlakukan pembayaran simulasi sebagai pembayaran resmi; saat produksi dibutuhkan webhook terverifikasi, idempotensi transaksi, dan pemberian akses **berdasarkan album atau konser yang dibeli**.
- Aset audio/video yang berada di `public/media` adalah **publik** dan tidak dapat dipakai sebagai konten berbayar yang terlindungi. Pindahkan master penuh ke penyimpanan privat dan gunakan akses terbatas/signed URLs untuk produksi.
- Tidak semua referensi trek dalam katalog demo memiliki file audio di repository; pemeriksaan aset dibutuhkan.
- Perjanjian hak rekaman, hak karya musik, pembagian hasil, dan pengembalian advance royalty dikelola per artis/konten sesuai kesepakatan.
- Ticketing produksi perlu daftar event, tier harga, stok/ketersediaan, pembayaran, kode tiket unik, pemindai check-in, pencegahan penggunaan ganda, dan alur refund.
- Voucher dan merchandise membutuhkan inventaris dan penukaran terverifikasi di server.
- Belum ada login pengguna, `My Collection`, atau sistem royalti produksi.

## Tech stack

Next.js 15, React 18, TypeScript, Tailwind CSS, Supabase (opsional; tidak digunakan untuk voting), dan adapter OpenNext untuk Cloudflare Workers.

## Jalankan lokal

```bash
npm ci
npm run build
npm run dev
```

Pembayaran tidak boleh diaktifkan sebelum audit keamanan dan pengujian end-to-end.
