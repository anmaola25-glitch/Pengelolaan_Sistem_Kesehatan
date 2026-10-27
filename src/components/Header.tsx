import React from 'react';
import { User } from '../types';
import { LogOut, Calendar, ShieldCheck, Menu, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  currentUser: User | null;
  currentPageTitle: string;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentPageTitle,
  onLogout,
  onToggleMobileSidebar,
  isDarkMode,
  onToggleTheme,
}) => {
  const today = new Date();
  const monthsIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const formattedDate = `${daysIndo[today.getDay()]}, ${today.getDate()} ${monthsIndo[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="flex lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Buka navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-medium">Praktik Mantri Desaku</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
          <h1 className="font-bold text-slate-800 dark:text-white text-base tracking-tight">{currentPageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs font-medium text-emerald-900 dark:text-emerald-200">
          <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Theme Toggle Icon (Terang / Gelap) */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center shadow-xs"
          title={isDarkMode ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          aria-label="Ganti tema sistem"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-800" />
          )}
        </motion.button>

        {/* User Profile Pill */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider shadow-xs">
              {currentUser.nama.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[150px]">
                {currentUser.nama}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline" />
                {currentUser.role} nakes
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors ml-1"
              title="Keluar dari Sistem"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
