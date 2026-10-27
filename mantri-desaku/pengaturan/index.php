<?php
$current_page = 'pengaturan';
$page_title = 'Pengaturan Akun';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

$userId = $_SESSION['user_id'];
$stmtUser = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmtUser->execute([$userId]);
$currentUser = $stmtUser->fetch();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        die('Token keamanan tidak valid.');
    }

    $old_pass = $_POST['old_password'] ?? '';
    $new_pass = $_POST['new_password'] ?? '';
    $confirm_pass = $_POST['confirm_password'] ?? '';

    if (empty($old_pass) || empty($new_pass) || empty($confirm_pass)) {
        $error = 'Semua kolom password wajib diisi.';
    } elseif (!password_verify($old_pass, $currentUser['password'])) {
        $error = 'Password lama yang Anda masukkan tidak sesuai.';
    } elseif (strlen($new_pass) < 6) {
        $error = 'Password baru minimal harus terdiri dari 6 karakter.';
    } elseif ($new_pass !== $confirm_pass) {
        $error = 'Konfirmasi password baru tidak cocok.';
    } else {
        $hashed = password_hash($new_pass, PASSWORD_BCRYPT);
        $stmtUpdate = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmtUpdate->execute([$hashed, $userId]);

        log_audit($pdo, $userId, 'GANTI_PASSWORD', 'PENGATURAN', 'Pengguna berhasil mengubah password akun.');
        $success = 'Password akun berhasil diperbarui! Silakan gunakan password baru pada sesi masuk berikutnya.';
    }
}

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Praktik Mantri Desaku</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Pengaturan Akun</span>
        </div>
        <a href="../auth/logout.php" class="btn btn-sm btn-outline-danger" onclick="return confirm('Apakah Anda yakin ingin keluar?');">
            <i class="bi bi-box-arrow-right me-1"></i> Logout
        </a>
    </header>

    <main class="p-4">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <!-- Info Akun Petugas -->
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-white py-3 border-bottom">
                        <h6 class="fw-bold mb-0 text-dark">Informasi Akun Petugas</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <div class="col-sm-6">
                                <label class="small text-muted mb-1">Nama Lengkap Petugas</label>
                                <div class="fw-bold text-dark"><?= htmlspecialchars($currentUser['nama']) ?></div>
                            </div>
                            <div class="col-sm-6">
                                <label class="small text-muted mb-1">Username Login</label>
                                <div class="font-monospace fw-semibold text-dark">@<?= htmlspecialchars($currentUser['username']) ?></div>
                            </div>
                            <div class="col-sm-6">
                                <label class="small text-muted mb-1">Peran / Kewenangan</label>
                                <div><span class="badge bg-success-subtle text-success-emphasis border"><?= strtoupper($currentUser['role']) ?></span></div>
                            </div>
                            <div class="col-sm-6">
                                <label class="small text-muted mb-1">Akun Terdaftar Sejak</label>
                                <div class="small text-muted"><?= date('d F Y', strtotime($currentUser['created_at'])) ?></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulir Ubah Password -->
                <div class="card border-0 shadow-sm rounded-3">
                    <div class="card-header bg-white py-3 border-bottom">
                        <h6 class="fw-bold mb-0 text-dark">Ubah Password Akun</h6>
                    </div>
                    <div class="card-body p-4">
                        <?php if (!empty($error)): ?>
                            <div class="alert alert-danger py-2 small mb-3">
                                <i class="bi bi-exclamation-circle me-1"></i> <?= htmlspecialchars($error) ?>
                            </div>
                        <?php endif; ?>

                        <?php if (!empty($success)): ?>
                            <div class="alert alert-success py-2 small mb-3">
                                <i class="bi bi-check-circle me-1"></i> <?= htmlspecialchars($success) ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST" action="">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">

                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Password Saat Ini (Lama) <span class="text-danger">*</span></label>
                                <input type="password" name="old_password" class="form-control" placeholder="Masukkan password lama" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Password Baru <span class="text-danger">*</span></label>
                                <input type="password" name="new_password" class="form-control" placeholder="Minimal 6 karakter" required>
                                <small class="text-muted" style="font-size: 0.72rem;">Gunakan kombinasi huruf dan angka untuk keamanan data medis.</small>
                            </div>

                            <div class="mb-4">
                                <label class="form-label small fw-semibold">Ulangi Password Baru <span class="text-danger">*</span></label>
                                <input type="password" name="confirm_password" class="form-control" placeholder="Ketik ulang password baru" required>
                            </div>

                            <div class="d-flex justify-content-end">
                                <button type="submit" class="btn btn-sage px-4">
                                    <i class="bi bi-shield-lock me-1"></i> Simpan Password Baru
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
