/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { User, Pasien, RekamMedis } from './types';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PasienManager } from './components/PasienManager';
import { RekamMedisManager } from './components/RekamMedisManager';
import { RiwayatManager } from './components/RiwayatManager';
import { LaporanManager } from './components/LaporanManager';
import { PengaturanAkun } from './components/PengaturanAkun';
import { DetailRecordModal } from './components/DetailRecordModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<RekamMedis | null>(null);
  const [preselectedPatientId, setPreselectedPatientId] = useState<number | null>(null);

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mantri_theme');
    if (saved) return saved === 'dark';
    return false; // Default mode terang
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0a1713';
      document.body.style.color = '#f1f5f9';
      localStorage.setItem('mantri_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f8faf9';
      document.body.style.color = '#1e293b';
      localStorage.setItem('mantri_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Re-render trigger when data updates
  const [, setTick] = useState(0);
  const triggerRefresh = () => setTick(t => t + 1);

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  // Switch to Rekam Medis with patient pre-selected
  const handleSelectPatientForRecord = (pasien: Pasien) => {
    setPreselectedPatientId(pasien.id);
    setActiveTab('rekam_medis');
  };

  // Page titles map
  const pageTitles: Record<NavTab, string> = {
    dashboard: 'Dashboard Pelayanan',
    pasien: 'Data Pasien Desa',
    rekam_medis: 'Pencatatan Rekam Medis',
    riwayat: 'Riwayat Kunjungan Pasien',
    laporan: 'Laporan Rekapitulasi & Cetak PDF',
    pengaturan: 'Pengaturan Akun Petugas',
  };

  // If not authenticated, render Login Page
  if (!currentUser) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#f8faf9] dark:bg-[#0c1814] text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
          userName={currentUser.nama}
          userRole={currentUser.role}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        {/* Main Layout Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          <Header
            currentUser={currentUser}
            currentPageTitle={pageTitles[activeTab]}
            onLogout={handleLogout}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />

          {/* Content Viewport */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                onNavigateToPasien={() => setActiveTab('pasien')}
                onNavigateToRekamMedis={() => setActiveTab('rekam_medis')}
                onOpenAddPasien={() => setActiveTab('pasien')}
                onOpenAddRekamMedis={() => setActiveTab('rekam_medis')}
                onViewRecordDetail={(rec) => setSelectedRecordForDetail(rec)}
              />
            )}

            {activeTab === 'pasien' && (
              <PasienManager
                onSelectPatientForRecord={handleSelectPatientForRecord}
                onViewRecordDetail={(rec) => setSelectedRecordForDetail(rec)}
              />
            )}

            {activeTab === 'rekam_medis' && (
              <RekamMedisManager
                initialPatientId={preselectedPatientId}
                onClearInitialPatient={() => setPreselectedPatientId(null)}
                onViewRecordDetail={(rec) => setSelectedRecordForDetail(rec)}
              />
            )}

            {activeTab === 'riwayat' && (
              <RiwayatManager
                onViewRecordDetail={(rec) => setSelectedRecordForDetail(rec)}
              />
            )}

            {activeTab === 'laporan' && (
              <LaporanManager />
            )}

            {activeTab === 'pengaturan' && (
              <PengaturanAkun
                currentUser={currentUser}
                onLogout={handleLogout}
                onRefreshData={triggerRefresh}
              />
            )}
          </main>

          {/* Clean Footer */}
          <footer className="mt-auto py-3 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
            <span>&copy; {new Date().getFullYear()} <strong>Praktik Mantri Desaku</strong>. Sistem Informasi Pengelolaan Rekam Medis Berbasis Website.</span>
          </footer>
        </div>

        {/* Detail Record Modal */}
        <DetailRecordModal
          record={selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
        />
      </div>
    </div>
  );
}
