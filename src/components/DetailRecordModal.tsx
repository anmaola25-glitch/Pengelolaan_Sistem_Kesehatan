import React from 'react';
import { RekamMedis } from '../types';
import { 
  X, 
  Calendar, 
  Stethoscope, 
  Activity, 
  FileText, 
  User, 
  Pill, 
  ShieldCheck,
  MapPin,
  Phone
} from 'lucide-react';
import { motion } from 'motion/react';

interface DetailRecordModalProps {
  record: RekamMedis | null;
  onClose: () => void;
}

export const DetailRecordModal: React.FC<DetailRecordModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col text-xs transition-colors"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800">
                {record.pasien?.no_rm}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{record.pasien?.nama}</h3>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {record.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Tanggal Kunjungan: {record.tanggal_kunjungan}</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Patient Quick Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{record.pasien?.alamat}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{record.pasien?.no_telepon || '-'}</span>
            </div>
          </div>

          {/* Anamnesis */}
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Anamnesis & Keluhan</span>
            </h4>
            <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-semibold uppercase">Keluhan Utama</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{record.keluhan}</p>
              </div>
              {record.riwayat_keluhan && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-semibold uppercase">Riwayat Keluhan / Penyakit Terdahulu</span>
                  <p className="text-slate-600 dark:text-slate-300">{record.riwayat_keluhan}</p>
                </div>
              )}
            </div>
          </div>

          {/* Hasil Pemeriksaan & TTV */}
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Tanda-Tanda Vital & Hasil Pemeriksaan Fisik</span>
            </h4>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                {record.hasil_pemeriksaan}
              </div>
            </div>
          </div>

          {/* Diagnosis & Tindakan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1">
              <span className="text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider block">
                Diagnosis / Temuan Klinis
              </span>
              <p className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">{record.diagnosis}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 space-y-1">
              <span className="text-slate-400 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                Tindakan Medis Dilakukan
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{record.tindakan}</p>
            </div>
          </div>

          {/* Pengobatan / Resep */}
          {record.pengobatan && (
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                <span>Pengobatan & Resep Terapi</span>
              </h4>
              <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
                {record.pengobatan}
              </div>
            </div>
          )}

          {/* Catatan Tambahan */}
          {record.catatan_tambahan && (
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px]">
              <span className="font-bold block mb-0.5">Catatan Tambahan & Edukasi Pasien:</span>
              <p>{record.catatan_tambahan}</p>
            </div>
          )}

          {/* Petugas Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Sistem Informasi Praktik Mantri Desaku</span>
            <span>Tenaga Medis Pencatat: <strong className="text-slate-700 dark:text-slate-200">{record.petugas_nama}</strong></span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
