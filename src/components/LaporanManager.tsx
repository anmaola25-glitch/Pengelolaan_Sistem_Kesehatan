import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  Users, 
  ClipboardCheck, 
  ShieldCheck 
} from 'lucide-react';
import { storage } from '../services/storageService';
import { generateLaporanPDF } from '../utils/pdfGenerator';
import { RekamMedis } from '../types';

export const LaporanManager: React.FC = () => {
  const todayStr = new Date().toISOString().substring(0, 10);
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .substring(0, 10);

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const allRecords = storage.getRekamMedisList();
  const totalRegisteredPatients = storage.getPasienList().length;

  // Filter records within date range
  const filteredRecords = allRecords.filter(r => {
    const d = r.tanggal_kunjungan.substring(0, 10);
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  }).sort((a, b) => new Date(a.tanggal_kunjungan).getTime() - new Date(b.tanggal_kunjungan).getTime());

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      generateLaporanPDF({
        startDate,
        endDate,
        records: filteredRecords,
        totalRegisteredPatients,
        mantriName: 'Mantri Ahmad Fauzi, S.Kep., Ners.'
      });
      setToastMsg('File PDF Laporan berhasil diunduh ke browser Anda!');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menghasilkan file PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetFilter = () => {
    setStartDate(firstDayOfMonth);
    setEndDate(todayStr);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold bg-emerald-800 text-white">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Laporan Rekapitulasi Kunjungan & Pasien</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penerbitan laporan berkala resmi Praktik Mantri Desaku format A4 dan unduhan file PDF
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-md shadow-rose-900/15 transition-all shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? 'Menyiapkan PDF...' : 'Download PDF Laporan'}</span>
        </button>
      </div>

      {/* Filter Laporan */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Tanggal Awal Periode
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Tanggal Akhir Periode
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilter}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pratinjau Dokumen Laporan (Formatted A4 Layout Preview) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white text-slate-900 p-6 sm:p-10 shadow-lg max-w-4xl mx-auto space-y-6">
        {/* Kop Surat Klinik */}
        <div className="text-center pb-4 border-b-2 border-slate-800">
          <h3 className="text-xl font-bold tracking-wider text-[#1b3a32]">
            PRAKTIK MANTRI DESAKU
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Pelayanan Kesehatan Tingkat Pertama & Asuhan Keperawatan Mandiri Komunitas Desa
          </p>
          <p className="text-[11px] text-slate-500">
            Surat Izin Praktik Mantri (SIPM): 446/082/SIPM/DISKES/2026
          </p>
          <p className="text-[11px] text-slate-500">
            Jl. Raya Balai Desa Sukamaju No. 12, Kec. Margasari, Telp: (0283) 619-8800
          </p>
        </div>

        {/* Judul Laporan & Periode */}
        <div className="text-center">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            LAPORAN REKAPITULASI KUNJUNGAN PASIEN
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Periode: <strong className="text-slate-700">{startDate || 'Awal'}</strong> s/d <strong className="text-slate-700">{endDate || 'Sekarang'}</strong>
          </p>
        </div>

        {/* Ringkasan Indikator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 block">Total Pasien Terdaftar:</span>
              <span className="text-lg font-bold text-slate-800 tabular-nums">
                {totalRegisteredPatients} Orang
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-100 text-teal-800">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 block">Jumlah Kunjungan dalam Periode:</span>
              <span className="text-lg font-bold text-emerald-800 tabular-nums">
                {filteredRecords.length} Pemeriksaan
              </span>
            </div>
          </div>
        </div>

        {/* Tabel Rekapitulasi Data */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1b3a32] text-white font-semibold">
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th className="py-2.5 px-3 w-28 text-center">Tgl & Jam</th>
                <th className="py-2.5 px-3 w-28 text-center">No. RM</th>
                <th className="py-2.5 px-3">Nama Pasien</th>
                <th className="py-2.5 px-3">Keluhan Utama</th>
                <th className="py-2.5 px-3">Tindakan Medis Dilakukan</th>
                <th className="py-2.5 px-3 text-center">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada kunjungan pasien yang tercatat pada rentang tanggal ini.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center text-slate-500">{index + 1}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {rec.tanggal_kunjungan.substring(0, 16)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {rec.pasien?.no_rm}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{rec.pasien?.nama}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {rec.pasien?.alamat}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs">
                      {rec.keluhan}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs">
                      {rec.tindakan}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600 text-[11px]">
                      {rec.petugas_nama || 'Mantri Desa'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan & Pengesahan Mantri */}
        <div className="flex flex-col sm:flex-row items-end justify-between pt-6 text-xs text-slate-600">
          <div className="text-slate-400 text-[11px] mb-4 sm:mb-0">
            *Laporan rekapitulasi administratif resmi Praktik Mantri Desaku.
            <br />
            Dicetak digital pada tanggal {new Date().toLocaleDateString('id-ID')}.
          </div>

          <div className="text-center sm:text-right w-full sm:w-auto">
            <div>Sukamaju, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="font-semibold text-slate-800 mt-1">Penanggung Jawab Praktik,</div>
            <div className="h-16 flex items-center justify-center sm:justify-end">
              <span className="text-[10px] text-slate-300 italic">[ Tanda Tangan & Cap Nakes ]</span>
            </div>
            <div className="font-bold text-slate-900">Mantri Ahmad Fauzi, S.Kep., Ners.</div>
            <div className="text-[11px] text-slate-500">SIPM: 446/082/SIPM/DISKES/2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};
