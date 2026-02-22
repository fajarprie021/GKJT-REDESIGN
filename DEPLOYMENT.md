# Panduan Deploy ke Vercel + TiDB Serverless (Gratis)

Ini adalah panduan lengkap untuk deploy sementara secara gratis menggunakan **Vercel** (hosting) dan **TiDB Serverless** (database MySQL-compatible).

---

## Langkah 1: Export Database dari XAMPP

1. Buka **phpMyAdmin** (http://localhost/phpmyadmin)
2. Pilih database `db_ci_gkj2`
3. Klik tab **Export** → pilih format **SQL** → klik **Go**
4. Simpan file `.sql` yang didownload

---

## Langkah 2: Setup TiDB Serverless (Database Gratis)

1. Daftar di [tidbcloud.com](https://tidbcloud.com) (bisa pakai akun Google)
2. Buat **Serverless Cluster** baru (pilih region Asia Pacific)
3. Setelah cluster siap, klik **Connect**
4. Pilih driver **MySQL CLI** dan catat connection info:
   - **Host**
   - **Port** (biasanya 4000)
   - **User**
   - **Password**
5. Import database: Di TiDB Cloud Console, buka **Import** → upload file `.sql` dari Langkah 1

---

## Langkah 3: Push Kode ke GitHub

Jika belum pakai Git:
```bash
git init
git add .
git commit -m "initial commit"
```

Buat repository baru di [github.com](https://github.com/new), lalu:
```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

---

## Langkah 4: Deploy ke Vercel

1. Daftar/login di [vercel.com](https://vercel.com) (gratis, pakai GitHub)
2. Klik **Add New Project** → Import repository GitHub Anda
3. Buka bagian **Environment Variables**, tambahkan:

   | Key | Value |
   |-----|-------|
   | `DB_HOST` | *(Host dari TiDB)* |
   | `DB_USER` | *(User dari TiDB)* |
   | `DB_PASSWORD` | *(Password dari TiDB)* |
   | `DB_NAME` | `db_ci_gkj2` |
   | `DB_PORT` | `4000` |

4. Klik **Deploy** — Vercel akan otomatis build dan deploy!

---

## Catatan Penting

- **Gambar**: Gambar yang disimpan di folder `public/` akan tetap tampil. Gambar yang di-load dari XAMPP (`localhost/gkjtangerang/...`) **tidak akan muncul** di production — perlu dipindahkan ke folder `public/` atau ke layanan storage seperti Cloudinary.
- **URL**: Vercel akan memberikan URL gratis seperti `your-app.vercel.app`

---

## Troubleshooting

- **Database connection error**: Pastikan environment variables sudah benar dan port `4000` digunakan.
- **SSL error**: Kode `lib/db.js` sudah dikonfigurasi otomatis untuk SSL di production.
- **Build error**: Jalankan `npm run build` secara lokal untuk cek error sebelum push.
