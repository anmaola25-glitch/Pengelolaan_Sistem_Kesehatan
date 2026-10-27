<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

$start_date = trim($_GET['start_date'] ?? date('Y-m-01'));
$end_date = trim($_GET['end_date'] ?? date('Y-m-d'));

$where_clauses = [];
$params = [];

if (!empty($start_date)) {
    $where_clauses[] = "DATE(rm.tanggal_kunjungan) >= ?";
    $params[] = $start_date;
}

if (!empty($end_date)) {
    $where_clauses[] = "DATE(rm.tanggal_kunjungan) <= ?";
    $params[] = $end_date;
}

$where_sql = $where_clauses ? "WHERE " . implode(" AND ", $where_clauses) : "";

// Total Pasien Terdaftar
$stmtPasien = $pdo->query("SELECT COUNT(*) FROM pasien");
$totalRegistered = $stmtPasien->fetchColumn();

// Data Rekapitulasi
$query = "
    SELECT rm.*, p.nama AS nama_pasien, p.no_rm, p.jenis_kelamin, p.alamat, u.nama AS petugas_nama
    FROM rekam_medis rm
    JOIN pasien p ON rm.pasien_id = p.id
    JOIN users u ON rm.user_id = u.id
    {$where_sql}
    ORDER BY rm.tanggal_kunjungan ASC
";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$records = $stmt->fetchAll();
$totalKunjungan = count($records);

// Cek ketersediaan Dompdf dari Composer
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
$hasDompdf = file_exists($autoloadPath);

if ($hasDompdf) {
    require_once $autoloadPath;
}

// Persiapkan Konten HTML untuk PDF / Print
ob_start();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Kunjungan - Praktik Mantri Desaku</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 1.5cm;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            color: #1a202c;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2d3748;
            padding-bottom: 8px;
            margin-bottom: 16px;
        }
        .clinic-name {
            font-size: 16pt;
            font-weight: bold;
            color: #1b3a32;
            margin-bottom: 4px;
        }
        .clinic-sub {
            font-size: 9pt;
            color: #4a5568;
            margin-bottom: 2px;
        }
        .report-title {
            text-align: center;
            font-size: 13pt;
            font-weight: bold;
            margin-top: 14px;
            margin-bottom: 4px;
        }
        .report-period {
            text-align: center;
            font-size: 9.5pt;
            color: #4a5568;
            margin-bottom: 16px;
        }
        .summary-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 10px 14px;
            margin-bottom: 16px;
            font-size: 9.5pt;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 9pt;
        }
        th, td {
            border: 1px solid #cbd5e0;
            padding: 6px 8px;
            vertical-align: top;
        }
        th {
            background-color: #2d5a4c;
            color: #ffffff;
            font-weight: bold;
            text-align: center;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-mono { font-family: monospace; }
        .signature-container {
            margin-top: 30px;
            float: right;
            width: 250px;
            text-align: center;
            font-size: 9.5pt;
        }
        .signature-space {
            height: 65px;
        }
        .footer-note {
            font-size: 8pt;
            color: #718096;
            margin-top: 40px;
            clear: both;
        }
        @media print {
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>

<?php if (!$hasDompdf): ?>
<div class="no-print" style="background:#fef3c7;border:1px solid #f59e0b;padding:12px;margin-bottom:20px;border-radius:6px;font-size:9.5pt;">
    <strong>Informasi Cetak:</strong> Library Dompdf belum diinstall via Composer di folder vendor XAMPP. Halaman ini menggunakan tampilan cetak browser standar A4. Untuk menghasilkan file PDF langsung di server, jalankan perintah: <code>composer require dompdf/dompdf</code> di folder proyek XAMPP.
    <button onclick="window.print()" style="margin-left:12px;padding:4px 12px;background:#2d5a4c;color:#fff;border:none;border-radius:4px;cursor:pointer;">Cetak / Simpan sebagai PDF</button>
</div>
<?php endif; ?>

<div class="header">
    <div class="clinic-name">PRAKTIK MANTRI DESAKU</div>
    <div class="clinic-sub">Pelayanan Kesehatan Tingkat Pertama & Asuhan Keperawatan Komunitas Desa</div>
    <div class="clinic-sub">Surat Izin Praktik Mantri (SIPM): 446/082/SIPM/DISKES/2026</div>
    <div class="clinic-sub">Jl. Raya Sukamaju No. 12, Kec. Margasari, Telp: (0283) 619-8800</div>
</div>

<div class="report-title">LAPORAN REKAPITULASI KUNJUNGAN PASIEN</div>
<div class="report-period">Periode: <?= date('d/m/Y', strtotime($start_date)) ?> s/d <?= date('d/m/Y', strtotime($end_date)) ?></div>

<div class="summary-box">
    <strong>Total Pasien Terdaftar:</strong> <?= number_format($totalRegistered) ?> Orang &nbsp;|&nbsp;
    <strong>Jumlah Kunjungan Periode Ini:</strong> <?= number_format($totalKunjungan) ?> Kunjungan Tercatat
</div>

<table>
    <thead>
        <tr>
            <th style="width: 5%;">No</th>
            <th style="width: 16%;">Tgl & Jam</th>
            <th style="width: 14%;">No. RM</th>
            <th style="width: 22%;">Nama Pasien</th>
            <th style="width: 23%;">Keluhan Utama</th>
            <th style="width: 20%;">Tindakan Medis</th>
        </tr>
    </thead>
    <tbody>
        <?php if (empty($records)): ?>
            <tr>
                <td colspan="6" class="text-center">Tidak ada data pemeriksaan pada periode ini.</td>
            </tr>
        <?php else: ?>
            <?php $no = 1; foreach ($records as $r): ?>
                <tr>
                    <td class="text-center"><?= $no++ ?></td>
                    <td class="text-center font-mono"><?= date('d/m/Y H:i', strtotime($r['tanggal_kunjungan'])) ?></td>
                    <td class="text-center font-mono"><strong><?= htmlspecialchars($r['no_rm']) ?></strong></td>
                    <td>
                        <?= htmlspecialchars($r['nama_pasien']) ?> (<?= $r['jenis_kelamin'] ?>)
                        <br><small style="color: #4a5568;"><?= htmlspecialchars($r['alamat']) ?></small>
                    </td>
                    <td><?= htmlspecialchars($r['keluhan']) ?></td>
                    <td><?= htmlspecialchars($r['tindakan']) ?></td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>

<div class="signature-container">
    <div>Sukamaju, <?= date('d F Y') ?></div>
    <div>Penanggung Jawab Praktik,</div>
    <div class="signature-space"></div>
    <div><strong>Mantri Ahmad Fauzi, S.Kep., Ners.</strong></div>
    <div style="font-size: 8pt; color: #4a5568;">SIPM: 446/082/SIPM/DISKES/2026</div>
</div>

<div class="footer-note">
    *Laporan rekapitulasi administratif resmi Praktik Mantri Desaku. Dicetak secara digital pada <?= date('d/m/Y H:i') ?>.
</div>

<?php if (!$hasDompdf): ?>
<script>
    // Otomatis buka dialog print saat dibuka di browser jika belum ada dompdf
    window.addEventListener('load', function() {
        // window.print();
    });
</script>
<?php endif; ?>

</body>
</html>
<?php
$htmlContent = ob_get_clean();

// Jika Dompdf terpasang, stream file PDF
if ($hasDompdf && class_exists('Dompdf\Dompdf')) {
    $options = new Dompdf\Options();
    $options->set('isRemoteEnabled', true);
    $options->set('defaultFont', 'Arial');

    $dompdf = new Dompdf\Dompdf($options);
    $dompdf->loadHtml($htmlContent);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    $fileName = 'laporan_kunjungan_' . date('Y-m', strtotime($start_date)) . '.pdf';
    $dompdf->stream($fileName, ['Attachment' => 1]);
    exit;
} else {
    // Tampilkan HTML terformat yang siap di Ctrl+P / print to PDF oleh browser
    echo $htmlContent;
    exit;
}
