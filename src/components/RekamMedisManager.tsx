import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  X, 
  Calendar, 
  Heart, 
  Activity, 
  FileText, 
  User, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { RekamMedis, Pasien } from '../types';
import { storage } from '../services/storageService';

interface RekamMedisManagerProps {
  initialPatientId?: number | null;
  onClearInitialPatient?: () => void;
  onViewRecordDetail: (record: RekamMedis) => void;
}

export const RekamMedisManager: React.FC<RekamMedisManagerProps> = ({
  initialPatientId,
  onClearInitialPatient,
  onViewRecordDetail,
}) => {
  const [records, setRecords] = useState<RekamMedis[]>(() => storage.getRekamMedisList());
  const [pasienList] = useState<Pasien[]>(() => storage.getPasienList());
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RekamMedis | null>(null);

  // Form State
  const [selectedPasienId, setSelectedPasienId] = useState<number>(initialPatientId || (pasienList[0]?.id ?? 0));
  const [tanggalKunjungan, setTanggalKunjungan] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [keluhan, setKeluhan] = useState('');
  const [riwayatKeluhan, setRiwayatKeluhan] = useState('');
  
  // Vital signs
  const [tekananDarah, setTekananDarah] = useState('');
  const [beratBadan, setBeratBadan] = useState('');
  const [suhuTubuh, setSuhuTubuh] = useState('');
  const [denyutNadi, setDenyutNadi] = useState('');
  const [lajuPernafasan, setLajuPernafasan] = useState('');
  const [pemeriksaanFisikLain, setPemeriksaanFisikLain] = useState('');

  const [diagnosis, setDiagnosis] = useState('');
  const [tindakan, setTindakan] = useState('');
  const [pengobatan, setPengobatan] = useState('');
  const [catatanTambahan, setCatatanTambahan] = useState('');
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle open add modal directly if initialPatientId is passed
  React.useEffect(() => {
    if (initialPatientId) {
      setSelectedPasienId(initialPatientId);
      resetForm();
      setIsAddModalOpen(true);
      if (onClearInitialPatient) onClearInitialPatient();
    }
  }, [initialPatientId]);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshRecords = () => {
    setRecords(storage.getRekamMedisList());
  };

  const resetForm = () => {
    const now = new Date();
    setTanggalKunjungan(now.toISOString().slice(0, 16));
    setKeluhan('');
    setRiwayatKeluhan('');
    setTekananDarah('');
    setBeratBadan('');
    setSuhuTubuh('');
    setDenyutNadi('');
    setLajuPernafasan('');
    setPemeriksaanFisikLain('');
    setDiagnosis('');
    setTindakan('');
    setPengobatan('');
    setCatatanTambahan('');
    setFormError('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (rec: RekamMedis) => {
    setEditingRecord(rec);
    setSelectedPasienId(rec.pasien_id);
    setTanggalKunjungan(rec.tanggal_kunjungan.slice(0, 16));
    setKeluhan(rec.keluhan);
    setRiwayatKeluhan(rec.riwayat_keluhan || '');
    
    // Fill vitals if available
    if (rec.pemeriksaan_fisik) {
      setTekananDarah(rec.pemeriksaan_fisik.tekanan_darah?.replace(' mmHg', '') || '');
      setBeratBadan(rec.pemeriksaan_fisik.berat_badan?.replace(' kg', '') || '');
      setSuhuTubuh(rec.pemeriksaan_fisik.suhu_tubuh?.replace(' °C', '') || '');
      setDenyutNadi(rec.pemeriksaan_fisik.denyut_nadi?.replace(' x/menit', '') || '');
      setLajuPernafasan(rec.pemeriksaan_fisik.laju_pernafasan?.replace(' x/menit', '') || '');
    } else {
      setTekananDarah('');
      setBeratBadan('');
      setSuhuTubuh('');
      setDenyutNadi('');
      setLajuPernafasan('');
    }
    setPemeriksaanFisikLain(rec.hasil_pemeriksaan);
    setDiagnosis(rec.diagnosis);
    setTindakan(rec.tindakan);
    setPengobatan(rec.pengobatan);
    setCatatanTambahan(rec.catatan_tambahan || '');
    setFormError('');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPasienId) {
      setFormError('Harap pilih pasien.');
      return;
    }
    if (!keluhan.trim() || !diagnosis.trim() || !tindakan.trim()) {
      setFormError('Harap isi Keluhan Utama, Diagnosis, dan Tindakan medis yang dilakukan.');
      return;
    }

    const formattedVitals: string[] = [];
    if (tekananDarah) formattedVitals.push(`TD: ${tekananDarah} mmHg`);
    if (beratBadan) formattedVitals.push(`BB: ${beratBadan} kg`);
    if (suhuTubuh) formattedVitals.push(`Suhu: ${suhuTubuh} °C`);
    if (denyutNadi) formattedVitals.push(`Nadi: ${denyutNadi} x/mnt`);
    if (lajuPernafasan) formattedVitals.push(`RR: ${lajuPernafasan} x/mnt`);
    if (pemeriksaanFisikLain) formattedVitals.push(pemeriksaanFisikLain);

    const fullHasilPemeriksaan = formattedVitals.join(', ');

    const res = storage.createRekamMedis({
      pasien_id: selectedPasienId,
      user_id: 1,
      tanggal_kunjungan: tanggalKunjungan.replace('T', ' ') + ':00',
      keluhan,
      riwayat_keluhan: riwayatKeluhan,
      hasil_pemeriksaan: fullHasilPemeriksaan,
      pemeriksaan_fisik: {
        tekanan_darah: tekananDarah ? `${tekananDarah} mmHg` : undefined,
        berat_badan: beratBadan ? `${beratBadan} kg` : undefined,
        suhu_tubuh: suhuTubuh ? `${suhuTubuh} °C` : undefined,
        denyut_nadi: denyutNadi ? `${denyutNadi} x/menit` : undefined,
        laju_pernafasan: lajuPernafasan ? `${lajuPernafasan} x/menit` : undefined,
      },
      diagnosis,
      tindakan,
      pengobatan,
      catatan_tambahan: catatanTambahan
    });

    if (!res.success) {
      setFormError(res.message);
      return;
    }

    refreshRecords();
    setIsAddModalOpen(false);
    showToast('Rekam medis kunjungan berhasil disimpan!');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    if (!keluhan.trim() || !diagnosis.trim() || !tindakan.trim()) {
      setFormError('Harap isi Keluhan Utama, Diagnosis, dan Tindakan medis.');
      return;
    }

    const formattedVitals: string[] = [];
    if (tekananDarah) formattedVitals.push(`TD: ${tekananDarah} mmHg`);
    if (beratBadan) formattedVitals.push(`BB: ${beratBadan} kg`);
    if (suhuTubuh) formattedVitals.push(`Suhu: ${suhuTubuh} °C`);
    if (denyutNadi) formattedVitals.push(`Nadi: ${denyutNadi} x/mnt`);
    if (lajuPernafasan) formattedVitals.push(`RR: ${lajuPernafasan} x/mnt`);
    if (pemeriksaanFisikLain) formattedVitals.push(pemeriksaanFisikLain);

    const fullHasilPemeriksaan = formattedVitals.join(', ');

    const res = storage.updateRekamMedis(editingRecord.id, {
      tanggal_kunjungan: tanggalKunjungan.replace('T', ' ') + ':00',
      keluhan,
      riwayat_keluhan: riwayatKeluhan,
      hasil_pemeriksaan: fullHasilPemeriksaan,
      diagnosis,
      tindakan,
      pengobatan,
      catatan_tambahan: catatanTambahan
    });

    if (!res.success) {
      setFormError(res.message);
      return;
    }

    refreshRecords();
    setEditingRecord(null);
    showToast('Perubahan catatan rekam medis berhasil disimpan!');
  };

  // Filtered & Paginated records
  const filtered = records.filter(r => {
    const matchSearch = (r.pasien?.nama.toLowerCase() || '').includes(search.toLowerCase()) ||
                        (r.pasien?.no_rm.toLowerCase() || '').includes(search.toLowerCase()) ||
                        r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
                        r.keluhan.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || r.tanggal_kunjungan.startsWith(dateFilter);
    return matchSearch && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold bg-emerald-800 text-white">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Catatan Rekam Medis</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pencatatan klinis, tanda-tanda vital, diagnosis, dan terapi obat pasien desa</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 rounded-xl hover:from-emerald-900 hover:to-teal-900 transition-all shadow-md shadow-emerald-900/15 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Rekam Medis Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama pasien, no. RM, keluhan, atau diagnosis klinis..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">Tanggal:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table Rekam Medis */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Tgl & Jam</th>
                <th className="py-3 px-4">No. RM</th>
                <th className="py-3 px-4">Nama Pasien</th>
                <th className="py-3 px-4">Keluhan Utama</th>
                <th className="py-3 px-4">Diagnosis Klinis</th>
                <th className="py-3 px-4">Petugas Pencatat</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada arsip rekam medis yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                currentItems.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 tabular-nums whitespace-nowrap">
                      {r.tanggal_kunjungan.substring(0, 16)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {r.pasien?.no_rm}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{r.pasien?.nama}</div>
                      <div className="text-[11px] text-slate-400">
                        {r.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {r.keluhan}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                        {r.diagnosis}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {r.petugas_nama || 'Mantri Desa'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewRecordDetail(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(r)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Catatan"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
            <span className="text-xs text-slate-500">
              Menampilkan {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filtered.length, currentPage * itemsPerPage)} dari {filtered.length} rekam medis
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-2.5 py-1 text-xs rounded border ${
                    currentPage === num 
                      ? 'bg-emerald-800 text-white border-emerald-800 font-semibold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Catat Rekam Medis Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-800" />
                <h3 className="font-bold text-sm text-slate-800">Pencatatan Rekam Medis Kunjungan Baru</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-5 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Pilih Pasien & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Pasien Terdaftar *</label>
                  <select
                    value={selectedPasienId}
                    onChange={(e) => setSelectedPasienId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50/50 font-medium"
                    required
                  >
                    {pasienList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.no_rm} - {p.nama} ({p.jenis_kelamin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal & Waktu Kunjungan *</label>
                  <input
                    type="datetime-local"
                    value={tanggalKunjungan}
                    onChange={(e) => setTanggalKunjungan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Anamnesis */}
              <div className="space-y-3">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Anamnesis & Keluhan</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Keluhan Utama *</label>
                    <textarea
                      rows={3}
                      placeholder="Keluhan utama yang dirasakan saat datang..."
                      value={keluhan}
                      onChange={(e) => setKeluhan(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Riwayat Keluhan / Penyakit Terdahulu</label>
                    <textarea
                      rows={3}
                      placeholder="Riwayat alergi obat, riwayat penyakit kronis keluarga, lama gejala..."
                      value={riwayatKeluhan}
                      onChange={(e) => setRiwayatKeluhan(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tanda-tanda Vital */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Tanda-Tanda Vital & Hasil Pemeriksaan Fisik</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Tekanan Darah</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="120/80"
                        value={tekananDarah}
                        onChange={(e) => setTekananDarah(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">mmHg</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Berat Badan</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="65"
                        value={beratBadan}
                        onChange={(e) => setBeratBadan(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">kg</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Suhu Tubuh</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="36.5"
                        value={suhuTubuh}
                        onChange={(e) => setSuhuTubuh(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">°C</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Denyut Nadi</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="80"
                        value={denyutNadi}
                        onChange={(e) => setDenyutNadi(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">x/menit</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Laju Nafas</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="18"
                        value={lajuPernafasan}
                        onChange={(e) => setLajuPernafasan(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">x/menit</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pemeriksaan Fisik Tambahan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Nyeri tekan epigastrium (+), luka lecet lutut kanan, tidak ada bising paru."
                    value={pemeriksaanFisikLain}
                    onChange={(e) => setPemeriksaanFisikLain(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Diagnosis & Tindakan */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Diagnosis Klinis & Tindakan Medis</span>
                </h4>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diagnosis / Temuan Klinis Nakes *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Hipertensi Grade 1 / Gastritis Akut Ringan / ISPA"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tindakan Medis yang Dilakukan *</label>
                    <textarea
                      rows={2}
                      placeholder="Pemeriksaan TTV, perawatan luka kassa steril, kompres hangat, edukasi diet..."
                      value={tindakan}
                      onChange={(e) => setTindakan(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pengobatan / Resep Terapi</label>
                    <textarea
                      rows={2}
                      placeholder="Nama obat, dosis, aturan minum (Contoh: Paracetamol 500mg 3x1 pc)..."
                      value={pengobatan}
                      onChange={(e) => setPengobatan(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan / Jadwal Kontrol Pasien</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kontrol 3 hari lagi jika demam berlanjut, kurangi asupan garam..."
                    value={catatanTambahan}
                    onChange={(e) => setCatatanTambahan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 font-semibold"
                >
                  Simpan Rekam Medis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Rekam Medis */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  Edit Rekam Medis: {editingRecord.pasien?.nama} ({editingRecord.pasien?.no_rm})
                </h3>
              </div>
              <button onClick={() => setEditingRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Waktu Pemeriksaan</label>
                <input
                  type="datetime-local"
                  value={tanggalKunjungan}
                  onChange={(e) => setTanggalKunjungan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keluhan Utama *</label>
                  <textarea
                    rows={2}
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Riwayat Keluhan</label>
                  <textarea
                    rows={2}
                    value={riwayatKeluhan}
                    onChange={(e) => setRiwayatKeluhan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnosis Klinis *</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tindakan Dilakukan *</label>
                  <textarea
                    rows={2}
                    value={tindakan}
                    onChange={(e) => setTindakan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pengobatan / Resep</label>
                  <textarea
                    rows={2}
                    value={pengobatan}
                    onChange={(e) => setPengobatan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={catatanTambahan}
                  onChange={(e) => setCatatanTambahan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 font-semibold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
