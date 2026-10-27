import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Sun,
  Moon,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../services/storageService';
import { User } from '../types';

interface LoginModalProps {
  onLoginSuccess: (user: User) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleTheme,
}) => {
  // Input dikosongkan terlebih dahulu sesuai instruksi
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Silakan isi username dan password Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = storage.login(username, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.message);
      }
    }, 200);
  };

  const handleFillDemo = () => {
    setUsername('mantri');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${
      isDarkMode ? 'bg-[#091410]' : 'bg-[#f4f7f5]'
    }`}>
      {/* Background Image Unggahan Pengguna (Grafik Analitik Medis & Stetoskop) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/aistudio/image_70f77419.png"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/public/')) {
              target.src = '/public/assets/aistudio/image_70f77419.png';
            }
          }}
          alt="Latar Belakang Pelayanan Rekam Medis"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            isDarkMode 
              ? 'brightness-[0.38] contrast-[1.15] saturate-[0.85]' 
              : 'brightness-[0.88] contrast-[1.02]'
          }`}
        />
        {/* Scrim Overlay Responsif Terhadap Mode Gelap / Terang */}
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isDarkMode 
            ? 'bg-gradient-to-tr from-[#050e0b]/92 via-[#091a14]/85 to-[#0b241c]/75' 
            : 'bg-gradient-to-tr from-[#1b3a32]/82 via-[#2d5a4c]/50 to-slate-900/25'
        }`} />
      </div>

      {/* Floating Theme Toggle (Matahari / Bulan) */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold transition-all shadow-lg border ${
            isDarkMode 
              ? 'bg-slate-900/80 text-amber-300 border-amber-400/30 hover:bg-slate-800' 
              : 'bg-white/25 text-white border-white/30 hover:bg-white/35'
          }`}
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-200">Mode Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-emerald-200" />
              <span>Mode Gelap</span>
            </>
          )}
        </button>
      </div>

      {/* Kartu Login dengan Perubahan Otomatis Saat Mode Gelap Dipilih */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full max-w-md rounded-3xl shadow-2xl backdrop-blur-xl p-7 sm:p-9 transition-all duration-300 border ${
          isDarkMode
            ? 'bg-[#0f1f1a]/92 border-emerald-500/20 text-slate-100 shadow-black/60'
            : 'bg-white/92 border-white/60 text-slate-800 shadow-emerald-950/20'
        }`}
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/20' 
                : 'bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-emerald-900/20'
            }`}
          >
            <HeartPulse className="w-7 h-7 text-emerald-100" />
          </motion.div>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Praktik Mantri Desaku
          </h1>
          <p className={`text-xs mt-1 font-medium ${
            isDarkMode ? 'text-emerald-300/80' : 'text-slate-500'
          }`}>
            Sistem Informasi Pengelolaan Rekam Medis
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-4 p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-rose-950/60 border-rose-800/80 text-rose-300' 
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Form Login (Input Tidak Terisi Otomatis) */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className={`block font-semibold mb-1.5 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              Username Petugas
            </label>
            <div className="relative">
              <UserIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Masukkan username Anda..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border outline-none text-xs transition-all ${
                  isDarkMode 
                    ? 'bg-[#152a23] border-emerald-900/70 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400' 
                    : 'bg-slate-50/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-xs transition-all ${
                  isDarkMode 
                    ? 'bg-[#152a23] border-emerald-900/70 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400' 
                    : 'bg-slate-50/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 text-white rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40' 
                : 'bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 shadow-emerald-900/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Memverifikasi Kredensial...' : 'Masuk ke Sistem'}</span>
          </motion.button>
        </form>

        {/* Demo Account Helper Card */}
        <div className={`mt-6 pt-5 border-t text-center ${
          isDarkMode ? 'border-emerald-950/80' : 'border-slate-200/60'
        }`}>
          <div className={`p-3 rounded-2xl border transition-colors ${
            isDarkMode 
              ? 'bg-[#132620]/80 border-emerald-800/40 text-emerald-200' 
              : 'bg-emerald-50/70 border-emerald-200/60 text-emerald-900'
          }`}>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>Akun Demo Praktik</span>
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className={`text-[11px] font-bold hover:underline flex items-center gap-1 ${
                  isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
                }`}
                title="Klik untuk mengisi username dan password otomatis"
              >
                <KeyRound className="w-3 h-3" />
                <span>Gunakan Akun Ini</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 font-mono text-[11px]">
              <span className={`px-2 py-0.5 rounded-md border ${
                isDarkMode 
                  ? 'bg-[#183129] border-emerald-800/60 text-slate-200' 
                  : 'bg-white border-slate-200 text-slate-700'
              }`}>
                User: <strong>mantri</strong>
              </span>
              <span className={`px-2 py-0.5 rounded-md border ${
                isDarkMode 
                  ? 'bg-[#183129] border-emerald-800/60 text-slate-200' 
                  : 'bg-white border-slate-200 text-slate-700'
              }`}>
                Pass: <strong>admin123</strong>
              </span>
            </div>
          </div>
          
          <p className={`text-[10px] mt-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-400'
          }`}>
            Praktik Mandiri Pelayanan Kesehatan Komunitas Desa
          </p>
        </div>
      </motion.div>
    </div>
  );
};
