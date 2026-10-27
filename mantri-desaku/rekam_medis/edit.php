<?php
$current_page = 'rekam_medis';
$page_title = 'Edit Rekam Medis';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("
    SELECT rm.*, p.nama AS nama_pasien, p.no_rm 
    FROM rekam_medis rm 
    JOIN pasien p ON rm.pasien_id = p.id 
    WHERE rm.id = ?
");
$stmt->execute([$id]);
$record = $stmt->fetch();

if (!$record) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        die('Token keamanan tidak valid.');
    }

    $tanggal_kunjungan = trim($_POST['tanggal_kunjungan'] ?? '');
    $keluhan = trim($_POST['keluhan'] ?? '');
    $riwayat_keluhan = trim($_POST['riwayat_keluhan'] ?? '');
    $hasil_pemeriksaan = trim($_POST['hasil_pemeriksaan'] ?? '');
    $diagnosis = trim($_POST['diagnosis'] ?? '');
    $tindakan = trim($_POST['tindakan'] ?? '');
    $pengobatan = trim($_POST['pengobatan'] ?? '');
    $catatan_tambahan = trim($_POST['catatan_tambahan'] ?? '');

    if (empty($keluhan) || empty($diagnosis) || empty($tindakan)) {
        $error = 'Harap isi Keluhan Utama, Diagnosis Klinis, dan Tindakan yang dilakukan.';
    } else {
        $stmtUpdate = $pdo->prepare("
            UPDATE rekam_medis 
            SET tanggal_kunjungan = ?, keluhan = ?, riwayat_keluhan = ?, hasil_pemeriksaan = ?, diagnosis = ?, tindakan = ?, pengobatan = ?, catatan_tambahan = ?, updated_at = NOW()
            WHERE id = ?
        ");
        $stmtUpdate->execute([
            $tanggal_kunjungan,
            $keluhan,
            $riwayat_keluhan,
            $hasil_pemeriksaan,
            $diagnosis,
            $tindakan,
            $pengobatan,
            $catatan_tambahan,
            $id
        ]);

        log_audit($pdo, $_SESSION['user_id'], 'EDIT_REKAM_MEDIS', 'REKAM_MEDIS', "Mengedit rekam medis pasien {$record['nama_pasien']} ({$record['no_rm']})");

        header("Location: detail.php?id={$id}&status=updated");
        exit;
    }
}

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Rekam Medis</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Edit Rekam Medis</span>
        </div>
        <a href="detail.php?id=<?= $id ?>" class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Batal & Kembali
        </a>
    </header>

    <main class="p-4">
        <div class="row justify-content-center">
            <div class="col-lg-9">
                <div class="card border-0 shadow-sm rounded-3">
                    <div class="card-header bg-white py-3 border-bottom">
                        <h6 class="fw-bold mb-0 text-dark">Edit Catatan Pemeriksaan: <?= htmlspecialchars($record['nama_pasien']) ?> (<?= htmlspecialchars($record['no_rm']) ?>)</h6>
                    </div>
                    <div class="card-body p-4">
                        <?php if (!empty($error)): ?>
                            <div class="alert alert-danger py-2 small mb-3">
                                <i class="bi bi-exclamation-circle me-1"></i> <?= htmlspecialchars($error) ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST" action="">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">

                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Tanggal & Waktu Pemeriksaan</label>
                                <input type="datetime-local" name="tanggal_kunjungan" class="form-control" value="<?= date('Y-m-d\TH:i', strtotime($record['tanggal_kunjungan'])) ?>" required>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Keluhan Utama <span class="text-danger">*</span></label>
                                    <textarea name="keluhan" class="form-control" rows="3" required><?= htmlspecialchars($record['keluhan']) ?></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Riwayat Keluhan</label>
                                    <textarea name="riwayat_keluhan" class="form-control" rows="3"><?= htmlspecialchars($record['riwayat_keluhan']) ?></textarea>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Hasil Pemeriksaan Fisik & TTV <span class="text-danger">*</span></label>
                                <textarea name="hasil_pemeriksaan" class="form-control font-monospace" rows="3" required><?= htmlspecialchars($record['hasil_pemeriksaan']) ?></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Diagnosis / Temuan Klinis <span class="text-danger">*</span></label>
                                <input type="text" name="diagnosis" class="form-control" value="<?= htmlspecialchars($record['diagnosis']) ?>" required>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Tindakan Medis Dilakukan <span class="text-danger">*</span></label>
                                    <textarea name="tindakan" class="form-control" rows="3" required><?= htmlspecialchars($record['tindakan']) ?></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Pengobatan / Resep</label>
                                    <textarea name="pengobatan" class="form-control" rows="3"><?= htmlspecialchars($record['pengobatan']) ?></textarea>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label small fw-semibold">Catatan Tambahan / Instruksi Pasien</label>
                                <input type="text" name="catatan_tambahan" class="form-control" value="<?= htmlspecialchars($record['catatan_tambahan']) ?>">
                            </div>

                            <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                                <a href="detail.php?id=<?= $id ?>" class="btn btn-outline-secondary">Batal</a>
                                <button type="submit" class="btn btn-sage px-4">
                                    <i class="bi bi-check-lg me-1"></i> Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
