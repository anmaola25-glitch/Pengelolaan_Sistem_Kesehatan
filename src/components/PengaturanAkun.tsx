import React, { useState } from 'react';
import { 
  Settings, 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  LogOut, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  History
} from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storageService';

interface PengaturanAkunProps {
  currentUser: User | null;
  onLogout: () => void;
  onRefreshData: () => void;
}

export const PengaturanAkun: React.FC<PengaturanAkunProps> = ({
  currentUser,
  onLogout,
  onRefreshData,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const auditLogs = storage.getAuditLogs().slice(0, 10);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Semua kolom password wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password baru minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi password baru tidak cocok.');
      return;
    }

    const res = storage.changePassword(oldPassword, newPassword);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSuccessMsg('Password berhasil diperbarui! Gunakan password baru pada login berikutnya.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetDatabase = () => {
    storage.resetToDefault();
    setShowResetConfirm(false);
    onRefreshData();
    setSuccessMsg('Database sistem berhasil dikembalikan ke data awal klinik.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Pengaturan Akun & Keamanan</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Informasi profil pengguna, pembaruan password, dan catatan aktivitas keamanan
        </p>
      </div>

      {/* Profil Petugas Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs text-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {currentUser?.nama.charAt(0) || 'M'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{currentUser?.nama}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-mono">@{currentUser?.username}</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold uppercase text-[11px] border border-emerald-200 dark:border-emerald-800">
            {currentUser?.role}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <span className="text-slate-400 block text-[10px]">Identitas Login</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">@{currentUser?.username}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Hak Akses / Peran</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">Tenaga Kesehatan Praktik</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Terdaftar Sejak</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser?.created_at.substring(0, 10)}</span>
          </div>
        </div>
      </div>

      {/* Ubah Password Form */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs text-xs transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <KeyRound className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Ubah Password Akun</h3>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Password Saat Ini (Lama) *
            </label>
            <div className="relative">
              <input
                type={showOldPass ? 'text' : 'password'}
                placeholder="Masukkan password lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-3 pr-9 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Password Baru *
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-3 pr-9 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Gunakan minimal 6 karakter kombinasi huruf dan angka untuk keamanan data pasien.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ulangi Password Baru *
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="Ketik ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-3 pr-9 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 font-semibold transition-colors"
            >
              Simpan Password Baru
            </button>
          </div>
        </form>
      </div>

      {/* Audit Log Sesi & Reset Database */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="font-bold text-slate-800 text-sm">Catatan Audit Log Sistem</h3>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Contoh</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-800">{log.aksi}</span>
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="text-slate-600">{log.rincian}</span>
              </div>
              <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                {log.waktu}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal Reset Data */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 p-5 text-center text-xs">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 mb-1">Reset Database ke Data Default?</h3>
            <p className="text-slate-500 mb-4">
              Tindakan ini akan mengembalikan data pasien dan rekam medis ke data awal contoh klinik desa.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetDatabase}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
