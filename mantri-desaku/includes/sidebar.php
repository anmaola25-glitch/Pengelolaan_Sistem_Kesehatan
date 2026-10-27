<?php
// includes/sidebar.php
$current_page = $current_page ?? 'dashboard';
?>
<!-- Sidebar -->
<aside class="sidebar p-3 d-flex flex-column" id="sidebarNav">
    <!-- Brand / Identitas Klinik -->
    <div class="px-2 py-3 mb-3 border-bottom border-secondary border-opacity-25">
        <div class="d-flex align-items-center gap-2">
            <div class="bg-success-subtle text-success p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background-color: rgba(132, 169, 140, 0.2) !important; color: #84a98c !important;">
                <i class="bi bi-heart-pulse-fill fs-5"></i>
            </div>
            <div>
                <h6 class="mb-0 fw-bold text-white tracking-wide">Praktik Mantri Desaku</h6>
                <small class="text-white-50" style="font-size: 0.75rem;">Sistem Rekam Medis</small>
            </div>
        </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-grow-1">
        <div class="text-uppercase text-white-50 px-3 py-1 fw-bold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Menu Utama</div>
        
        <a href="../dashboard/index.php" class="nav-link-custom <?= $current_page === 'dashboard' ? 'active' : '' ?>">
            <i class="bi bi-grid-1x2"></i>
            <span>Dashboard</span>
        </a>

        <a href="../pasien/index.php" class="nav-link-custom <?= $current_page === 'pasien' ? 'active' : '' ?>">
            <i class="bi bi-people"></i>
            <span>Data Pasien</span>
        </a>

        <a href="../rekam_medis/index.php" class="nav-link-custom <?= $current_page === 'rekam_medis' ? 'active' : '' ?>">
            <i class="bi bi-journal-medical"></i>
            <span>Rekam Medis</span>
        </a>

        <a href="../riwayat/index.php" class="nav-link-custom <?= $current_page === 'riwayat' ? 'active' : '' ?>">
            <i class="bi bi-clock-history"></i>
            <span>Riwayat Kunjungan</span>
        </a>

        <a href="../laporan/index.php" class="nav-link-custom <?= $current_page === 'laporan' ? 'active' : '' ?>">
            <i class="bi bi-file-earmark-pdf"></i>
            <span>Laporan & PDF</span>
        </a>

        <div class="text-uppercase text-white-50 px-3 pt-3 pb-1 fw-bold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Sistem</div>

        <a href="../pengaturan/index.php" class="nav-link-custom <?= $current_page === 'pengaturan' ? 'active' : '' ?>">
            <i class="bi bi-gear"></i>
            <span>Pengaturan Akun</span>
        </a>
    </nav>

    <!-- User Info & Logout -->
    <div class="pt-3 border-top border-secondary border-opacity-25 mt-auto">
        <div class="px-2 py-2 d-flex align-items-center justify-content-between">
            <div class="overflow-hidden me-2">
                <div class="text-white fw-semibold small text-truncate"><?= htmlspecialchars($_SESSION['nama'] ?? 'Petugas') ?></div>
                <div class="text-white-50 text-truncate" style="font-size: 0.75rem;">@<?= htmlspecialchars($_SESSION['username'] ?? 'mantri') ?></div>
            </div>
            <a href="../auth/logout.php" class="btn btn-outline-danger btn-sm p-1 px-2" title="Keluar dari Sistem" onclick="return confirm('Apakah Anda yakin ingin logout?');">
                <i class="bi bi-box-arrow-right"></i>
            </a>
        </div>
    </div>
</aside>
