<?php
$current_page = 'dashboard';
$page_title = 'Dashboard';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

// Ambil statistik riil dari database MySQL
$stmtTotalPasien = $pdo->query("SELECT COUNT(*) FROM pasien");
$totalPasien = $stmtTotalPasien->fetchColumn();

$stmtHariIni = $pdo->query("SELECT COUNT(*) FROM rekam_medis WHERE DATE(tanggal_kunjungan) = CURDATE()");
$kunjunganHariIni = $stmtHariIni->fetchColumn();

$stmtBulanIni = $pdo->query("SELECT COUNT(*) FROM rekam_medis WHERE MONTH(tanggal_kunjungan) = MONTH(CURDATE()) AND YEAR(tanggal_kunjungan) = YEAR(CURDATE())");
$kunjunganBulanIni = $stmtBulanIni->fetchColumn();

$stmtTotalRM = $pdo->query("SELECT COUNT(*) FROM rekam_medis");
$totalRekamMedis = $stmtTotalRM->fetchColumn();

// 5 Kunjungan Terakhir
$stmtTerbaru = $pdo->query("
    SELECT rm.*, p.nama AS nama_pasien, p.no_rm, p.jenis_kelamin 
    FROM rekam_medis rm
    JOIN pasien p ON rm.pasien_id = p.id
    ORDER BY rm.tanggal_kunjungan DESC
    LIMIT 5
");
$kunjunganTerbaru = $stmtTerbaru->fetchAll();

// Statistik Kunjungan 7 Hari Terakhir untuk grafik
$stmtChart = $pdo->query("
    SELECT DATE(tanggal_kunjungan) as tgl, COUNT(*) as jumlah
    FROM rekam_medis
    WHERE tanggal_kunjungan >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(tanggal_kunjungan)
    ORDER BY tgl ASC
");
$chartData = $stmtChart->fetchAll();

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <!-- Top Navbar -->
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Praktik Mantri Desaku</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Dashboard</span>
        </div>
        <div class="d-flex align-items-center gap-3">
            <span class="badge bg-light text-dark border px-3 py-2 fw-normal">
                <i class="bi bi-calendar3 me-1 text-success"></i> <?= date('d M Y') ?>
            </span>
            <div class="text-end d-none d-sm-block">
                <div class="small fw-bold"><?= htmlspecialchars($_SESSION['nama']) ?></div>
                <div class="text-muted" style="font-size: 0.72rem;"><?= ucfirst($_SESSION['role']) ?> Pelayanan</div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="p-4">
        <!-- Welcome Alert -->
        <div class="alert bg-white border border-success-subtle shadow-sm rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
                <div class="p-2 rounded-2 bg-success text-white">
                    <i class="bi bi-shield-check fs-4"></i>
                </div>
                <div>
                    <h6 class="mb-0 fw-bold">Selamat Datang di Praktik Mantri Desaku</h6>
                    <small class="text-muted">Kelola data rekam medis pasien desa secara akurat, terstruktur, dan aman.</small>
                </div>
            </div>
            <div class="d-flex gap-2">
                <a href="../pasien/tambah.php" class="btn btn-sm btn-outline-success">
                    <i class="bi bi-person-plus me-1"></i> Tambah Pasien
                </a>
                <a href="../rekam_medis/tambah.php" class="btn btn-sm btn-sage">
                    <i class="bi bi-file-earmark-plus me-1"></i> Rekam Medis Baru
                </a>
            </div>
        </div>

        <!-- 4 Kartu Statistik Riil dari Database -->
        <div class="row g-3 mb-4">
            <div class="col-sm-6 col-xl-3">
                <div class="card-stat">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-semibold">Total Pasien Terdaftar</span>
                            <h3 class="fw-bold my-1 tabular-nums text-dark"><?= number_format($totalPasien) ?></h3>
                            <small class="text-success"><i class="bi bi-people me-1"></i>Pasien wilayah desa</small>
                        </div>
                        <div class="p-2 bg-light rounded-3 text-success">
                            <i class="bi bi-person-badge fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xl-3">
                <div class="card-stat">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-semibold">Kunjungan Hari Ini</span>
                            <h3 class="fw-bold my-1 tabular-nums text-dark"><?= number_format($kunjunganHariIni) ?></h3>
                            <small class="text-primary"><i class="bi bi-clock me-1"></i><?= date('d/m/Y') ?></small>
                        </div>
                        <div class="p-2 bg-light rounded-3 text-primary">
                            <i class="bi bi-calendar-check fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xl-3">
                <div class="card-stat">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-semibold">Kunjungan Bulan Ini</span>
                            <h3 class="fw-bold my-1 tabular-nums text-dark"><?= number_format($kunjunganBulanIni) ?></h3>
                            <small class="text-muted">Bulan <?= date('F Y') ?></small>
                        </div>
                        <div class="p-2 bg-light rounded-3 text-info">
                            <i class="bi bi-calendar3-range fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xl-3">
                <div class="card-stat">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-semibold">Total Rekam Medis</span>
                            <h3 class="fw-bold my-1 tabular-nums text-dark"><?= number_format($totalRekamMedis) ?></h3>
                            <small class="text-success"><i class="bi bi-check2-circle me-1"></i>Riwayat tersimpan</small>
                        </div>
                        <div class="p-2 bg-light rounded-3 text-secondary">
                            <i class="bi bi-journal-medical fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel Kunjungan Pasien Terbaru -->
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="fw-bold mb-0 text-dark">Kunjungan Pasien Terbaru</h6>
                    <small class="text-muted">Daftar pemeriksaan terakhir yang tercatat di database</small>
                </div>
                <a href="../riwayat/index.php" class="btn btn-sm btn-outline-secondary">
                    Lihat Semua Riwayat <i class="bi bi-arrow-right ms-1"></i>
                </a>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light small">
                        <tr>
                            <th>Tgl & Jam</th>
                            <th>No. RM</th>
                            <th>Nama Pasien</th>
                            <th>Keluhan Utama</th>
                            <th>Diagnosis Klinis</th>
                            <th class="text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($kunjunganTerbaru)): ?>
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">Belum ada catatan kunjungan pasien.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($kunjunganTerbaru as $row): ?>
                                <tr>
                                    <td class="small tabular-nums text-muted">
                                        <?= date('d/m/Y H:i', strtotime($row['tanggal_kunjungan'])) ?>
                                    </td>
                                    <td>
                                        <span class="fw-bold text-dark font-monospace"><?= htmlspecialchars($row['no_rm']) ?></span>
                                    </td>
                                    <td>
                                        <div class="fw-semibold"><?= htmlspecialchars($row['nama_pasien']) ?></div>
                                        <small class="text-muted"><?= $row['jenis_kelamin'] === 'L' ? 'Laki-laki' : 'Perempuan' ?></small>
                                    </td>
                                    <td class="small text-truncate" style="max-width: 220px;">
                                        <?= htmlspecialchars($row['keluhan']) ?>
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark border"><?= htmlspecialchars($row['diagnosis']) ?></span>
                                    </td>
                                    <td class="text-end">
                                        <a href="../rekam_medis/detail.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-outline-success">
                                            <i class="bi bi-eye"></i> Detail
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
