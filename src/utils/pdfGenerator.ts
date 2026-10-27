import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RekamMedis } from '../types';

interface GenerateReportOptions {
  startDate: string;
  endDate: string;
  records: RekamMedis[];
  totalRegisteredPatients: number;
  mantriName?: string;
}

export function generateLaporanPDF(options: GenerateReportOptions): void {
  const { startDate, endDate, records, totalRegisteredPatients, mantriName = 'Mantri Ahmad Fauzi, S.Kep., Ners.' } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // --- KOP SURAT PRAKTIK MANTRI DESAKU ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(27, 58, 50); // Dark Sage Teal
  doc.text('PRAKTIK MANTRI DESAKU', pageWidth / 2, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Pelayanan Kesehatan Dasar Masyarakat & Asuhan Keperawatan Komunitas Desa', pageWidth / 2, 23, { align: 'center' });
  doc.text('Surat Izin Praktik Mantri (SIPM): 446/082/SIPM/DISKES/2026', pageWidth / 2, 27, { align: 'center' });
  doc.text('Jl. Raya Balai Desa Sukamaju No. 12, Kec. Margasari, Telp: (0283) 619-8800', pageWidth / 2, 31, { align: 'center' });

  // Divider line
  doc.setDrawColor(47, 79, 79);
  doc.setLineWidth(0.8);
  doc.line(14, 34, pageWidth - 14, 34);
  doc.setLineWidth(0.2);
  doc.line(14, 35, pageWidth - 14, 35);

  // --- JUDUL LAPORAN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('LAPORAN REKAPITULASI KUNJUNGAN PASIEN', pageWidth / 2, 42, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const formattedStart = startDate || 'Semua Data';
  const formattedEnd = endDate || 'Hingga Sekarang';
  doc.text(`Periode Pemeriksaan: ${formattedStart} s/d ${formattedEnd}`, pageWidth / 2, 47, { align: 'center' });

  // --- RINGKASAN METRIK ---
  doc.setFillColor(245, 247, 246);
  doc.roundedRect(14, 52, pageWidth - 28, 14, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 52, pageWidth - 28, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Total Pasien Terdaftar:', 20, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(`${totalRegisteredPatients} orang`, 60, 58);

  doc.setFont('helvetica', 'bold');
  doc.text('Jumlah Kunjungan dalam Periode:', 105, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(`${records.length} kunjungan tercatat`, 160, 58);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('*Laporan rekapitulasi umum untuk dokumentasi administratif berkala praktik mandiri nakes.', 20, 63);

  // --- TABEL DATA ---
  const tableData = records.map((rec, index) => {
    const tgl = rec.tanggal_kunjungan.substring(0, 10);
    const jam = rec.tanggal_kunjungan.substring(11, 16) || '-';
    const pasienNama = rec.pasien?.nama || '-';
    const noRm = rec.pasien?.no_rm || '-';
    const jk = rec.pasien?.jenis_kelamin || '-';
    
    // Keluhan & Tindakan (ringkas untuk rekap umum)
    const keluhanRingkas = rec.keluhan.length > 55 ? rec.keluhan.substring(0, 52) + '...' : rec.keluhan;
    const tindakanRingkas = rec.tindakan.length > 55 ? rec.tindakan.substring(0, 52) + '...' : rec.tindakan;

    return [
      (index + 1).toString(),
      `${tgl}\n${jam}`,
      noRm,
      `${pasienNama} (${jk})`,
      keluhanRingkas,
      tindakanRingkas,
      rec.petugas_nama || 'Mantri Desa'
    ];
  });

  autoTable(doc, {
    startY: 70,
    head: [['No', 'Tgl / Jam', 'No. RM', 'Nama Pasien', 'Keluhan Utama', 'Tindakan Medis Dilakukan', 'Petugas']],
    body: tableData.length > 0 ? tableData : [['-', '-', '-', 'Tidak ada data kunjungan dalam periode ini', '-', '-', '-']],
    theme: 'striped',
    headStyles: {
      fillColor: [47, 79, 79], // Deep Sea / Sage Teal
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [33, 37, 41]
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 32 },
      4: { cellWidth: 42 },
      5: { cellWidth: 40 },
      6: { cellWidth: 20, halign: 'center' }
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2
    },
    margin: { left: 14, right: 14 }
  });

  // Position after table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastY = (doc as any).lastAutoTable?.finalY || 160;

  // Check if enough space for signature block, else add page
  let signY = lastY + 14;
  if (signY + 45 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    signY = 25;
  }

  // Indonesian date formatting for signature
  const today = new Date();
  const monthsIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dateStrIndo = `${today.getDate()} ${monthsIndo[today.getMonth()]} ${today.getFullYear()}`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const signX = pageWidth - 70;
  doc.text(`Sukamaju, ${dateStrIndo}`, signX, signY);
  doc.text('Penanggung Jawab Praktik,', signX, signY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text(mantriName, signX, signY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('SIPM: 446/082/SIPM/DISKES/2026', signX, signY + 32);

  // Footer page number
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Sistem Informasi Rekam Medis Praktik Mantri Desaku — Dicetak pada ${dateStrIndo}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - 30,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  // Auto file name e.g., laporan_kunjungan_2026-10.pdf
  const fileDateMonth = today.toISOString().substring(0, 7);
  const fileName = `laporan_kunjungan_${fileDateMonth}.pdf`;
  doc.save(fileName);
}
