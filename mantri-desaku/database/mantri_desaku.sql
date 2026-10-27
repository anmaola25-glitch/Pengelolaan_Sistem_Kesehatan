-- ========================================================
-- SISTEM INFORMASI PENGELOLAAN REKAM MEDIS
-- PRAKTIK MANTRI DESAKU BERBASIS WEBSITE
-- Database: mantri_desaku
-- ========================================================

CREATE DATABASE IF NOT EXISTS `mantri_desaku` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mantri_desaku`;

-- --------------------------------------------------------
-- 1. Tabel users (Petugas & Mantri)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rekam_medis`;
DROP TABLE IF EXISTS `audit_log`;
DROP TABLE IF EXISTS `pasien`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'mantri', 'petugas') NOT NULL DEFAULT 'mantri',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Tabel pasien
-- --------------------------------------------------------
CREATE TABLE `pasien` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no_rm` VARCHAR(20) NOT NULL UNIQUE,
  `nama` VARCHAR(120) NOT NULL,
  `tanggal_lahir` DATE NOT NULL,
  `jenis_kelamin` ENUM('L', 'P') NOT NULL,
  `alamat` TEXT NOT NULL,
  `no_telepon` VARCHAR(20) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_no_rm` (`no_rm`),
  INDEX `idx_nama_pasien` (`nama`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Tabel rekam_medis
-- --------------------------------------------------------
CREATE TABLE `rekam_medis` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pasien_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `tanggal_kunjungan` DATETIME NOT NULL,
  `keluhan` TEXT NOT NULL,
  `riwayat_keluhan` TEXT NULL,
  `hasil_pemeriksaan` TEXT NOT NULL,
  `diagnosis` VARCHAR(255) NOT NULL,
  `tindakan` TEXT NOT NULL,
  `pengobatan` TEXT NOT NULL,
  `catatan_tambahan` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pasien_id` (`pasien_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_tanggal_kunjungan` (`tanggal_kunjungan`),
  CONSTRAINT `fk_rekam_medis_pasien` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rekam_medis_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Tabel audit_log (Pencatatan Keamanan & Aktivitas)
-- --------------------------------------------------------
CREATE TABLE `audit_log` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL,
  `aksi` VARCHAR(50) NOT NULL,
  `modul` VARCHAR(50) NOT NULL,
  `rincian` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- DATA AWAL (SEED DATA UNTUK PENGEMBANGAN & UJI SISTEM)
-- ========================================================

-- Akun default:
-- Username: mantri
-- Password default: admin123 (hash password_hash('admin123', PASSWORD_BCRYPT))
INSERT INTO `users` (`id`, `nama`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'Mantri Ahmad Fauzi, S.Kep., Ners.', 'mantri', '$2y$10$vU5.E2vN4X/6lJjR.sM24u6Yg0a9t3eL/xXgM6e7YqK/W/kQ8b.4a', 'mantri', '2026-01-10 08:00:00'),
(2, 'Siti Rahmawati, A.Md.Kep', 'petugas1', '$2y$10$xR0y7sB3jD9kL2pW8mQ6nuZbL1yF8vN5qX4mK9wP3tL2jD8sA1fGy', 'petugas', '2026-02-01 09:30:00');

-- Data Awal Pasien
INSERT INTO `pasien` (`id`, `no_rm`, `nama`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `no_telepon`, `created_at`, `updated_at`) VALUES
(1, 'RM-2026-0001', 'Supardi Wiryo', '1968-05-14', 'L', 'Dusun Krajan RT 02 / RW 01, Desa Sukamaju', '0812-3456-7890', '2026-09-01 08:30:00', '2026-09-01 08:30:00'),
(2, 'RM-2026-0002', 'Siti Aminah', '1975-11-20', 'P', 'Dusun Sukarame RT 04 / RW 02, Desa Sukamaju', '0857-1122-3344', '2026-09-12 10:15:00', '2026-09-12 10:15:00'),
(3, 'RM-2026-0003', 'Bambang Sudibyo', '1982-03-08', 'L', 'Dusun Karangtengah RT 01 / RW 03, Desa Sukamaju', '0821-9988-7766', '2026-09-20 14:00:00', '2026-09-20 14:00:00'),
(4, 'RM-2026-0004', 'Sri Wahyuni', '1990-08-25', 'P', 'Dusun Krajan RT 05 / RW 01, Desa Sukamaju', '0813-4455-6677', '2026-10-02 09:00:00', '2026-10-02 09:00:00'),
(5, 'RM-2026-0005', 'Aditya Pratama (Anak)', '2019-06-11', 'L', 'Dusun Sukarame RT 02 / RW 02, Desa Sukamaju', '0852-6677-8899', '2026-10-10 11:20:00', '2026-10-10 11:20:00'),
(6, 'RM-2026-0006', 'Hj. Rohanah', '1959-12-03', 'P', 'Dusun Karangtengah RT 03 / RW 03, Desa Sukamaju', '0819-3322-1100', '2026-10-15 08:45:00', '2026-10-15 08:45:00'),
(7, 'RM-2026-0007', 'Teguh Santoso', '1985-04-17', 'L', 'Dusun Krajan RT 01 / RW 01, Desa Sukamaju', '0878-5544-3322', '2026-10-22 13:10:00', '2026-10-22 13:10:00');

-- Data Awal Rekam Medis
INSERT INTO `rekam_medis` (`id`, `pasien_id`, `user_id`, `tanggal_kunjungan`, `keluhan`, `riwayat_keluhan`, `hasil_pemeriksaan`, `diagnosis`, `tindakan`, `pengobatan`, `catatan_tambahan`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-10-12 09:15:00', 'Kepala pusing berdenyut di tengkuk sejak 2 hari, badan lemas dan leher kaku.', 'Riwayat tensi tinggi, sering konsumsi makanan asin saat hajatan.', 'TD: 150/95 mmHg, BB: 68 kg, Suhu: 36.6 C, Nadi: 84 x/mnt, RR: 18 x/mnt.', 'Hipertensi Grade 1 (Esensial)', 'Pemeriksaan TTV, edukasi diet rendah garam dan relaksasi.', 'Amlodipine 5 mg (1x1 malam sesudah makan), Vitamin B Kompleks (1x1).', 'Kontrol 7 hari atau segera bila nyeri dada.', '2026-10-12 09:30:00', '2026-10-12 09:30:00'),
(2, 2, 1, '2026-10-18 10:30:00', 'Nyeri ulu hati melilit, perut kembung, mual saat telat makan.', 'Keluhan hilang timbul sebulan terakhir karena kesibukan panen sawah.', 'TD: 120/80 mmHg, BB: 54 kg, Suhu: 36.7 C, Nadi: 78 x/mnt. Nyeri tekan epigastrium (+).', 'Sindroma Dispepsia (Gastritis Akut Ringan)', 'Pemeriksaan abdomen, edukasi pola makan teratur porsi kecil sering.', 'Antasida Doen (3x1 tab kunyah 30 mnt ac), Omeprazole 20 mg (2x1 ac).', 'Hindari kopi, makanan pedas, dan asam.', '2026-10-18 10:45:00', '2026-10-18 10:45:00'),
(3, 5, 1, '2026-10-24 16:00:00', 'Demam sejak semalam, batuk dahak dan pilek tersumbat.', 'Tertular teman bermain di TK.', 'Suhu: 38.3 C, BB: 18 kg, Nadi: 96 x/mnt, RR: 22 x/mnt. Faring hiperemis ringan.', 'Infeksi Saluran Pernapasan Akut (ISPA) Non-Spesifik', 'Kompres hangat, edukasi konsumsi cairan hangat dan sup.', 'Paracetamol sirup 120mg/5ml (3x1 cth prn demam), Ambroxol sirup (3x 1/2 cth).', 'Bila demam > 3 hari rujuk Puskesmas.', '2026-10-24 16:15:00', '2026-10-24 16:15:00'),
(4, 3, 1, '2026-10-26 08:30:00', 'Luka lecet dan robek dangkal di lutut kanan akibat jatuh dari motor.', 'Kejadian 1 jam yang lalu, luka sudah dibasuh air sumur.', 'TD: 125/80 mmHg, BB: 70 kg, Suhu: 36.5 C. Vulnus laceratum superficialis lutut dekstra uk. 3x1 cm.', 'Vulnus Excoriatum & Laceratum Genu Dekstra', 'Debridement luka NaCl 0.9%, desinfeksi povidone iodine, dressing kassa steril.', 'Amoxicillin 500 mg (3x1 tab pc - 5 hari), Asam Mefenamat 500 mg (3x1 tab prn nyeri).', 'Ganti perban kontrol 2 hari lagi.', '2026-10-26 08:45:00', '2026-10-26 08:45:00'),
(5, 6, 1, '2026-10-26 10:15:00', 'Kedua lutut ngilu dan kaku bangun tidur, sulit jongkok saat sholat.', 'Sudah beberapa bulan, memberat saat cuaca dingin.', 'TD: 135/85 mmHg, BB: 62 kg, Suhu: 36.4 C. Krepitasi genu bilateral (+).', 'Osteoarthritis Genu Bilateral Ringan', 'Pemeriksaan ROM, edukasi peregangan ringan tanpa beban berlebih.', 'Meloxicam 7.5 mg (1x1 tablet sesudah makan), Gel analgesik pereda sendi.', 'Hindari duduk bersila terlalu lama.', '2026-10-26 10:30:00', '2026-10-26 10:30:00');

-- Catatan audit log awal
INSERT INTO `audit_log` (`user_id`, `aksi`, `modul`, `rincian`, `created_at`) VALUES
(1, 'DATABASE_INIT', 'SISTEM', 'Inisialisasi skema database mantri_desaku berhasil dilakukan.', '2026-10-26 08:00:00');
