# PETUNJUK INSTALASI & PENGGUNAAN
## SISTEM INFORMASI PENGELOLAAN REKAM MEDIS PRAKTIK MANTRI DESAKU

Aplikasi website ini dirancang khusus untuk memfasilitasi Praktik Mandiri Mantri Desa / Tenaga Perawat dalam pencatatan data pasien, dokumentasi rekam medis, penelusuran riwayat kunjungan, serta penerbitan laporan berkala secara digital.

---

### 1. Kebutuhan Sistem & Perangkat Lunak
- **Web Server & Database**: XAMPP (Apache & MySQL / MariaDB) versi PHP 7.4, 8.0, 8.1, atau 8.2+.
- **Browser Modern**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari.
- **Composer** (opsional/disarankan): Untuk mengunduh library Dompdf.

---

### 2. Langkah Instalasi di XAMPP (Localhost)

1. **Salin Folder Proyek**:
   - Pindahkan seluruh isi folder `mantri-desaku` ke dalam direktori `htdocs` XAMPP Anda:
     - Windows: `C:\xampp\htdocs\mantri-desaku\`
     - macOS: `/Applications/XAMPP/xamppfiles/htdocs/mantri-desaku/`
     - Linux: `/opt/lampp/htdocs/mantri-desaku/`

2. **Jalankan Apache & MySQL**:
   - Buka **XAMPP Control Panel**.
   - Klik tombol **Start** pada modul **Apache** dan **MySQL** hingga keduanya berwarna hijau (*Running*).

3. **Import Database MySQL**:
   - Buka web browser dan akses: `http://localhost/phpmyadmin`
   - Klik menu **Databases** (Basis Data), lalu buat database baru dengan nama: `mantri_desaku`
   - Klik tab **Import**, pilih file: `mantri-desaku/database/mantri_desaku.sql`
   - Klik tombol **Go** / **Import** di bagian bawah.
   - Database beserta seluruh tabel (`users`, `pasien`, `rekam_medis`, `audit_log`) dan data awal pasien fiktif desa akan dibuat secara otomatis.

4. **Konfigurasi Koneksi (Jika Diperlukan)**:
   - File konfigurasi database berada di `config/database.php`.
   - Konfigurasi default XAMPP:
     ```php
     $db_host = '127.0.0.1';
     $db_name = 'mantri_desaku';
     $db_user = 'root';
     $db_pass = ''; // default kosong di XAMPP
     ```

5. **Pemasangan Library Dompdf (Pembuatan PDF Server-Side)**:
   - Buka terminal / command prompt, masuk ke folder aplikasi:
     ```bash
     cd C:\xampp\htdocs\mantri-desaku
     composer require dompdf/dompdf
     ```
   - *Catatan*: Jika belum menginstal Composer, sistem tetap menyediakan mode cetak dokumen A4 berstandar resmi langsung melalui browser.

6. **Akses Aplikasi**:
   - Buka browser dan buka alamat:
     ```
     http://localhost/mantri-desaku/
     ```

---

### 3. Akun Pengguna Awal (Default)

Untuk keperluan pengujian dan demonstrasi awal:
- **Username**: `mantri`
- **Password Default**: `admin123`
- **Nama Petugas**: Mantri Ahmad Fauzi, S.Kep., Ners.
- **Peran**: Mantri Pelayanan

> **Cara Mengganti Password Akun**:
> 1. Masuk ke aplikasi dengan akun di atas.
> 2. Klik menu **Pengaturan Akun** di sidebar kiri.
> 3. Masukkan password lama (`admin123`).
> 4. Masukkan password baru (minimal 6 karakter) dan ulangi konfirmasi.
> 5. Klik **Simpan Password Baru**. Password akan dienkripsi ulang menggunakan algoritma aman `password_hash()` BCRYPT.

---

### 4. Penjelasan Fungsi Setiap Menu

1. **Dashboard Admin**:
   - Menghitung statistik riil langsung dari database MySQL: Total Pasien Terdaftar, Kunjungan Hari Ini, Kunjungan Bulan Ini, dan Total Rekam Medis.
   - Menampilkan tabel kunjungan pasien paling baru dengan akses cepat ke detail pemeriksaan.
2. **Data Pasien**:
   - Manajemen data demografi pasien desa (No. RM unik, Nama, Tgl Lahir, Jenis Kelamin, Alamat, No. Telp).
   - Fitur pencarian, filter jenis kelamin, pagination, penambahan pasien baru, pengeditan data, dan pencegahan penghapusan data pasien yang telah memiliki riwayat medis.
3. **Rekam Medis**:
   - Pendokumentasian pemeriksaan klinis oleh tenaga kesehatan berwenang.
   - Terdiri dari pemilihan pasien terdaftar, pencatatan tanggal kunjungan, keluhan utama, riwayat keluhan, tanda-tanda vital fisik (TD, BB, Suhu, Nadi, Pernapasan), diagnosis klinis, tindakan medis, resep obat/terapi, dan catatan tambahan edukasi.
4. **Riwayat Kunjungan**:
   - Linimasa kronologis kunjungan per pasien maupun keseluruhan pasien.
   - Dilengkapi filter berdasarkan pasien tertentu, rentang tanggal kunjungan, dan pengurutan (terbaru atau terlama).
5. **Laporan & PDF**:
   - Rekapitulasi administratif kunjungan berkala dengan filter tanggal awal dan akhir.
   - Pratinjau kop surat resmi Praktik Mantri Desaku dan tabel rekapitulasi etis (tanpa mengekspos diagnosis sensitif pada rekap umum).
   - Tombol **Download PDF** untuk mengunduh dokumen A4 resmi berpenomoran dan bertanda tangan mantri.
6. **Pengaturan Akun**:
   - Melihat identitas akun dan hak akses.
   - Mengubah password akun dengan verifikasi berlapis.

---

### 5. Langkah Uji Fungsional Sistem (Black Box Validation)

1. **Uji Autentikasi**:
   - Masukkan password salah pada halaman login -> Sistem menampilkan pesan kesalahan dan menolak masuk.
   - Masukkan username `mantri` dan password `admin123` -> Sistem berhasil mengarahkan ke dashboard.
2. **Uji Tambah Pasien**:
   - Buka menu Data Pasien -> Tambah Pasien -> Simpan data baru -> Data langsung muncul di tabel dan counter total pasien bertambah.
3. **Uji Rekam Medis**:
   - Buka Rekam Medis -> Catat Baru -> Pilih pasien yang baru ditambahkan -> Masukkan keluhan, tanda vital, diagnosis, dan tindakan -> Simpan -> Lihat detail rekam medis.
4. **Uji Riwayat Pasien**:
   - Buka Riwayat Kunjungan -> Filter berdasarkan pasien tersebut -> Pastikan riwayat pemeriksaan yang tampil hanya milik pasien bersangkutan dan tidak tercampur dengan pasien lain.
5. **Uji Ekspor Laporan PDF**:
   - Buka menu Laporan -> Tentukan rentang tanggal -> Klik "Download PDF" -> Pastikan file PDF terunduh dengan format A4 rapi, memuat data rekap yang sesuai, dan mencantumkan tanda tangan penanggung jawab praktik.
