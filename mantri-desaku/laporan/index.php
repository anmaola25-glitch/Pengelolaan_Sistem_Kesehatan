<?php
$current_page = 'laporan';
$page_title = 'Laporan Rekapitulasi Kunjungan';
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

// Total Pasien Terdaftar Keseluruhan
$stmtPasien = $pdo->query("SELECT COUNT(*) FROM pasien");
$totalRegistered = $stmtPasien->fetchColumn();

// Kunjungan dalam periode ini
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
$reportRecords = $stmt->fetchAll();
$totalKunjunganPeriode = count($reportRecords);

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Praktik Mantri Desaku</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Laporan Kunjungan</span>
        </div>
        <a href="cetak_pdf.php?start_date=<?= urlencode($start_date) ?>&end_date=<?= urlencode($end_date) ?>" target="_blank" class="btn btn-sm btn-danger">
            <i class="bi bi-file-earmark-pdf me-1"></i> Download PDF
        </a>
    </header>

    <main class="p-4">
        <!-- Filter Laporan -->
        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body p-3">
                <form method="GET" action="" class="row g-2 align-items-end">
                    <div class="col-md-4">
                        <label class="form-label small fw-semibold text-muted mb-1">Tanggal Awal Periode</label>
                        <input type="date" name="start_date" class="form-control" value="<?= htmlspecialchars($start_date) ?>" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small fw-semibold text-muted mb-1">Tanggal Akhir Periode</label>
                        <input type="date" name="end_date" class="form-control" value="<?= htmlspecialchars($end_date) ?>" required>
                    </div>
                    <div class="col-md-4 d-flex gap-2">
                        <button type="submit" class="btn btn-sage w-50">
                            <i class="bi bi-eye me-1"></i> Tampilkan
                        </button>
                        <a href="index.php" class="btn btn-outline-secondary w-50">Reset Filter</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Pratinjau Laporan Resmi A4 -->
        <div class="card border-0 shadow-sm rounded-3 bg-white p-4">
            <!-- Kop Surat Praktik Mantri Desaku -->
            <div class="text-center pb-3 border-bottom border-dark border-2 mb-4">
                <h4 class="fw-bold mb-1" style="color: #1b3a32; letter-spacing: 0.05em;">PRAKTIK MANTRI DESAKU</h4>
                <div class="small text-muted">Pelayanan Kesehatan Tingkat Pertama & Asuhan Keperawatan Komunitas Desa</div>
                <div class="small text-muted">Surat Izin Praktik Mantri (SIPM): 446/082/SIPM/DISKES/2026</div>
                <div class="small text-muted">Jl. Raya Sukamaju No. 12, Kec. Margasari, Telp: (0283) 619-8800</div>
            </div>

            <!-- Judul & Periode -->
            <div class="text-center mb-4">
                <h5 class="fw-bold mb-1 text-dark">LAPORAN REKAPITULASI KUNJUNGAN PASIEN</h5>
                <div class="small text-muted">
                    Periode: <strong><?= date('d/m/Y', strtotime($start_date)) ?></strong> s/d <strong><?= date('d/m/Y', strtotime($end_date)) ?></strong>
                </div>
            </div>

            <!-- Ringkasan Statistik -->
            <div class="row g-3 mb-4">
                <div class="col-sm-6">
                    <div class="p-3 bg-light rounded-3 border">
                        <div class="small text-muted">Total Pasien Terdaftar di Sistem:</div>
                        <h4 class="fw-bold text-dark my-1"><?= number_format($totalRegistered) ?> Orang</h4>
                        <small class="text-muted" style="font-size: 0.72rem;">Basis data demografi pasien wilayah desa</small>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="p-3 bg-light rounded-3 border">
                        <div class="small text-muted">Jumlah Kunjungan dalam Periode Terpilih:</div>
                        <h4 class="fw-bold text-success my-1"><?= number_format($totalKunjunganPeriode) ?> Kunjungan</h4>
                        <small class="text-muted" style="font-size: 0.72rem;">Pemeriksaan kesehatan tercatat</small>
                    </div>
                </div>
            </div>

            <!-- Rekapitulasi Tabel (Ringkas & Etis sesuai Pedoman Rekap Umum) -->
            <div class="table-responsive mb-4">
                <table class="table table-bordered table-sm align-middle small">
                    <thead class="table-light text-center">
                        <tr>
                            <th style="width: 5%;">No</th>
                            <th style="width: 15%;">Tgl & Jam</th>
                            <th style="width: 15%;">No. RM</th>
                            <th style="width: 20%;">Nama Pasien</th>
                            <th style="width: 25%;">Keluhan Utama</th>
                            <th style="width: 20%;">Tindakan Medis</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($reportRecords)): ?>
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">Tidak ada data kunjungan pada rentang tanggal yang dipilih.</td>
                            </tr>
                        <?php else: ?>
                            <?php $no = 1; foreach ($reportRecords as $row): ?>
                                <tr>
                                    <td class="text-center"><?= $no++ ?></td>
                                    <td class="text-center font-monospace small"><?= date('d/m/Y H:i', strtotime($row['tanggal_kunjungan'])) ?></td>
                                    <td class="font-monospace fw-semibold text-center"><?= htmlspecialchars($row['no_rm']) ?></td>
                                    <td>
                                        <div class="fw-semibold"><?= htmlspecialchars($row['nama_pasien']) ?></div>
                                        <small class="text-muted"><?= htmlspecialchars($row['alamat']) ?></small>
                                    </td>
                                    <td><?= htmlspecialchars($row['keluhan']) ?></td>
                                    <td><?= htmlspecialchars($row['tindakan']) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Pengesahan / Tanda Tangan -->
            <div class="row mt-4 pt-2">
                <div class="col-6 small text-muted">
                    <em>*Dicetak secara otomatis melalui Sistem Informasi Praktik Mantri Desaku pada <?= date('d/m/Y H:i') ?>.</em>
                </div>
                <div class="col-6 text-end">
                    <div class="small text-muted mb-1">Sukamaju, <?= date('d F Y') ?></div>
                    <div class="small fw-semibold text-dark">Penanggung Jawab Praktik,</div>
                    <div style="height: 60px;"></div>
                    <div class="fw-bold text-dark">Mantri Ahmad Fauzi, S.Kep., Ners.</div>
                    <div class="small text-muted">SIPM: 446/082/SIPM/DISKES/2026</div>
                </div>
            </div>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
