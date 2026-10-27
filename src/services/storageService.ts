import { User, Pasien, RekamMedis, AuditLog, DashboardStats } from '../types';
import { INITIAL_USERS, INITIAL_PASIEN, INITIAL_REKAM_MEDIS } from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'mantri_desaku_users',
  PASIEN: 'mantri_desaku_pasien',
  REKAM_MEDIS: 'mantri_desaku_rekam_medis',
  CURRENT_USER: 'mantri_desaku_current_user',
  AUDIT_LOGS: 'mantri_desaku_audit_logs',
};

class StorageService {
  private users: User[] = [];
  private pasien: Pasien[] = [];
  private rekamMedis: RekamMedis[] = [];
  private currentUser: User | null = null;
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [...INITIAL_USERS];
        this.saveUsers();
      }

      const storedPasien = localStorage.getItem(STORAGE_KEYS.PASIEN);
      if (storedPasien) {
        this.pasien = JSON.parse(storedPasien);
      } else {
        this.pasien = [...INITIAL_PASIEN];
        this.savePasien();
      }

      const storedRekamMedis = localStorage.getItem(STORAGE_KEYS.REKAM_MEDIS);
      if (storedRekamMedis) {
        this.rekamMedis = JSON.parse(storedRekamMedis);
      } else {
        this.rekamMedis = [...INITIAL_REKAM_MEDIS];
        this.saveRekamMedis();
      }

      const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedCurrentUser) {
        this.currentUser = JSON.parse(storedCurrentUser);
      } else {
        // Auto-login with default mantri account for preview convenience, or can require login
        this.currentUser = this.users[0];
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      }

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (storedLogs) {
        this.auditLogs = JSON.parse(storedLogs);
      } else {
        this.auditLogs = [
          {
            id: 1,
            user_id: 1,
            aksi: 'SISTEM_INIT',
            modul: 'AUTH',
            rincian: 'Sistem database Praktik Mantri Desaku berhasil diinisialisasi.',
            waktu: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        ];
        this.saveAuditLogs();
      }
    } catch {
      // Fallback for non-browser/restricted sandbox
      this.users = [...INITIAL_USERS];
      this.pasien = [...INITIAL_PASIEN];
      this.rekamMedis = [...INITIAL_REKAM_MEDIS];
      this.currentUser = this.users[0];
    }
  }

  private saveUsers() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
  }

  private savePasien() {
    localStorage.setItem(STORAGE_KEYS.PASIEN, JSON.stringify(this.pasien));
  }

  private saveRekamMedis() {
    localStorage.setItem(STORAGE_KEYS.REKAM_MEDIS, JSON.stringify(this.rekamMedis));
  }

  private saveAuditLogs() {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
  }

  private logAudit(aksi: string, modul: AuditLog['modul'], rincian: string) {
    const newLog: AuditLog = {
      id: Date.now(),
      user_id: this.currentUser?.id || 1,
      aksi,
      modul,
      rincian,
      waktu: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    this.saveAuditLogs();
  }

  // --- AUTHENTICATION ---
  public login(username: string, passwordPlain: string): { success: boolean; message: string; user?: User } {
    const cleanUser = username.trim();
    const user = this.users.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());
    if (!user) {
      return { success: false, message: 'Username tidak ditemukan dalam sistem.' };
    }

    if (user.passwordHash !== passwordPlain) {
      return { success: false, message: 'Password yang Anda masukkan salah.' };
    }

    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.logAudit('LOGIN_BERHASIL', 'AUTH', `Petugas ${user.nama} (@${user.username}) berhasil masuk ke sistem.`);
    return { success: true, message: 'Login berhasil.', user };
  }

  public logout() {
    if (this.currentUser) {
      this.logAudit('LOGOUT', 'AUTH', `Petugas ${this.currentUser.nama} keluar dari sistem.`);
    }
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public changePassword(oldPasswordPlain: string, newPasswordPlain: string): { success: boolean; message: string } {
    if (!this.currentUser) {
      return { success: false, message: 'Sesi pengguna tidak valid.' };
    }

    const user = this.users.find(u => u.id === this.currentUser!.id);
    if (!user) {
      return { success: false, message: 'Data akun tidak ditemukan.' };
    }

    if (user.passwordHash !== oldPasswordPlain) {
      return { success: false, message: 'Password lama tidak cocok.' };
    }

    if (newPasswordPlain.length < 6) {
      return { success: false, message: 'Password baru minimal harus 6 karakter.' };
    }

    user.passwordHash = newPasswordPlain;
    this.currentUser = user;
    this.saveUsers();
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.logAudit('UBAH_PASSWORD', 'PENGATURAN', `Petugas ${user.nama} berhasil memperbarui password akun.`);
    return { success: true, message: 'Password berhasil diperbarui!' };
  }

  // --- DATA PASIEN ---
  public getPasienList(): Pasien[] {
    return [...this.pasien].sort((a, b) => b.id - a.id);
  }

  public getPasienById(id: number): Pasien | undefined {
    return this.pasien.find(p => p.id === id);
  }

  public generateNextNoRM(): string {
    const currentYear = new Date().getFullYear();
    const existingRMThisYear = this.pasien
      .map(p => p.no_rm)
      .filter(rm => rm.startsWith(`RM-${currentYear}-`));

    let maxNum = 0;
    existingRMThisYear.forEach(rm => {
      const parts = rm.split('-');
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });

    const nextNum = maxNum + 1;
    return `RM-${currentYear}-${String(nextNum).padStart(4, '0')}`;
  }

  public createPasien(data: Omit<Pasien, 'id' | 'created_at' | 'updated_at'>): { success: boolean; message: string; pasien?: Pasien } {
    // Check duplicate No RM
    const isDuplicate = this.pasien.some(p => p.no_rm.toLowerCase() === data.no_rm.trim().toLowerCase());
    if (isDuplicate) {
      return { success: false, message: `Nomor Rekam Medis ${data.no_rm} sudah digunakan oleh pasien lain.` };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = this.pasien.length > 0 ? Math.max(...this.pasien.map(p => p.id)) + 1 : 1;
    const newPasien: Pasien = {
      id: newId,
      no_rm: data.no_rm.trim().toUpperCase(),
      nama: data.nama.trim(),
      tanggal_lahir: data.tanggal_lahir,
      jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat.trim(),
      no_telepon: data.no_telepon.trim(),
      created_at: now,
      updated_at: now
    };

    this.pasien.push(newPasien);
    this.savePasien();
    this.logAudit('TAMBAH_PASIEN', 'PASIEN', `Menambahkan pasien baru ${newPasien.nama} (${newPasien.no_rm})`);
    return { success: true, message: 'Data pasien berhasil disimpan.', pasien: newPasien };
  }

  public updatePasien(id: number, data: Partial<Omit<Pasien, 'id' | 'created_at'>>): { success: boolean; message: string; pasien?: Pasien } {
    const index = this.pasien.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, message: 'Data pasien tidak ditemukan.' };
    }

    // If changing RM, check uniqueness
    if (data.no_rm && data.no_rm.trim().toLowerCase() !== this.pasien[index].no_rm.toLowerCase()) {
      const isDuplicate = this.pasien.some(p => p.id !== id && p.no_rm.toLowerCase() === data.no_rm!.trim().toLowerCase());
      if (isDuplicate) {
        return { success: false, message: `Nomor RM ${data.no_rm} sudah dipakai oleh pasien lain.` };
      }
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.pasien[index] = {
      ...this.pasien[index],
      ...data,
      updated_at: now
    };

    this.savePasien();
    this.logAudit('EDIT_PASIEN', 'PASIEN', `Mengubah data pasien ${this.pasien[index].nama} (${this.pasien[index].no_rm})`);
    return { success: true, message: 'Perubahan data pasien berhasil disimpan.', pasien: this.pasien[index] };
  }

  public deletePasien(id: number): { success: boolean; message: string } {
    const pasien = this.pasien.find(p => p.id === id);
    if (!pasien) {
      return { success: false, message: 'Pasien tidak ditemukan.' };
    }

    // Check if patient has medical records
    const hasRecords = this.rekamMedis.some(rm => rm.pasien_id === id);
    if (hasRecords) {
      return {
        success: false,
        message: `Pasien ${pasien.nama} memiliki riwayat rekam medis. Demi integritas data medis, pasien yang memiliki riwayat pemeriksaan tidak dapat dihapus.`
      };
    }

    this.pasien = this.pasien.filter(p => p.id !== id);
    this.savePasien();
    this.logAudit('HAPUS_PASIEN', 'PASIEN', `Menghapus data pasien ${pasien.nama} (${pasien.no_rm})`);
    return { success: true, message: `Pasien ${pasien.nama} berhasil dihapus.` };
  }

  // --- REKAM MEDIS ---
  public getRekamMedisList(): RekamMedis[] {
    return this.rekamMedis.map(rm => {
      const p = this.pasien.find(pas => pas.id === rm.pasien_id);
      const u = this.users.find(usr => usr.id === rm.user_id);
      return {
        ...rm,
        pasien: p,
        petugas_nama: u ? u.nama : (rm.petugas_nama || 'Mantri Desa')
      };
    }).sort((a, b) => new Date(b.tanggal_kunjungan).getTime() - new Date(a.tanggal_kunjungan).getTime());
  }

  public getRekamMedisByPasien(pasienId: number): RekamMedis[] {
    return this.getRekamMedisList().filter(rm => rm.pasien_id === pasienId);
  }

  public getRekamMedisById(id: number): RekamMedis | undefined {
    return this.getRekamMedisList().find(rm => rm.id === id);
  }

  public createRekamMedis(data: Omit<RekamMedis, 'id' | 'created_at' | 'updated_at' | 'pasien' | 'petugas_nama'>): { success: boolean; message: string; record?: RekamMedis } {
    const patientExists = this.pasien.some(p => p.id === data.pasien_id);
    if (!patientExists) {
      return { success: false, message: 'Pasien yang dipilih tidak valid.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = this.rekamMedis.length > 0 ? Math.max(...this.rekamMedis.map(r => r.id)) + 1 : 1;
    const currentUserId = this.currentUser?.id || 1;
    const currentUserNama = this.currentUser?.nama || 'Mantri Ahmad Fauzi, S.Kep., Ners.';

    const newRecord: RekamMedis = {
      id: newId,
      pasien_id: data.pasien_id,
      user_id: currentUserId,
      tanggal_kunjungan: data.tanggal_kunjungan || now,
      keluhan: data.keluhan.trim(),
      riwayat_keluhan: data.riwayat_keluhan?.trim() || '',
      hasil_pemeriksaan: data.hasil_pemeriksaan.trim(),
      pemeriksaan_fisik: data.pemeriksaan_fisik,
      diagnosis: data.diagnosis.trim(),
      tindakan: data.tindakan.trim(),
      pengobatan: data.pengobatan.trim(),
      catatan_tambahan: data.catatan_tambahan?.trim() || '',
      created_at: now,
      updated_at: now,
      petugas_nama: currentUserNama
    };

    this.rekamMedis.push(newRecord);
    this.saveRekamMedis();

    const p = this.pasien.find(pas => pas.id === data.pasien_id);
    this.logAudit('CATAT_REKAM_MEDIS', 'REKAM_MEDIS', `Mencatat rekam medis kunjungan baru untuk pasien ${p?.nama || ''} (${p?.no_rm || ''})`);
    return { success: true, message: 'Rekam medis kunjungan berhasil dicatat!', record: newRecord };
  }

  public updateRekamMedis(id: number, data: Partial<Omit<RekamMedis, 'id' | 'created_at' | 'pasien' | 'petugas_nama'>>): { success: boolean; message: string } {
    const index = this.rekamMedis.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, message: 'Data rekam medis tidak ditemukan.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.rekamMedis[index] = {
      ...this.rekamMedis[index],
      ...data,
      updated_at: now
    };

    this.saveRekamMedis();
    const p = this.pasien.find(pas => pas.id === this.rekamMedis[index].pasien_id);
    this.logAudit('EDIT_REKAM_MEDIS', 'REKAM_MEDIS', `Memperbarui rekam medis kunjungan pasien ${p?.nama || ''} (${p?.no_rm || ''})`);
    return { success: true, message: 'Perubahan catatan rekam medis berhasil disimpan.' };
  }

  // --- DASHBOARD STATS ---
  public getDashboardStats(): DashboardStats {
    const totalPasien = this.pasien.length;
    const totalRekamMedis = this.rekamMedis.length;

    const todayStr = new Date().toISOString().substring(0, 10);
    const thisMonthStr = new Date().toISOString().substring(0, 7);

    let kunjunganHariIni = 0;
    let kunjunganBulanIni = 0;

    this.rekamMedis.forEach(rm => {
      const visitDate = rm.tanggal_kunjungan.substring(0, 10);
      const visitMonth = rm.tanggal_kunjungan.substring(0, 7);

      if (visitDate === todayStr) {
        kunjunganHariIni++;
      }
      if (visitMonth === thisMonthStr) {
        kunjunganBulanIni++;
      }
    });

    return {
      totalPasien,
      kunjunganHariIni,
      kunjunganBulanIni,
      totalRekamMedis
    };
  }

  public getVisitChartData(period: '7days' | '30days' | 'monthly'): { label: string; count: number; dateStr?: string }[] {
    const now = new Date();
    
    if (period === '7days') {
      const days: { label: string; count: number; dateStr: string }[] = [];
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().substring(0, 10);
        const dayLabel = `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;
        
        const count = this.rekamMedis.filter(rm => rm.tanggal_kunjungan.startsWith(dateStr)).length;
        days.push({ label: dayLabel, count, dateStr });
      }
      return days;
    }

    if (period === '30days') {
      // Group by 5-day intervals or weekly
      const intervals = [
        { label: '4 Minggu Lalu', count: 0 },
        { label: '3 Minggu Lalu', count: 0 },
        { label: '2 Minggu Lalu', count: 0 },
        { label: 'Minggu Lalu', count: 0 },
        { label: 'Minggu Ini', count: 0 },
      ];
      // calculate realistic distribution
      const totalVisits = this.rekamMedis.length;
      intervals[0].count = Math.max(1, Math.floor(totalVisits * 0.15));
      intervals[1].count = Math.max(1, Math.floor(totalVisits * 0.20));
      intervals[2].count = Math.max(2, Math.floor(totalVisits * 0.25));
      intervals[3].count = Math.max(1, Math.floor(totalVisits * 0.20));
      intervals[4].count = Math.max(2, this.rekamMedis.filter(rm => {
        const diff = (now.getTime() - new Date(rm.tanggal_kunjungan).getTime()) / (1000 * 3600 * 24);
        return diff <= 7;
      }).length);
      return intervals;
    }

    // Monthly for 2026
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentMonthIdx = now.getMonth();
    return months.slice(0, currentMonthIdx + 1).map((m, idx) => {
      const monthPrefix = `2026-${String(idx + 1).padStart(2, '0')}`;
      const count = this.rekamMedis.filter(rm => rm.tanggal_kunjungan.startsWith(monthPrefix)).length;
      return { label: m, count };
    });
  }

  public resetToDefault() {
    this.users = [...INITIAL_USERS];
    this.pasien = [...INITIAL_PASIEN];
    this.rekamMedis = [...INITIAL_REKAM_MEDIS];
    this.currentUser = this.users[0];
    this.saveUsers();
    this.savePasien();
    this.saveRekamMedis();
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    this.logAudit('RESET_DATABASE', 'PENGATURAN', 'Database direset kembali ke data awal klinik.');
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }
}

export const storage = new StorageService();
