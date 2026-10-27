import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Pasien, RekamMedis } from '../types';
import { storage } from '../services/storageService';

interface PasienManagerProps {
  onSelectPatientForRecord: (patient: Pasien) => void;
  onViewRecordDetail: (record: RekamMedis) => void;
}

export const PasienManager: React.FC<PasienManagerProps> = ({
  onSelectPatientForRecord,
  onViewRecordDetail,
}) => {
  const [pasienList, setPasienList] = useState<Pasien[]>(() => storage.getPasienList());
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'L' | 'P'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Pasien | null>(null);
  const [detailPatient, setDetailPatient] = useState<Pasien | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Pasien | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    no_rm: '',
    nama: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    alamat: '',
    no_telepon: ''
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshList = () => {
    setPasienList(storage.getPasienList());
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    const nextRM = storage.generateNextNoRM();
    setFormData({
      no_rm: nextRM,
      nama: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      alamat: '',
      no_telepon: ''
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (pasien: Pasien) => {
    setEditingPatient(pasien);
    setFormData({
      no_rm: pasien.no_rm,
      nama: pasien.nama,
      tanggal_lahir: pasien.tanggal_lahir,
      jenis_kelamin: pasien.jenis_kelamin,
      alamat: pasien.alamat,
      no_telepon: pasien.no_telepon || ''
    });
    setFormError('');
  };

  // Submit Add
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.no_rm.trim() || !formData.nama.trim() || !formData.tanggal_lahir || !formData.alamat.trim()) {
      setFormError('Harap lengkapi semua kolom wajib (No RM, Nama, Tgl Lahir, Alamat).');
      return;
    }

    const res = storage.createPasien(formData);
    if (!res.success) {
      setFormError(res.message);
      return;
    }

    refreshList();
    setIsAddModalOpen(false);
    showToast(`Pasien ${formData.nama} berhasil ditambahkan!`, 'success');
  };

  // Submit Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    if (!formData.no_rm.trim() || !formData.nama.trim() || !formData.tanggal_lahir || !formData.alamat.trim()) {
      setFormError('Harap lengkapi semua kolom wajib.');
      return;
    }

    const res = storage.updatePasien(editingPatient.id, formData);
    if (!res.success) {
      setFormError(res.message);
      return;
    }

    refreshList();
    setEditingPatient(null);
    showToast('Data pasien berhasil diperbarui!', 'success');
  };

  // Submit Delete
  const handleConfirmDelete = () => {
    if (!deletingPatient) return;
    const res = storage.deletePasien(deletingPatient.id);
    if (!res.success) {
      showToast(res.message, 'error');
      setDeletingPatient(null);
      return;
    }

    refreshList();
    setDeletingPatient(null);
    showToast(res.message, 'success');
  };

  // Filtered & Paginated List
  const filtered = pasienList.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase()) || 
                        p.no_rm.toLowerCase().includes(search.toLowerCase()) ||
                        p.alamat.toLowerCase().includes(search.toLowerCase());
    const matchGender = genderFilter === 'ALL' || p.jenis_kelamin === genderFilter;
    return matchSearch && matchGender;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const calculateAge = (birthDateStr: string) => {
    const birth = new Date(birthDateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold ${
          toastMessage.type === 'success' ? 'bg-emerald-800 text-white' : 'bg-rose-700 text-white'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Pengelolaan Data Pasien</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Registrasi warga, rekam identitas, dan nomor rekam medis unik desa</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 rounded-xl hover:from-emerald-900 hover:to-teal-900 transition-all shadow-md shadow-emerald-900/15 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pasien Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama pasien, no. RM, atau alamat dusun..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Gender:</span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => { setGenderFilter('ALL'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition-colors ${genderFilter === 'ALL' ? 'bg-white dark:bg-slate-700 font-semibold text-slate-800 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Semua
            </button>
            <button
              onClick={() => { setGenderFilter('L'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition-colors ${genderFilter === 'L' ? 'bg-white dark:bg-slate-700 font-semibold text-slate-800 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Laki-laki
            </button>
            <button
              onClick={() => { setGenderFilter('P'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition-colors ${genderFilter === 'P' ? 'bg-white dark:bg-slate-700 font-semibold text-slate-800 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Perempuan
            </button>
          </div>
        </div>
      </div>

      {/* Table Data Pasien */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">No. RM</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Usia / Tgl Lahir</th>
                <th className="py-3 px-4">Alamat Domisili</th>
                <th className="py-3 px-4">No. Telepon</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada data pasien yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                currentItems.map((p) => {
                  const age = calculateAge(p.tanggal_lahir);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {p.no_rm}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{p.nama}</div>
                        <div className="text-[11px] text-slate-400">Terdaftar: {p.created_at.substring(0, 10)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.jenis_kelamin === 'L' 
                            ? 'bg-sky-50 text-sky-800 border border-sky-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {p.jenis_kelamin === 'L' ? 'L' : 'P'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 tabular-nums">
                        <div className="font-medium text-slate-800">{age} thn</div>
                        <div className="text-[11px] text-slate-400">{p.tanggal_lahir}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {p.alamat}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {p.no_telepon || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectPatientForRecord(p)}
                            className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded"
                            title="Catat Rekam Medis Pasien Ini"
                          >
                            <Stethoscope className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDetailPatient(p)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                            title="Lihat Detail Profil & Riwayat Medis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit Data Pasien"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingPatient(p)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="Hapus Data Pasien"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
            <span className="text-xs text-slate-500">
              Menampilkan {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filtered.length, currentPage * itemsPerPage)} dari {filtered.length} pasien
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

      {/* Modal Tambah Pasien Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-800" />
                <h3 className="font-bold text-sm text-slate-800">Pendaftaran Pasien Baru</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor RM (Unik) *</label>
                  <input
                    type="text"
                    value={formData.no_rm}
                    onChange={(e) => setFormData({ ...formData, no_rm: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Digenerate otomatis urut per tahun</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Pasien *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bpk. Supardi Wiryo"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="add_jk"
                        checked={formData.jenis_kelamin === 'L'}
                        onChange={() => setFormData({ ...formData, jenis_kelamin: 'L' })}
                        className="text-emerald-800"
                      />
                      <span>Laki-laki (L)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="add_jk"
                        checked={formData.jenis_kelamin === 'P'}
                        onChange={() => setFormData({ ...formData, jenis_kelamin: 'P' })}
                        className="text-emerald-800"
                      />
                      <span>Perempuan (P)</span>
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili Desa *</label>
                  <textarea
                    rows={2}
                    placeholder="Dusun Krajan RT 02 / RW 01, Desa Sukamaju..."
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / HP</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-3456-7890"
                    value={formData.no_telepon}
                    onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
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
                  Simpan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pasien */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-800">Edit Data Pasien: {editingPatient.nama}</h3>
              </div>
              <button onClick={() => setEditingPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor RM *</label>
                  <input
                    type="text"
                    value={formData.no_rm}
                    onChange={(e) => setFormData({ ...formData, no_rm: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="edit_jk"
                        checked={formData.jenis_kelamin === 'L'}
                        onChange={() => setFormData({ ...formData, jenis_kelamin: 'L' })}
                      />
                      <span>Laki-laki (L)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="edit_jk"
                        checked={formData.jenis_kelamin === 'P'}
                        onChange={() => setFormData({ ...formData, jenis_kelamin: 'P' })}
                      />
                      <span>Perempuan (P)</span>
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili *</label>
                  <textarea
                    rows={2}
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={formData.no_telepon}
                    onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
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

      {/* Modal Detail Pasien & Riwayat Medisnya */}
      {detailPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-mono px-2 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded">
                  {detailPatient.no_rm}
                </span>
                <h3 className="font-bold text-sm text-slate-800">{detailPatient.nama}</h3>
              </div>
              <button onClick={() => setDetailPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Demografi Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Jenis Kelamin</span>
                  <span className="font-semibold text-slate-800">
                    {detailPatient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tanggal Lahir / Usia</span>
                  <span className="font-semibold text-slate-800">
                    {detailPatient.tanggal_lahir} ({calculateAge(detailPatient.tanggal_lahir)} thn)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">No. Telepon</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {detailPatient.no_telepon || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Terdaftar Sejak</span>
                  <span className="text-slate-800 font-medium">
                    {detailPatient.created_at.substring(0, 10)}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-4 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Alamat Lengkap</span>
                  <span className="text-slate-800 font-medium">{detailPatient.alamat}</span>
                </div>
              </div>

              {/* Riwayat Rekam Medis Pasien Ini */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Riwayat Rekam Medis ({storage.getRekamMedisByPasien(detailPatient.id).length})</span>
                  </h4>

                  <button
                    onClick={() => {
                      const p = detailPatient;
                      setDetailPatient(null);
                      onSelectPatientForRecord(p);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Catat Kunjungan Baru</span>
                  </button>
                </div>

                {storage.getRekamMedisByPasien(detailPatient.id).length === 0 ? (
                  <div className="p-6 text-center text-slate-400 border border-dashed rounded-lg">
                    Pasien ini belum memiliki catatan riwayat kunjungan medis.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {storage.getRekamMedisByPasien(detailPatient.id).map(record => (
                      <div 
                        key={record.id}
                        className="p-3 border border-slate-200 rounded-lg hover:border-emerald-300 transition-all bg-white"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {record.tanggal_kunjungan}
                          </span>
                          <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {record.diagnosis}
                          </span>
                        </div>

                        <div className="text-slate-600 line-clamp-2 mb-2">
                          <strong>Keluhan:</strong> {record.keluhan}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span>Nakes: {record.petugas_nama}</span>
                          <button
                            onClick={() => {
                              setDetailPatient(null);
                              onViewRecordDetail(record);
                            }}
                            className="text-emerald-800 font-semibold hover:underline"
                          >
                            Lihat Rincian Pemeriksaan &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setDetailPatient(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Hapus Pasien */}
      {deletingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-1">Konfirmasi Hapus Pasien</h3>
              <p className="text-xs text-slate-500 mb-4">
                Apakah Anda yakin ingin menghapus data pasien <strong>{deletingPatient.nama}</strong> ({deletingPatient.no_rm})?
              </p>
              <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-left text-[11px] mb-4 border border-amber-200">
                <strong>Ketentuan Integritas Data Medis:</strong> Pasien yang telah memiliki catatan riwayat kunjungan tidak dapat dihapus untuk mencegah hilangnya arsip rekam medis legal.
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingPatient(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 rounded-lg text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Ya, Hapus Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
