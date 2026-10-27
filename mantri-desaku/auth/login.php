<?php
session_start();
require_once '../config/database.php';

if (isset($_SESSION['user_id'])) {
    header('Location: ../dashboard/index.php');
    exit;
}

$error = '';
$username_val = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username_val = trim($_POST['username'] ?? '');
    $password_val = trim($_POST['password'] ?? '');

    if (empty($username_val) || empty($password_val)) {
        $error = 'Silakan isi username dan password Anda.';
    } else {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
        $stmt->execute([$username_val]);
        $user = $stmt->fetch();

        if ($user && password_verify($password_val, $user['password'])) {
            // Login sukses
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['nama'] = $user['nama'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

            log_audit($pdo, $user['id'], 'LOGIN_BERHASIL', 'AUTH', 'Login berhasil dari IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'));

            header('Location: ../dashboard/index.php');
            exit;
        } else {
            $error = 'Username atau password yang Anda masukkan salah.';
            log_audit($pdo, null, 'LOGIN_GAGAL', 'AUTH', "Upaya login gagal dengan username: {$username_val}");
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Praktik Mantri Desaku</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        :root {
            --sage-primary: #2d5a4c;
            --sage-light: #52796f;
            --sage-bg: #f4f7f5;
        }
        body {
            background-color: var(--sage-bg);
            font-family: system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 420px;
            padding: 32px;
        }
        .btn-sage {
            background-color: var(--sage-primary);
            color: #ffffff;
            border: none;
            padding: 10px 16px;
            font-weight: 500;
        }
        .btn-sage:hover {
            background-color: #214338;
            color: #ffffff;
        }
    </style>
</head>
<body>
<div class="login-card">
    <div class="text-center mb-4">
        <div class="d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-3 mb-2" style="color: var(--sage-primary);">
            <i class="bi bi-hospital fs-1"></i>
        </div>
        <h4 class="fw-bold mb-1" style="color: var(--sage-primary);">Praktik Mantri Desaku</h4>
        <p class="text-muted small">Sistem Informasi Pengelolaan Rekam Medis</p>
    </div>

    <?php if (!empty($error)): ?>
        <div class="alert alert-danger d-flex align-items-center py-2 px-3 small" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <div><?= htmlspecialchars($error) ?></div>
        </div>
    <?php endif; ?>

    <form method="POST" action="">
        <div class="mb-3">
            <label class="form-label small fw-semibold">Username</label>
            <div class="input-group">
                <span class="input-group-text bg-white"><i class="bi bi-person text-muted"></i></span>
                <input type="text" name="username" class="form-control" placeholder="Masukkan username" value="<?= htmlspecialchars($username_val) ?>" required autofocus>
            </div>
        </div>

        <div class="mb-4">
            <label class="form-label small fw-semibold">Password</label>
            <div class="input-group">
                <span class="input-group-text bg-white"><i class="bi bi-shield-lock text-muted"></i></span>
                <input type="password" id="passwordInput" name="password" class="form-control" placeholder="Masukkan password" required>
                <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                    <i class="bi bi-eye" id="toggleIcon"></i>
                </button>
            </div>
        </div>

        <button type="submit" class="btn btn-sage w-100 rounded-3 mb-3">
            <i class="bi bi-box-arrow-in-right me-1"></i> Masuk ke Sistem
        </button>
    </form>

    <div class="border-top pt-3 text-center text-muted small">
        <p class="mb-1"><strong>Akun Pengujian Default:</strong></p>
        <span class="badge bg-secondary-subtle text-secondary-emphasis">User: mantri</span>
        <span class="badge bg-secondary-subtle text-secondary-emphasis">Pass: admin123</span>
    </div>
</div>

<script>
    const toggleBtn = document.getElementById('togglePassword');
    const passInput = document.getElementById('passwordInput');
    const toggleIcon = document.getElementById('toggleIcon');

    toggleBtn.addEventListener('click', function () {
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        toggleIcon.classList.toggle('bi-eye');
        toggleIcon.classList.toggle('bi-eye-slash');
    });
</script>
</body>
</html>
