<?php
$current_page = 'rekam_medis';
$page_title = 'Rekam Medis';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

$search = trim($_GET['search'] ?? '');
$tgl = trim($_GET['tgl'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$limit = 10;
$offset = ($page - 1) * $limit;

$where_clauses = [];
$params = [];

if (!empty($search)) {
    $where_clauses[] = "(p.nama LIKE ? OR p.no_rm LIKE ? OR rm.diagnosis LIKE ?)";
    $params[] = "%{$search}%";
    $params[] = "%{$search}%";
    $params[] = "%{$search}%";
}

if (!empty($tgl)) {
    $where_clauses[] = "DATE(rm.tanggal_kunjungan) = ?";
    $params[] = $tgl;
}

$where_sql = $where_clauses ? "WHERE " . implode(" AND ", $where_clauses) : "";

// Count Total
$stmtCount = $pdo->prepare("
    SELECT COUNT(*) 
    FROM rekam_medis rm
    JOIN pasien p ON rm.pasien_id = p.id
    {$where_sql}
");
$stmtCount->execute($params);
$totalRows = $stmtCount->fetchColumn();
$totalPages = ceil($totalRows / $limit);

// Fetch Data
$query = "
    SELECT rm.*, p.nama AS nama_pasien, p.no_rm, p.jenis_kelamin, u.nama AS petugas_nama
    FROM rekam_medis rm
    JOIN pasien p ON rm.pasien_id = p.id
    JOIN users u ON rm.user_id = u.id
    {$where_sql}
    ORDER BY rm.tanggal_kunjungan DESC
    LIMIT {$limit} OFFSET {$offset}
";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$records = $stmt->fetchAll();

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Praktik Mantri Desaku</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Rekam Medis</span>
        </div>
        <a href="tambah.php" class="btn btn-sm btn-sage">
            <i class="bi bi-file-earmark-plus me-1"></i> Catat Rekam Medis Baru
        </a>
    </header>

    <main class="p-4">
        <?php if (isset($_GET['status']) && $_GET['status'] === 'success'): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle me-1"></i> Catatan rekam medis berhasil disimpan!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <!-- Toolbar Pencarian & Filter -->
        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body p-3">
                <form method="GET" action="" class="row g-2 align-items-center">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
                            <input type="text" name="search" class="form-control" placeholder="Cari pasien, no RM, diagnosis..." value="<?= htmlspecialchars($search) ?>">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <input type="date" name="tgl" class="form-control" value="<?= htmlspecialchars($tgl) ?>">
                    </div>
                    <div class="col-md-4 d-flex gap-2">
                        <button type="submit" class="btn btn-outline-success">
                            <i class="bi bi-funnel me-1"></i> Filter
                        </button>
                        <a href="index.php" class="btn btn-outline-secondary">Reset</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Tabel Rekam Medis -->
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Catatan Rekam Medis Pasien (<?= number_format($totalRows) ?>)</h6>
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
                            <th>Petugas</th>
                            <th class="text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($records)): ?>
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">Belum ada rekam medis yang dicatat.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($records as $r): ?>
                                <tr>
                                    <td class="small tabular-nums text-muted">
                                        <?= date('d/m/Y H:i', strtotime($r['tanggal_kunjungan'])) ?>
                                    </td>
                                    <td>
                                        <span class="fw-bold text-dark font-monospace"><?= htmlspecialchars($r['no_rm']) ?></span>
                                    </td>
                                    <td class="fw-semibold">
                                        <?= htmlspecialchars($r['nama_pasien']) ?>
                                    </td>
                                    <td class="small text-truncate" style="max-width: 200px;">
                                        <?= htmlspecialchars($r['keluhan']) ?>
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark border"><?= htmlspecialchars($r['diagnosis']) ?></span>
                                    </td>
                                    <td class="small text-muted">
                                        <?= htmlspecialchars($r['petugas_nama']) ?>
                                    </td>
                                    <td class="text-end">
                                        <a href="detail.php?id=<?= $r['id'] ?>" class="btn btn-sm btn-outline-success me-1" title="Lihat Detail Pemeriksaan">
                                            <i class="bi bi-eye"></i> Detail
                                        </a>
                                        <a href="edit.php?id=<?= $r['id'] ?>" class="btn btn-sm btn-outline-primary" title="Edit Rekam Medis">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
                <div class="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
                    <small class="text-muted">Halaman <?= $page ?> dari <?= $totalPages ?></small>
                    <nav>
                        <ul class="pagination pagination-sm mb-0">
                            <li class="page-item <?= $page <= 1 ? 'disabled' : '' ?>">
                                <a class="page-link" href="?page=<?= $page - 1 ?>&search=<?= urlencode($search) ?>&tgl=<?= urlencode($tgl) ?>">Sebelumnya</a>
                            </li>
                            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                <li class="page-item <?= $page === $i ? 'active' : '' ?>">
                                    <a class="page-link" href="?page=<?= $i ?>&search=<?= urlencode($search) ?>&tgl=<?= urlencode($tgl) ?>"><?= $i ?></a>
                                </li>
                            <?php endfor; ?>
                            <li class="page-item <?= $page >= $totalPages ? 'disabled' : '' ?>">
                                <a class="page-link" href="?page=<?= $page + 1 ?>&search=<?= urlencode($search) ?>&tgl=<?= urlencode($tgl) ?>">Selanjutnya</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            <?php endif; ?>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
