export type UserRole = 'admin' | 'mantri' | 'petugas';

export interface User {
  id: number;
  nama: string;
  username: string;
  passwordHash?: string;
  role: UserRole;
  created_at: string;
}

export interface Pasien {
  id: number;
  no_rm: string;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  alamat: string;
  no_telepon: string;
  created_at: string;
  updated_at: string;
}

export interface PemeriksaanFisik {
  tekanan_darah?: string; // e.g., 120/80 mmHg
  berat_badan?: string;   // e.g., 65 kg
  suhu_tubuh?: string;    // e.g., 36.5 C
  denyut_nadi?: string;   // e.g., 80 x/menit
  laju_pernafasan?: string; // e.g., 18 x/menit
}

export interface RekamMedis {
  id: number;
  pasien_id: number;
  user_id: number;
  tanggal_kunjungan: string; // YYYY-MM-DD HH:mm:ss
  keluhan: string;
  riwayat_keluhan?: string;
  hasil_pemeriksaan: string; // formatted text or vital signs
  pemeriksaan_fisik?: PemeriksaanFisik;
  diagnosis: string;
  tindakan: string;
  pengobatan: string;
  catatan_tambahan?: string;
  created_at: string;
  updated_at: string;
  
  // Joined relation fields for convenience
  pasien?: Pasien;
  petugas_nama?: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  aksi: string;
  modul: 'AUTH' | 'PASIEN' | 'REKAM_MEDIS' | 'PENGATURAN' | 'LAPORAN';
  rincian: string;
  waktu: string;
}

export interface DashboardStats {
  totalPasien: number;
  kunjunganHariIni: number;
  kunjunganBulanIni: number;
  totalRekamMedis: number;
}
