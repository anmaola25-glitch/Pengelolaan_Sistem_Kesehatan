import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  CalendarRange, 
  FileCheck, 
  Plus, 
  Stethoscope, 
  Eye, 
  ArrowRight,
  TrendingUp,
  Activity,
  HeartPulse
} from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../services/storageService';
import { RekamMedis } from '../types';

interface DashboardProps {
  onNavigateToPasien: () => void;
  onNavigateToRekamMedis: () => void;
  onOpenAddPasien: () => void;
  onOpenAddRekamMedis: () => void;
  onViewRecordDetail: (record: RekamMedis) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateToPasien,
  onNavigateToRekamMedis,
  onOpenAddPasien,
  onOpenAddRekamMedis,
  onViewRecordDetail,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'7days' | '30days' | 'monthly'>('7days');
  const stats = storage.getDashboardStats();
  const recentRecords = storage.getRekamMedisList().slice(0, 5);
  const chartData = storage.getVisitChartData(chartPeriod);

  const maxVal = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner dengan Efek Animasi Lembut */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md shadow-emerald-900/10 shrink-0">
            <HeartPulse className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Sistem Informasi Pengelolaan Rekam Medis Praktik Mantri Desaku
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kelola data pasien wilayah desa, dokumentasikan asuhan keperawatan mandiri, dan pantau riwayat rekam medis secara terintegrasi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddPasien}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Tambah Pasien</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddRekamMedis}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 rounded-xl hover:from-emerald-900 hover:to-teal-900 transition-all shadow-md shadow-emerald-900/15"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Catat Rekam Medis</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 4 Stat Cards dengan Hover Lift Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pasien */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={onNavigateToPasien}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Pasien Terdaftar</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {stats.totalPasien}
            </span>
            <span className="text-xs text-slate-400">orang</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
            <span>Data demografi desa</span>
          </div>
        </motion.div>

        {/* Kunjungan Hari Ini */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={onNavigateToRekamMedis}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Kunjungan Hari Ini</span>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {stats.kunjunganHariIni}
            </span>
            <span className="text-xs text-slate-400">pemeriksaan</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-800 dark:text-teal-400 font-medium">
            <span>Tercatat hari ini</span>
          </div>
        </motion.div>

        {/* Kunjungan Bulan Ini */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={onNavigateToRekamMedis}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Kunjungan Bulan Ini</span>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300">
              <CalendarRange className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {stats.kunjunganBulanIni}
            </span>
            <span className="text-xs text-slate-400">kunjungan</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-800 dark:text-sky-400 font-medium">
            <span>Bulan berjalan 2026</span>
          </div>
        </motion.div>

        {/* Total Rekam Medis */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={onNavigateToRekamMedis}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Rekam Medis</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {stats.totalRekamMedis}
            </span>
            <span className="text-xs text-slate-400">arsip</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-800 dark:text-indigo-400 font-medium">
            <span>Tersimpan di sistem</span>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Grafik Kunjungan Pasien</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tren intensitas pemeriksaan pasien berdasarkan rentang waktu</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setChartPeriod('7days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartPeriod === '7days' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setChartPeriod('30days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartPeriod === '30days' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setChartPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartPeriod === 'monthly' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tahun 2026
            </button>
          </div>
        </div>

        {/* Clean Bar Visualization */}
        <div className="pt-6">
          <div className="h-44 flex items-end gap-2 md:gap-4 px-2">
            {chartData.map((item, index) => {
              const heightPercent = maxVal > 0 ? Math.max(12, Math.round((item.count / maxVal) * 100)) : 12;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full max-h-[120px] flex items-end overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.04 }}
                      className="w-full bg-gradient-to-t from-emerald-800 to-teal-600 dark:from-emerald-600 dark:to-teal-400 group-hover:from-emerald-700 group-hover:to-teal-500 transition-all rounded-t-lg"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabel Kunjungan Terbaru */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors">
        <div className="flex items-center justify-between p-4 md:px-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kunjungan Pasien Terbaru</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Catatan pemeriksaan klinis terakhir yang tersimpan di sistem</p>
          </div>
          <button
            onClick={onNavigateToRekamMedis}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline transition-colors"
          >
            <span>Buka Semua Rekam Medis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Tgl & Jam</th>
                <th className="py-3 px-4">No. RM</th>
                <th className="py-3 px-4">Nama Pasien</th>
                <th className="py-3 px-4">Keluhan Utama</th>
                <th className="py-3 px-4">Diagnosis Klinis</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada riwayat kunjungan pasien.
                  </td>
                </tr>
              ) : (
                recentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 tabular-nums">
                      {record.tanggal_kunjungan.substring(0, 16)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {record.pasien?.no_rm}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{record.pasien?.nama}</div>
                      <div className="text-[11px] text-slate-400">
                        {record.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {record.keluhan}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md text-[11px]">
                        {record.diagnosis}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewRecordDetail(record)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
