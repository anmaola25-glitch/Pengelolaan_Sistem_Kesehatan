<?php
$current_page = 'riwayat';
$page_title = 'Riwayat Kunjungan Pasien';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

// Ambil list pasien untuk dropdown filter
$stmtPasien = $pdo->query("SELECT id, no_rm, nama FROM pasien ORDER BY nama ASC");
$pasienList = $stmtPasien->fetchAll();

$filter_pasien = (int)($_GET['pasien_id'] ?? 0);
$filter_start = trim($_GET['start_date'] ?? '');
$filter_end = trim($_GET['end_date'] ?? '');
$search = trim($_GET['search'] ?? '');
$sort = ($_GET['sort'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

$where_clauses = [];
$params = [];

if ($filter_pasien > 0) {
    $where_clauses[] = "rm.pasien_id = ?";
    $params[] = $filter_pasien;
}

if (!empty($search)) {
    $where_clauses[] = "(p.nama LIKE ? OR p.no_rm LIKE ?)";
    $params[] = "%{$search}%";
    $params[] = "%{$search}%";
}

if (!empty($filter_start)) {
    $where_clauses[] = "DATE(rm.tanggal_kunjungan) >= ?";
    $params[] = $filter_start;
}

if (!empty($filter_end)) {
    $where_clauses[] = "DATE(rm.tanggal_kunjungan) <= ?";
    $params[] = $filter_end;
}

$where_sql = $where_clauses ? "WHERE " . implode(" AND ", $where_clauses) : "";

$query = "
    SELECT rm.*, p.nama AS nama_pasien, p.no_rm, p.jenis_kelamin, p.tanggal_lahir, u.nama AS petugas_nama
    FROM rekam_medis rm
    JOIN pasien p ON rm.pasien_id = p.id
    JOIN users u ON rm.user_id = u.id
    {$where_sql}
    ORDER BY rm.tanggal_kunjungan {$sort}
";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$historyRecords = $stmt->fetchAll();

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Praktik Mantri Desaku</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Riwayat Kunjungan</span>
        </div>
        <span class="badge bg-light text-dark border px-3 py-2">
            Total Riwayat Ditemukan: <?= count($historyRecords) ?>
        </span>
    </header>

    <main class="p-4">
        <!-- Filter Toolbar -->
        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body p-3">
                <form method="GET" action="" class="row g-2 align-items-center">
                    <div class="col-md-3">
                        <label class="form-label small text-muted mb-1">Filter Pasien</label>
                        <select name="pasien_id" class="form-select form-select-sm">
                            <option value="">-- Semua Pasien --</option>
                            <?php foreach ($pasienList as $p): ?>
                                <option value="<?= $p['id'] ?>" <?= $filter_pasien === $p['id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($p['no_rm']) ?> - <?= htmlspecialchars($p['nama']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="col-md-2">
                        <label class="form-label small text-muted mb-1">Tanggal Mulai</label>
                        <input type="date" name="start_date" class="form-control form-control-sm" value="<?= htmlspecialchars($filter_start) ?>">
                    </div>

                    <div class="col-md-2">
                        <label class="form-label small text-muted mb-1">Tanggal Selesai</label>
                        <input type="date" name="end_date" class="form-control form-control-sm" value="<?= htmlspecialchars($filter_end) ?>">
                    </div>

                    <div class="col-md-2">
                        <label class="form-label small text-muted mb-1">Urutan Waktu</label>
                        <select name="sort" class="form-select form-select-sm">
                            <option value="desc" <?= $sort === 'DESC' ? 'selected' : '' ?>>Terbaru ke Terlama</option>
                            <option value="asc" <?= $sort === 'ASC' ? 'selected' : '' ?>>Terlama ke Terbaru</option>
                        </select>
                    </div>

                    <div class="col-md-3 d-flex gap-2 align-items-end pt-3">
                        <button type="submit" class="btn btn-sm btn-outline-success w-50">
                            <i class="bi bi-funnel me-1"></i> Terapkan
                        </button>
                        <a href="index.php" class="btn btn-sm btn-outline-secondary w-50">Reset</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Timeline Riwayat -->
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white py-3 border-bottom">
                <h6 class="fw-bold mb-0">Daftar Linimasa Riwayat Medis</h6>
            </div>
            <div class="card-body p-4">
                <?php if (empty($historyRecords)): ?>
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-clock-history fs-1 mb-2 d-block"></i>
                        <p class="mb-0">Tidak ada riwayat kunjungan yang sesuai dengan filter pencarian.</p>
                    </div>
                <?php else: ?>
                    <div class="list-group list-group-flush">
                        <?php foreach ($historyRecords as $item): ?>
                            <div class="list-group-item px-0 py-3 border-bottom">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="badge bg-light text-dark border font-monospace">
                                            <?= htmlspecialchars($item['no_rm']) ?>
                                        </span>
                                        <h6 class="mb-0 fw-bold text-dark"><?= htmlspecialchars($item['nama_pasien']) ?></h6>
                                        <span class="text-muted small">
                                            (<?= $item['jenis_kelamin'] === 'L' ? 'L' : 'P' ?>)
                                        </span>
                                    </div>
                                    <span class="small text-muted tabular-nums">
                                        <i class="bi bi-calendar3 me-1"></i> <?= date('d M Y, H:i', strtotime($item['tanggal_kunjungan'])) ?>
                                    </span>
                                </div>

                                <div class="row g-2 mt-1">
                                    <div class="col-md-5">
                                        <div class="small text-muted">Keluhan Utama:</div>
                                        <div class="small text-dark"><?= htmlspecialchars($item['keluhan']) ?></div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="small text-muted">Diagnosis Klinis:</div>
                                        <div class="small fw-semibold text-success"><?= htmlspecialchars($item['diagnosis']) ?></div>
                                    </div>
                                    <div class="col-md-3 text-md-end">
                                        <a href="../rekam_medis/detail.php?id=<?= $item['id'] ?>" class="btn btn-sm btn-outline-success mt-1">
                                            <i class="bi bi-box-arrow-up-right me-1"></i> Lihat Rekam Medis
                                        </a>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
