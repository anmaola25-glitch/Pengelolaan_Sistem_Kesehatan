<?php
$current_page = 'rekam_medis';
$page_title = 'Detail Rekam Medis';
require_once '../config/database.php';
require_once '../includes/auth_check.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("
    SELECT rm.*, p.nama AS nama_pasien, p.no_rm, p.jenis_kelamin, p.tanggal_lahir, p.alamat, p.no_telepon, u.nama AS petugas_nama
    FROM rekam_medis rm
    JOIN pasien p ON rm.pasien_id = p.id
    JOIN users u ON rm.user_id = u.id
    WHERE rm.id = ?
");
$stmt->execute([$id]);
$record = $stmt->fetch();

if (!$record) {
    header('Location: index.php');
    exit;
}

// Hitung umur pasien saat kunjungan
$birthDate = new DateTime($record['tanggal_lahir']);
$visitDate = new DateTime($record['tanggal_kunjungan']);
$umur = $birthDate->diff($visitDate)->y;

require_once '../includes/header.php';
require_once '../includes/sidebar.php';
?>

<div class="main-wrapper flex-grow-1">
    <header class="top-navbar">
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Rekam Medis</span>
            <span class="text-muted">/</span>
            <span class="fw-semibold text-dark">Detail Pemeriksaan</span>
        </div>
        <div class="d-flex gap-2">
            <a href="edit.php?id=<?= $record['id'] ?>" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-pencil me-1"></i> Edit Catatan
            </a>
            <a href="index.php" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-arrow-left me-1"></i> Kembali
            </a>
        </div>
    </header>

    <main class="p-4">
        <?php if (isset($_GET['status']) && $_GET['status'] === 'created'): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle me-1"></i> Rekam medis berhasil disimpan ke sistem!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <!-- Header Kartu Rekam Medis -->
            <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <div>
                    <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle mb-1">
                        No. RM: <?= htmlspecialchars($record['no_rm']) ?>
                    </span>
                    <h5 class="fw-bold mb-0 text-dark"><?= htmlspecialchars($record['nama_pasien']) ?></h5>
                    <small class="text-muted">
                        <?= $record['jenis_kelamin'] === 'L' ? 'Laki-laki' : 'Perempuan' ?> · Umur saat ini: <?= $umur ?> tahun · Telp: <?= htmlspecialchars($record['no_telepon'] ?: '-') ?>
                    </small>
                </div>
                <div class="text-end">
                    <span class="badge bg-light text-dark border px-3 py-2">
                        <i class="bi bi-calendar-event me-1 text-primary"></i> <?= date('d F Y, H:i', strtotime($record['tanggal_kunjungan'])) ?> WIB
                    </span>
                </div>
            </div>

            <!-- Isi Rekam Medis -->
            <div class="card-body p-4">
                <div class="row g-4">
                    <div class="col-md-6">
                        <h6 class="fw-bold text-success mb-2"><i class="bi bi-chat-left-dots me-1"></i> Keluhan Pasien</h6>
                        <div class="p-3 bg-light rounded-3 mb-3">
                            <div class="small fw-semibold text-muted mb-1">Keluhan Utama:</div>
                            <div class="text-dark"><?= nl2br(htmlspecialchars($record['keluhan'])) ?></div>
                            
                            <?php if (!empty($record['riwayat_keluhan'])): ?>
                                <div class="small fw-semibold text-muted mt-3 mb-1">Riwayat Keluhan / Penyakit Terdahulu:</div>
                                <div class="text-dark"><?= nl2br(htmlspecialchars($record['riwayat_keluhan'])) ?></div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <h6 class="fw-bold text-success mb-2"><i class="bi bi-activity me-1"></i> Hasil Pemeriksaan Fisik & TTV</h6>
                        <div class="p-3 bg-light rounded-3 mb-3">
                            <div class="text-dark font-monospace small">
                                <?= nl2br(htmlspecialchars($record['hasil_pemeriksaan'])) ?>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="p-3 border rounded-3 bg-white">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <div class="small fw-semibold text-muted text-uppercase" style="font-size: 0.72rem;">Diagnosis Klinis Nakes</div>
                                    <div class="fw-bold fs-6 text-dark mt-1"><?= htmlspecialchars($record['diagnosis']) ?></div>
                                </div>
                                <div class="col-md-4">
                                    <div class="small fw-semibold text-muted text-uppercase" style="font-size: 0.72rem;">Tindakan Medis yang Dilakukan</div>
                                    <div class="text-dark mt-1"><?= nl2br(htmlspecialchars($record['tindakan'])) ?></div>
                                </div>
                                <div class="col-md-4">
                                    <div class="small fw-semibold text-muted text-uppercase" style="font-size: 0.72rem;">Pengobatan & Terapi Obat</div>
                                    <div class="text-dark mt-1"><?= nl2br(htmlspecialchars($record['pengobatan'] ?: 'Tidak ada resep obat sistemik.')) ?></div>
                                </div>
                            </div>

                            <?php if (!empty($record['catatan_tambahan'])): ?>
                                <div class="mt-3 pt-3 border-top">
                                    <div class="small fw-semibold text-muted text-uppercase" style="font-size: 0.72rem;">Catatan Tambahan / Edukasi</div>
                                    <div class="text-dark small mt-1"><?= htmlspecialchars($record['catatan_tambahan']) ?></div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <!-- Footer Informasi Petugas -->
                <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
                    <div>
                        <span>Alamat Pasien: <?= htmlspecialchars($record['alamat']) ?></span>
                    </div>
                    <div>
                        <span>Tenaga Kesehatan Pemeriksa: <strong><?= htmlspecialchars($record['petugas_nama']) ?></strong></span>
                    </div>
                </div>
            </div>
        </div>
    </main>
<?php require_once '../includes/footer.php'; ?>
