import { User, Pasien, RekamMedis } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    nama: 'Mantri Ahmad Fauzi, S.Kep., Ners.',
    username: 'mantri',
    // SHA-256 or bcrypt hash representation for admin123
    passwordHash: 'admin123',
    role: 'mantri',
    created_at: '2026-01-10 08:00:00'
  },
  {
    id: 2,
    nama: 'Siti Rahmawati, A.Md.Kep',
    username: 'petugas1',
    passwordHash: 'petugas123',
    role: 'petugas',
    created_at: '2026-02-01 09:30:00'
  }
];

export const INITIAL_PASIEN: Pasien[] = [
  {
    id: 1,
    no_rm: 'RM-2026-0001',
    nama: 'Supardi Wiryo',
    tanggal_lahir: '1968-05-14',
    jenis_kelamin: 'L',
    alamat: 'Dusun Krajan RT 02 / RW 01, Desa Sukamaju',
    no_telepon: '0812-3456-7890',
    created_at: '2026-09-01 08:30:00',
    updated_at: '2026-09-01 08:30:00'
  },
  {
    id: 2,
    no_rm: 'RM-2026-0002',
    nama: 'Siti Aminah',
    tanggal_lahir: '1975-11-20',
    jenis_kelamin: 'P',
    alamat: 'Dusun Sukarame RT 04 / RW 02, Desa Sukamaju',
    no_telepon: '0857-1122-3344',
    created_at: '2026-09-12 10:15:00',
    updated_at: '2026-09-12 10:15:00'
  },
  {
    id: 3,
    no_rm: 'RM-2026-0003',
    nama: 'Bambang Sudibyo',
    tanggal_lahir: '1982-03-08',
    jenis_kelamin: 'L',
    alamat: 'Dusun Karangtengah RT 01 / RW 03, Desa Sukamaju',
    no_telepon: '0821-9988-7766',
    created_at: '2026-09-20 14:00:00',
    updated_at: '2026-09-20 14:00:00'
  },
  {
    id: 4,
    no_rm: 'RM-2026-0004',
    nama: 'Sri Wahyuni',
    tanggal_lahir: '1990-08-25',
    jenis_kelamin: 'P',
    alamat: 'Dusun Krajan RT 05 / RW 01, Desa Sukamaju',
    no_telepon: '0813-4455-6677',
    created_at: '2026-10-02 09:00:00',
    updated_at: '2026-10-02 09:00:00'
  },
  {
    id: 5,
    no_rm: 'RM-2026-0005',
    nama: 'Aditya Pratama (Anak)',
    tanggal_lahir: '2019-06-11',
    jenis_kelamin: 'L',
    alamat: 'Dusun Sukarame RT 02 / RW 02, Desa Sukamaju',
    no_telepon: '0852-6677-8899',
    created_at: '2026-10-10 11:20:00',
    updated_at: '2026-10-10 11:20:00'
  },
  {
    id: 6,
    no_rm: 'RM-2026-0006',
    nama: 'Hj. Rohanah',
    tanggal_lahir: '1959-12-03',
    jenis_kelamin: 'P',
    alamat: 'Dusun Karangtengah RT 03 / RW 03, Desa Sukamaju',
    no_telepon: '0819-3322-1100',
    created_at: '2026-10-15 08:45:00',
    updated_at: '2026-10-15 08:45:00'
  },
  {
    id: 7,
    no_rm: 'RM-2026-0007',
    nama: 'Teguh Santoso',
    tanggal_lahir: '1985-04-17',
    jenis_kelamin: 'L',
    alamat: 'Dusun Krajan RT 01 / RW 01, Desa Sukamaju',
    no_telepon: '0878-5544-3322',
    created_at: '2026-10-22 13:10:00',
    updated_at: '2026-10-22 13:10:00'
  }
];

export const INITIAL_REKAM_MEDIS: RekamMedis[] = [
  {
    id: 1,
    pasien_id: 1,
    user_id: 1,
    tanggal_kunjungan: '2026-10-12 09:15:00',
    keluhan: 'Kepala pusing berdenyut di bagian tengkuk sejak 2 hari yang lalu, badan terasa lemas dan kaku leher.',
    riwayat_keluhan: 'Ada riwayat tensi tinggi, sering mengonsumsi makanan bersantan dan asin saat hajatan desa.',
    hasil_pemeriksaan: 'TD: 150/95 mmHg, BB: 68 kg, Suhu: 36.6 °C, Nadi: 84 x/menit, RR: 18 x/menit. Keadaan umum cukup, konjungtiva tidak anemis.',
    pemeriksaan_fisik: {
      tekanan_darah: '150/95 mmHg',
      berat_badan: '68 kg',
      suhu_tubuh: '36.6 °C',
      denyut_nadi: '84 x/menit',
      laju_pernafasan: '18 x/menit'
    },
    diagnosis: 'Hipertensi Grade 1 (Esensial)',
    tindakan: 'Pemeriksaan tanda vital, edukasi pembatasan konsumsi garam dapur, tirah baring cukup, dan teknik relaksasi.',
    pengobatan: 'Amlodipine 5 mg (1x1 diminum malam hari sesudah makan), Vitamin B Kompleks (1x1 tablet).',
    catatan_tambahan: 'Kontrol ulang dalam 7 hari atau segera datang jika pandangan kabur atau nyeri dada.',
    created_at: '2026-10-12 09:30:00',
    updated_at: '2026-10-12 09:30:00',
    petugas_nama: 'Mantri Ahmad Fauzi, S.Kep., Ners.'
  },
  {
    id: 2,
    pasien_id: 2,
    user_id: 1,
    tanggal_kunjungan: '2026-10-18 10:30:00',
    keluhan: 'Nyeri ulu hati terasa perih melilit, perut kembung, mual terutama saat terlambat makan.',
    riwayat_keluhan: 'Keluhan hilang timbul sejak sebulan terakhir karena kesibukan panen padi dan telat sarapan.',
    hasil_pemeriksaan: 'TD: 120/80 mmHg, BB: 54 kg, Suhu: 36.7 °C, Nadi: 78 x/menit, RR: 16 x/menit. Palpasi abdomen nyeri tekan epigastrium (+).',
    pemeriksaan_fisik: {
      tekanan_darah: '120/80 mmHg',
      berat_badan: '54 kg',
      suhu_tubuh: '36.7 °C',
      denyut_nadi: '78 x/menit',
      laju_pernafasan: '16 x/menit'
    },
    diagnosis: 'Sindroma Dispepsia (Gastritis Akut Ringan)',
    tindakan: 'Pemeriksaan fisik abdomen, edukasi pola makan teratur porsi kecil tapi sering, hindari kopi/pedas/asam.',
    pengobatan: 'Antasida Doen tab kunyah (3x1 tab 30 menit sebelum makan), Omeprazole 20 mg (2x1 sebelum makan).',
    catatan_tambahan: 'Hindari obat anti-nyeri bebas tanpa resep. Istirahat pikiran dari stres.',
    created_at: '2026-10-18 10:45:00',
    updated_at: '2026-10-18 10:45:00',
    petugas_nama: 'Mantri Ahmad Fauzi, S.Kep., Ners.'
  },
  {
    id: 3,
    pasien_id: 5,
    user_id: 1,
    tanggal_kunjungan: '2026-10-24 16:00:00',
    keluhan: 'Demam sejak kemarin malam, batuk berdahak dan pilek hidung tersumbat, nafsu makan menurun.',
    riwayat_keluhan: 'Tertular teman bermain di TK yang sedang flu.',
    hasil_pemeriksaan: 'TD: - (Anak), BB: 18 kg, Suhu: 38.3 °C, Nadi: 96 x/menit, RR: 22 x/menit. Faring hiperemis ringan, ronki (-), wheezing (-).',
    pemeriksaan_fisik: {
      tekanan_darah: '-',
      berat_badan: '18 kg',
      suhu_tubuh: '38.3 °C',
      denyut_nadi: '96 x/menit',
      laju_pernafasan: '22 x/menit'
    },
    diagnosis: 'Infeksi Saluran Pernapasan Akut (ISPA) Non-Spesifik',
    tindakan: 'Kompres hangat ketiak dan dahi, edukasi ibu untuk banyak memberikan minum air putih hangat dan kaldu sup.',
    pengobatan: 'Paracetamol sirup 120mg/5ml (3 x 1 sendok takar 5ml saat demam), Ambroxol sirup (3 x 1/2 cth), Cetirizine sirup (1 x 1/2 cth malam).',
    catatan_tambahan: 'Bila dalam 3 hari demam tidak turun atau muncul sesak napas segera dirujuk ke Puskesmas.',
    created_at: '2026-10-24 16:15:00',
    updated_at: '2026-10-24 16:15:00',
    petugas_nama: 'Mantri Ahmad Fauzi, S.Kep., Ners.'
  },
  {
    id: 4,
    pasien_id: 3,
    user_id: 1,
    tanggal_kunjungan: '2026-10-26 08:30:00',
    keluhan: 'Luka lecet dan robek dangkal di lutut kanan serta telapak tangan kiri akibat terjatuh dari sepeda motor di jalan sawah.',
    riwayat_keluhan: 'Kejadian sekitar 1 jam yang lalu, luka sudah sempat dibasuh air sumur.',
    hasil_pemeriksaan: 'TD: 125/80 mmHg, BB: 70 kg, Suhu: 36.5 °C, Nadi: 80 x/menit, RR: 18 x/menit. Vulnus laceratum superficialis lutut dekstra uk. 3x1 cm tepi rata dangkal, ekskoriasi telapak tangan.',
    pemeriksaan_fisik: {
      tekanan_darah: '125/80 mmHg',
      berat_badan: '70 kg',
      suhu_tubuh: '36.5 °C',
      denyut_nadi: '80 x/menit',
      laju_pernafasan: '18 x/menit'
    },
    diagnosis: 'Vulnus Excoriatum & Laceratum Superficialis Genu Dekstra',
    tindakan: 'Debridement luka dengan NaCl 0.9%, desinfeksi povidone iodine, dressing kassa steril dan perban elastis. Edukasi perawatan luka tetap kering.',
    pengobatan: 'Amoxicillin 500 mg (3x1 tablet sesudah makan - 5 hari), Asam Mefenamat 500 mg (3x1 tablet sesudah makan bila nyeri), Salep antibiotik topikal.',
    catatan_tambahan: 'Ganti perban kontrol 2 hari lagi atau bila perban basah.',
    created_at: '2026-10-26 08:45:00',
    updated_at: '2026-10-26 08:45:00',
    petugas_nama: 'Mantri Ahmad Fauzi, S.Kep., Ners.'
  },
  {
    id: 5,
    pasien_id: 6,
    user_id: 1,
    tanggal_kunjungan: '2026-10-26 10:15:00',
    keluhan: 'Kedua lutut terasa ngilu dan kaku saat bangun tidur dan sulit untuk jongkok saat sholat.',
    riwayat_keluhan: 'Keluhan sudah dirasakan beberapa bulan terakhir, memberat saat cuaca dingin.',
    hasil_pemeriksaan: 'TD: 135/85 mmHg, BB: 62 kg, Suhu: 36.4 °C, Nadi: 76 x/menit, RR: 16 x/menit. Krepitasi pada sendi genu bilateral, tidak ada kemerahan/edema hebat.',
    pemeriksaan_fisik: {
      tekanan_darah: '135/85 mmHg',
      berat_badan: '62 kg',
      suhu_tubuh: '36.4 °C',
      denyut_nadi: '76 x/menit',
      laju_pernafasan: '16 x/menit'
    },
    diagnosis: 'Osteoarthritis Genu Bilateral Ringan - Sedang',
    tindakan: 'Pemeriksaan rentang gerak sendi, edukasi peregangan ringan tanpa membebani lutut, kompres air hangat di malam hari.',
    pengobatan: 'Meloxicam 7.5 mg (1x1 tablet sesudah makan), Glukosamin tab (1x1), Gel analgesik pereda nyeri sendi.',
    catatan_tambahan: 'Kurangi naik turun tangga terjal dan hindari duduk bersila terlalu lama.',
    created_at: '2026-10-26 10:30:00',
    updated_at: '2026-10-26 10:30:00',
    petugas_nama: 'Mantri Ahmad Fauzi, S.Kep., Ners.'
  }
];
