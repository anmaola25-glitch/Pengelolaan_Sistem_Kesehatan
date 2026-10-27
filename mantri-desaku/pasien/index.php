<?php
$current_page = 'pasien';
$page_title = 'Data Pasien';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

// Search & Pagination
$search = trim($_GET['search'] ?? '');
$filter_jk = trim($_GET['jk'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$limit = 10;
$offset = ($page - 1) * $limit;

$where_clauses = [];
$params = [];

if (!empty($search)) {
    $where_clauses[] = "(nama LIKE ? OR no_rm LIKE ?)";
    $params[] = "%{$search}%";
    $params[] = "%{$search}%";
}

if (!empty($filter_jk)) {
    $where_clauses[] = "jenis_kelamin = ?";
    $params[] = $filter_jk;
}

$where_sql = $where_clauses ? "WHERE " . implode(" AND ", $where_clauses) : "";

// Count Total
$stmtCount = $pdo->prepare("SELECT COUNT(*) FROM pasien {$where_sql}");
$stmtCount->execute($params);
$totalRows = $stmtCount->fetchColumn();
$totalPages = ceil($totalRows / $limit);

// Fetch Data
$query = "SELECT * FROM pasien {$where_sql} ORDER BY id DESC LIMIT {$limit} OFFSET {$offset}";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$pasienList = $stmt->fetchAll();

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Praktik Mantri Desaku</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Data Pasien</span>
        </div>
        <a href="tambah.php" class="btn btn-sm btn-sage">
            <i class="bi bi-person-plus me-1"></i> Tambah Pasien Baru
        </a>
    </header>

    <main class="p-4">
        <?php if (isset($_GET['status'])): ?>
            <?php if ($_GET['status'] === 'success'): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle me-1"></i> Data pasien berhasil disimpan!
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <?php elseif ($_GET['status'] === 'deleted'): ?>
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <i class="bi bi-trash me-1"></i> Data pasien berhasil dihapus.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <?php elseif ($_GET['status'] === 'has_records'): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle me-1"></i> Pasien tidak dapat dihapus karena memiliki riwayat rekam medis!
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <?php endif; ?>
        <?php endif; ?>

        <!-- Filter & Search Toolbar -->
        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body p-3">
                <form method="GET" action="" class="row g-2 align-items-center">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
                            <input type="text" name="search" class="form-control" placeholder="Cari nama pasien atau No. RM..." value="<?= htmlspecialchars($search) ?>">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select name="jk" class="form-select">
                            <option value="">Semua Jenis Kelamin</option>
                            <option value="L" <?= $filter_jk === 'L' ? 'selected' : '' ?>>Laki-laki</option>
                            <option value="P" <?= $filter_jk === 'P' ? 'selected' : '' ?>>Perempuan</option>
                        </select>
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

        <!-- Tabel Data Pasien -->
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Daftar Pasien Terdaftar (<?= number_format($totalRows) ?>)</h6>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light small">
                        <tr>
                            <th>No. RM</th>
                            <th>Nama Pasien</th>
                            <th>L/P</th>
                            <th>Tanggal Lahir</th>
                            <th>Alamat Domisili</th>
                            <th>No. Telepon</th>
                            <th class="text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($pasienList)): ?>
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">Tidak ada data pasien yang ditemukan.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($pasienList as $p): ?>
                                <tr>
                                    <td>
                                        <span class="fw-bold text-dark font-monospace"><?= htmlspecialchars($p['no_rm']) ?></span>
                                    </td>
                                    <td class="fw-semibold text-dark">
                                        <?= htmlspecialchars($p['nama']) ?>
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark border"><?= $p['jenis_kelamin'] === 'L' ? 'L' : 'P' ?></span>
                                    </td>
                                    <td class="small text-muted tabular-nums">
                                        <?= date('d/m/Y', strtotime($p['tanggal_lahir'])) ?>
                                    </td>
                                    <td class="small text-truncate" style="max-width: 250px;">
                                        <?= htmlspecialchars($p['alamat']) ?>
                                    </td>
                                    <td class="small font-monospace text-muted">
                                        <?= htmlspecialchars($p['no_telepon'] ?: '-') ?>
                                    </td>
                                    <td class="text-end">
                                        <a href="edit.php?id=<?= $p['id'] ?>" class="btn btn-sm btn-outline-primary me-1" title="Edit Data Pasien">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                        <a href="hapus.php?id=<?= $p['id'] ?>" class="btn btn-sm btn-outline-danger" title="Hapus Pasien" onclick="return confirm('Apakah Anda yakin ingin menghapus data pasien <?= htmlspecialchars($p['nama']) ?>? Data yang terhubung dengan rekam medis tidak dapat dihapus.');">
                                            <i class="bi bi-trash"></i>
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
                                <a class="page-link" href="?page=<?= $page - 1 ?>&search=<?= urlencode($search) ?>&jk=<?= urlencode($filter_jk) ?>">Sebelumnya</a>
                            </li>
                            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                <li class="page-item <?= $page === $i ? 'active' : '' ?>">
                                    <a class="page-link" href="?page=<?= $i ?>&search=<?= urlencode($search) ?>&jk=<?= urlencode($filter_jk) ?>"><?= $i ?></a>
                                </li>
                            <?php endfor; ?>
                            <li class="page-item <?= $page >= $totalPages ? 'disabled' : '' ?>">
                                <a class="page-link" href="?page=<?= $page + 1 ?>&search=<?= urlencode($search) ?>&jk=<?= urlencode($filter_jk) ?>">Selanjutnya</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            <?php endif; ?>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
