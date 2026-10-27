<?php
$current_page = 'rekam_medis';
$page_title = 'Catat Rekam Medis Baru';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

// Ambil semua pasien terdaftar untuk dropdown
$stmtPasien = $pdo->query("SELECT id, no_rm, nama, jenis_kelamin, tanggal_lahir, alamat FROM pasien ORDER BY nama ASC");
$allPasien = $stmtPasien->fetchAll();

$selected_pasien_id = (int)($_GET['pasien_id'] ?? 0);
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        die('Token keamanan tidak valid.');
    }

    $pasien_id = (int)($_POST['pasien_id'] ?? 0);
    $tanggal_kunjungan = trim($_POST['tanggal_kunjungan'] ?? date('Y-m-d H:i:s'));
    $keluhan = trim($_POST['keluhan'] ?? '');
    $riwayat_keluhan = trim($_POST['riwayat_keluhan'] ?? '');
    
    // Tanda Vital
    $td = trim($_POST['tekanan_darah'] ?? '');
    $bb = trim($_POST['berat_badan'] ?? '');
    $suhu = trim($_POST['suhu_tubuh'] ?? '');
    $nadi = trim($_POST['nadi'] ?? '');
    $rr = trim($_POST['respirasi'] ?? '');
    $hasil_lain = trim($_POST['hasil_pemeriksaan_lain'] ?? '');

    $hasil_pemeriksaan = "TD: {$td} mmHg, BB: {$bb} kg, Suhu: {$suhu} C, Nadi: {$nadi} x/mnt, RR: {$rr} x/mnt. {$hasil_lain}";

    $diagnosis = trim($_POST['diagnosis'] ?? '');
    $tindakan = trim($_POST['tindakan'] ?? '');
    $pengobatan = trim($_POST['pengobatan'] ?? '');
    $catatan_tambahan = trim($_POST['catatan_tambahan'] ?? '');

    if (empty($pasien_id) || empty($keluhan) || empty($diagnosis) || empty($tindakan)) {
        $error = 'Harap pilih pasien, dan isi Keluhan Utama, Diagnosis, serta Tindakan yang dilakukan.';
    } else {
        $stmtInsert = $pdo->prepare("
            INSERT INTO rekam_medis 
            (pasien_id, user_id, tanggal_kunjungan, keluhan, riwayat_keluhan, hasil_pemeriksaan, diagnosis, tindakan, pengobatan, catatan_tambahan, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmtInsert->execute([
            $pasien_id,
            $_SESSION['user_id'],
            $tanggal_kunjungan,
            $keluhan,
            $riwayat_keluhan,
            $hasil_pemeriksaan,
            $diagnosis,
            $tindakan,
            $pengobatan,
            $catatan_tambahan
        ]);

        $newRMId = $pdo->lastInsertId();

        // Ambil nama pasien untuk audit log
        $stmtP = $pdo->prepare("SELECT nama, no_rm FROM pasien WHERE id = ?");
        $stmtP->execute([$pasien_id]);
        $pInfo = $stmtP->fetch();

        log_audit($pdo, $_SESSION['user_id'], 'CATAT_REKAM_MEDIS', 'REKAM_MEDIS', "Mencatat rekam medis kunjungan pasien {$pInfo['nama']} ({$pInfo['no_rm']})");

        header("Location: detail.php?id={$newRMId}&status=created");
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
            <span class="fw-semibold text-dark">Catat Rekam Medis Baru</span>
        </div>
        <a href="index.php" class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Kembali ke Rekam Medis
        </a>
    </header>

    <main class="p-4">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card border-0 shadow-sm rounded-3">
                    <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="fw-bold mb-0 text-dark">Formulir Pencatatan Rekam Medis & Pemeriksaan</h6>
                            <small class="text-muted">Dokumentasikan temuan pemeriksaan klinis secara teliti dan akurat</small>
                        </div>
                        <span class="badge bg-light text-dark border">
                            Petugas: <?= htmlspecialchars($_SESSION['nama']) ?>
                        </span>
                    </div>
                    <div class="card-body p-4">
                        <?php if (!empty($error)): ?>
                            <div class="alert alert-danger py-2 small mb-3">
                                <i class="bi bi-exclamation-circle me-1"></i> <?= htmlspecialchars($error) ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST" action="">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">

                            <!-- Bagian 1: Identitas Kunjungan & Pasien -->
                            <h6 class="fw-bold text-success mb-3 pb-2 border-bottom">1. Identitas Kunjungan & Pasien</h6>
                            <div class="row g-3 mb-4">
                                <div class="col-md-7">
                                    <label class="form-label small fw-semibold">Pilih Pasien Terdaftar <span class="text-danger">*</span></label>
                                    <select name="pasien_id" class="form-select" required>
                                        <option value="">-- Pilih Nama Pasien atau No. RM --</option>
                                        <?php foreach ($allPasien as $p): ?>
                                            <option value="<?= $p['id'] ?>" <?= $selected_pasien_id === $p['id'] ? 'selected' : '' ?>>
                                                <?= htmlspecialchars($p['no_rm']) ?> - <?= htmlspecialchars($p['nama']) ?> (<?= $p['jenis_kelamin'] ?>, <?= htmlspecialchars($p['alamat']) ?>)
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <small class="text-muted" style="font-size: 0.72rem;">Pasien baru belum ada di list? <a href="../pasien/tambah.php" class="text-success text-decoration-none">Daftarkan di Menu Pasien</a> terlebih dahulu.</small>
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label small fw-semibold">Tanggal & Waktu Pemeriksaan <span class="text-danger">*</span></label>
                                    <input type="datetime-local" name="tanggal_kunjungan" class="form-control" value="<?= date('Y-m-d\TH:i') ?>" required>
                                </div>
                            </div>

                            <!-- Bagian 2: Anamnesis -->
                            <h6 class="fw-bold text-success mb-3 pb-2 border-bottom">2. Anamnesis & Keluhan</h6>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Keluhan Utama <span class="text-danger">*</span></label>
                                    <textarea name="keluhan" class="form-control" rows="3" placeholder="Keluhan utama yang dirasakan pasien saat datang..." required></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Riwayat Penyakit / Keluhan Relevan</label>
                                    <textarea name="riwayat_keluhan" class="form-control" rows="3" placeholder="Riwayat alergi obat, riwayat darah tinggi/kencing manis, lama sakit..."></textarea>
                                </div>
                            </div>

                            <!-- Bagian 3: Tanda-Tanda Vital & Pemeriksaan Fisik -->
                            <h6 class="fw-bold text-success mb-3 pb-2 border-bottom">3. Tanda-Tanda Vital & Hasil Pemeriksaan Fisik</h6>
                            <div class="row g-3 mb-3">
                                <div class="col-sm-6 col-md-3">
                                    <label class="form-label small fw-semibold">Tekanan Darah (TD)</label>
                                    <div class="input-group">
                                        <input type="text" name="tekanan_darah" class="form-control" placeholder="120/80">
                                        <span class="input-group-text small">mmHg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-3">
                                    <label class="form-label small fw-semibold">Berat Badan (BB)</label>
                                    <div class="input-group">
                                        <input type="text" name="berat_badan" class="form-control" placeholder="60">
                                        <span class="input-group-text small">kg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <label class="form-label small fw-semibold">Suhu Tubuh</label>
                                    <div class="input-group">
                                        <input type="text" name="suhu_tubuh" class="form-control" placeholder="36.5">
                                        <span class="input-group-text small">°C</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <label class="form-label small fw-semibold">Denyut Nadi</label>
                                    <div class="input-group">
                                        <input type="text" name="nadi" class="form-control" placeholder="80">
                                        <span class="input-group-text small">x/m</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <label class="form-label small fw-semibold">Laju Nafas (RR)</label>
                                    <div class="input-group">
                                        <input type="text" name="respirasi" class="form-control" placeholder="18">
                                        <span class="input-group-text small">x/m</span>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-semibold">Temuan Fisik Khusus / Keterangan Lain</label>
                                    <input type="text" name="hasil_pemeriksaan_lain" class="form-control" placeholder="Contoh: Faring hiperemis, luka vulnus lecet di lutut, tidak ada ronki/wheezing.">
                                </div>
                            </div>

                            <!-- Bagian 4: Diagnosis, Tindakan, Pengobatan -->
                            <h6 class="fw-bold text-success mb-3 pb-2 border-bottom">4. Diagnosis, Tindakan Medis & Terapi</h6>
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <label class="form-label small fw-semibold">Diagnosis / Temuan Klinis Nakes <span class="text-danger">*</span></label>
                                    <input type="text" name="diagnosis" class="form-control" placeholder="Diagnosis klinis berdasarkan hasil pemeriksaan nakes..." required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Tindakan Medis yang Dilakukan <span class="text-danger">*</span></label>
                                    <textarea name="tindakan" class="form-control" rows="3" placeholder="Pemeriksaan TTV, perawatan luka steril, nebulizer, kompres hangat, edukasi gizi..." required></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Pengobatan / Resep yang Diberikan</label>
                                    <textarea name="pengobatan" class="form-control" rows="3" placeholder="Nama obat, dosis, aturan minum (Contoh: Paracetamol 500mg 3x1 pc)..."></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-semibold">Catatan Tambahan / Jadwal Kontrol</label>
                                    <input type="text" name="catatan_tambahan" class="form-control" placeholder="Contoh: Kontrol 3 hari jika demam menetap, kurangi konsumsi garam...">
                                </div>
                            </div>

                            <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                                <a href="index.php" class="btn btn-outline-secondary">Batal</a>
                                <button type="submit" class="btn btn-sage px-4">
                                    <i class="bi bi-save me-1"></i> Simpan Rekam Medis
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
