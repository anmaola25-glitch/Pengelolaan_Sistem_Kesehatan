import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Calendar, 
  ArrowUpDown, 
  Eye, 
  User, 
  MapPin, 
  Activity, 
  FileText,
  Filter
} from 'lucide-react';
import { RekamMedis, Pasien } from '../types';
import { storage } from '../services/storageService';

interface RiwayatManagerProps {
  onViewRecordDetail: (record: RekamMedis) => void;
}

export const RiwayatManager: React.FC<RiwayatManagerProps> = ({
  onViewRecordDetail,
}) => {
  const [pasienList] = useState<Pasien[]>(() => storage.getPasienList());
  const [records] = useState<RekamMedis[]>(() => storage.getRekamMedisList());

  // Filters
  const [selectedPasienId, setSelectedPasienId] = useState<number | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter logic
  const filteredRecords = records.filter(r => {
    // Patient Filter
    if (selectedPasienId !== 'ALL' && r.pasien_id !== selectedPasienId) {
      return false;
    }

    // Search Query (Patient Name or RM)
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = r.pasien?.nama.toLowerCase().includes(q) || false;
      const matchRM = r.pasien?.no_rm.toLowerCase().includes(q) || false;
      const matchDiag = r.diagnosis.toLowerCase().includes(q);
      if (!matchName && !matchRM && !matchDiag) return false;
    }

    // Date Range Filter
    const visitDateStr = r.tanggal_kunjungan.substring(0, 10);
    if (startDate && visitDateStr < startDate) {
      return false;
    }
    if (endDate && visitDateStr > endDate) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.tanggal_kunjungan).getTime();
    const timeB = new Date(b.tanggal_kunjungan).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const selectedPatientData = selectedPasienId !== 'ALL' 
    ? pasienList.find(p => p.id === selectedPasienId) 
    : null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Riwayat Kunjungan & Pemeriksaan Medis</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Linimasa riwayat medis komprehensif, filter individual pasien, dan pelacakan perkembangan klinis
        </p>
      </div>

      {/* Filter Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter Pasien */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Filter Berdasarkan Pasien
            </label>
            <select
              value={selectedPasienId}
              onChange={(e) => setSelectedPasienId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
            >
              <option value="ALL">-- Semua Pasien Desa --</option>
              {pasienList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.no_rm} - {p.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal Awal */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
            />
          </div>

          {/* Tanggal Selesai */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
            />
          </div>

          {/* Pengurutan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Urutan Linimasa
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
            >
              <option value="desc">Terbaru ke Terlama (Kronologis Balik)</option>
              <option value="asc">Terlama ke Terbaru (Kronologis Maju)</option>
            </select>
          </div>
        </div>

        {/* Search bar & Reset */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kata kunci dalam riwayat (keluhan, nama, diagnosis)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/30 dark:bg-slate-800/80 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <button
            onClick={() => {
              setSelectedPasienId('ALL');
              setStartDate('');
              setEndDate('');
              setSearch('');
              setSortOrder('desc');
            }}
            className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Selected Patient Banner if specific patient is filtered */}
      {selectedPatientData && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-bold text-[11px]">
                {selectedPatientData.no_rm}
              </span>
              <h3 className="font-bold text-sm text-slate-800">{selectedPatientData.nama}</h3>
              <span className="text-slate-500">
                ({selectedPatientData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
              </span>
            </div>
            <div className="text-slate-600">
              Alamat: {selectedPatientData.alamat} · Tgl Lahir: {selectedPatientData.tanggal_lahir}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-800 text-white font-semibold text-[11px]">
              {filteredRecords.length} Riwayat Kunjungan
            </span>
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Tidak ada riwayat kunjungan yang sesuai dengan filter.</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan rentang tanggal atau pilih pasien lain.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all text-xs"
            >
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-800 text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {record.pasien?.no_rm}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {record.pasien?.nama}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">
                    {record.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-slate-500 tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{record.tanggal_kunjungan}</span>
                  </div>
                  <button
                    onClick={() => onViewRecordDetail(record)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors ml-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Rekam Medis</span>
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3.5">
                {/* Keluhan */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Keluhan Pasien
                  </span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {record.keluhan}
                  </p>
                  {record.riwayat_keluhan && (
                    <p className="text-slate-400 text-[11px] mt-1">
                      Riwayat: {record.riwayat_keluhan}
                    </p>
                  )}
                </div>

                {/* Hasil Pemeriksaan & TTV */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Hasil Pemeriksaan / TTV
                  </span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 font-mono text-[11px] leading-relaxed">
                    {record.hasil_pemeriksaan}
                  </div>
                </div>

                {/* Diagnosis & Tindakan */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Diagnosis & Terapi
                  </span>
                  <div className="font-bold text-emerald-950 mb-1">
                    {record.diagnosis}
                  </div>
                  <div className="text-slate-600 text-[11px] mb-1">
                    <strong>Tindakan:</strong> {record.tindakan}
                  </div>
                  {record.pengobatan && (
                    <div className="text-slate-600 text-[11px]">
                      <strong>Resep:</strong> {record.pengobatan}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Alamat: {record.pasien?.alamat}</span>
                <span>Pencatat: <strong className="text-slate-600">{record.petugas_nama}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
