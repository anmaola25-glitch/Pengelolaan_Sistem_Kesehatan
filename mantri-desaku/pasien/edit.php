<?php
$current_page = 'pasien';
$page_title = 'Edit Data Pasien';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT * FROM pasien WHERE id = ?");
$stmt->execute([$id]);
$pasien = $stmt->fetch();

if (!$pasien) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        die('Token keamanan tidak valid.');
    }

    $no_rm = trim($_POST['no_rm'] ?? '');
    $nama = trim($_POST['nama'] ?? '');
    $tanggal_lahir = trim($_POST['tanggal_lahir'] ?? '');
    $jenis_kelamin = trim($_POST['jenis_kelamin'] ?? 'L');
    $alamat = trim($_POST['alamat'] ?? '');
    $no_telepon = trim($_POST['no_telepon'] ?? '');

    if (empty($no_rm) || empty($nama) || empty($tanggal_lahir) || empty($alamat)) {
        $error = 'Harap isi semua kolom wajib.';
    } else {
        // Cek duplikasi no_rm dengan record lain
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM pasien WHERE no_rm = ? AND id != ?");
        $stmtCheck->execute([$no_rm, $id]);
        if ($stmtCheck->fetchColumn() > 0) {
            $error = "Nomor Rekam Medis {$no_rm} sudah digunakan oleh pasien lain.";
        } else {
            $stmtUpdate = $pdo->prepare("UPDATE pasien SET no_rm = ?, nama = ?, tanggal_lahir = ?, jenis_kelamin = ?, alamat = ?, no_telepon = ?, updated_at = NOW() WHERE id = ?");
            $stmtUpdate->execute([$no_rm, $nama, $tanggal_lahir, $jenis_kelamin, $alamat, $no_telepon, $id]);

            log_audit($pdo, $_SESSION['user_id'], 'EDIT_PASIEN', 'PASIEN', "Mengubah data pasien {$nama} ({$no_rm})");

            header('Location: index.php?status=success');
            exit;
        }
    }
}

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Data Pasien</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Edit Pasien</span>
        </div>
        <a href="index.php" class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Kembali
        </a>
    </header>

    <main class="p-4">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm rounded-3">
                    <div class="card-header bg-white py-3 border-bottom">
                        <h6 class="fw-bold mb-0 text-dark">Edit Data Pasien: <?= htmlspecialchars($pasien['nama']) ?></h6>
                    </div>
                    <div class="card-body p-4">
                        <?php if (!empty($error)): ?>
                            <div class="alert alert-danger py-2 small mb-3">
                                <i class="bi bi-exclamation-circle me-1"></i> <?= htmlspecialchars($error) ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST" action="">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Nomor Rekam Medis <span class="text-danger">*</span></label>
                                    <input type="text" name="no_rm" class="form-control font-monospace" value="<?= htmlspecialchars($pasien['no_rm']) ?>" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Nama Lengkap Pasien <span class="text-danger">*</span></label>
                                    <input type="text" name="nama" class="form-control" value="<?= htmlspecialchars($pasien['nama']) ?>" required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Tanggal Lahir <span class="text-danger">*</span></label>
                                    <input type="date" name="tanggal_lahir" class="form-control" value="<?= htmlspecialchars($pasien['tanggal_lahir']) ?>" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Jenis Kelamin <span class="text-danger">*</span></label>
                                    <div class="d-flex gap-4 mt-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="jenis_kelamin" id="jkL" value="L" <?= $pasien['jenis_kelamin'] === 'L' ? 'checked' : '' ?>>
                                            <label class="form-check-label" for="jkL">Laki-laki (L)</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="jenis_kelamin" id="jkP" value="P" <?= $pasien['jenis_kelamin'] === 'P' ? 'checked' : '' ?>>
                                            <label class="form-check-label" for="jkP">Perempuan (P)</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <label class="form-label small fw-semibold">Alamat Domisili <span class="text-danger">*</span></label>
                                    <textarea name="alamat" class="form-control" rows="2" required><?= htmlspecialchars($pasien['alamat']) ?></textarea>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Nomor Telepon / WhatsApp</label>
                                    <input type="text" name="no_telepon" class="form-control" value="<?= htmlspecialchars($pasien['no_telepon']) ?>">
                                </div>
                            </div>

                            <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <a href="index.php" class="btn btn-outline-secondary">Batal</a>
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
