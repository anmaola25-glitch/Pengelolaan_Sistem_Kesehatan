<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

$id = (int)($_GET['id'] ?? 0);

if ($id > 0) {
    // Cek apakah pasien memiliki riwayat rekam medis
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM rekam_medis WHERE pasien_id = ?");
    $stmtCheck->execute([$id]);
    $recordsCount = $stmtCheck->fetchColumn();

    if ($recordsCount > 0) {
        header('Location: index.php?status=has_records');
        exit;
    }

    // Ambil info nama pasien untuk log audit
    $stmtInfo = $pdo->prepare("SELECT nama, no_rm FROM pasien WHERE id = ?");
    $stmtInfo->execute([$id]);
    $p = $stmtInfo->fetch();

    if ($p) {
        $stmtDelete = $pdo->prepare("DELETE FROM pasien WHERE id = ?");
        $stmtDelete->execute([$id]);

        log_audit($pdo, $_SESSION['user_id'], 'HAPUS_PASIEN', 'PASIEN', "Menghapus pasien {$p['nama']} ({$p['no_rm']})");
        header('Location: index.php?status=deleted');
        exit;
    }
}

header('Location: index.php');
exit;
