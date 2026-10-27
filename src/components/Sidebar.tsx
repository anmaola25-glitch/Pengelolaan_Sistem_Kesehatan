import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Clock, 
  FileText, 
  Settings, 
  HeartPulse, 
  X,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'motion/react';

export type NavTab = 'dashboard' | 'pasien' | 'rekam_medis' | 'riwayat' | 'laporan' | 'pengaturan';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  userName = 'Mantri Ahmad Fauzi',
  userRole = 'mantri',
  isDarkMode,
  onToggleTheme,
}) => {
  const menuItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pasien' as NavTab, label: 'Data Pasien', icon: Users },
    { id: 'rekam_medis' as NavTab, label: 'Rekam Medis', icon: Stethoscope },
    { id: 'riwayat' as NavTab, label: 'Riwayat Kunjungan', icon: Clock },
    { id: 'laporan' as NavTab, label: 'Laporan & PDF', icon: FileText },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1b3a32] dark:bg-[#0f211b] text-slate-100 flex flex-col transition-transform duration-200 ease-in-out border-r border-emerald-900/40
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white leading-tight">
                Praktik Mantri Desaku
              </div>
              <div className="text-[11px] text-emerald-300/80 font-medium">
                Sistem Rekam Medis
              </div>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-200/50">
              Pelayanan Medis
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm font-semibold' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400/80'}`} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-200/50">
              Konfigurasi & Akun
            </div>
            <nav className="space-y-1">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick('pengaturan')}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left
                  ${activeTab === 'pengaturan' 
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm font-semibold' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'pengaturan' ? 'text-white' : 'text-emerald-400/80'}`} />
                <span>Pengaturan Akun</span>
              </motion.button>

              {/* Theme Toggle Button inside sidebar for quick access */}
              <button
                onClick={onToggleTheme}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-200 hover:bg-white/10 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-300" />}
                  <span>{isDarkMode ? 'Tema Terang' : 'Tema Gelap'}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-200">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Footer Card */}
        <div className="p-3 border-t border-white/10 bg-black/15">
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="min-w-0 flex-1 mr-2">
              <div className="text-xs font-bold text-white truncate">
                {userName}
              </div>
              <div className="text-[11px] text-emerald-300/70 capitalize truncate">
                {userRole} Pelayanan
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout dari Sistem"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
