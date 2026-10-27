<?php
/**
 * Konfigurasi Database MySQL Praktik Mantri Desaku
 * Menggunakan PDO (PHP Data Objects) dengan Prepared Statements
 */

$db_host = '127.0.0.1';
$db_port = '3306';
$db_name = 'mantri_desaku';
$db_user = 'root';
$db_pass = ''; // Default password XAMPP kosong

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    // Error aman tanpa membocorkan credential
    die("<div style='font-family:sans-serif;padding:20px;margin:20px;border:1px solid #f87171;background:#fef2f2;color:#991b1b;border-radius:8px;'>
            <h3 style='margin-top:0;'>Gagal Terhubung ke Database MySQL!</h3>
            <p>Pastikan modul <strong>MySQL di XAMPP Control Panel</strong> sudah berstatus <em>Running</em> dan database <strong>mantri_desaku</strong> telah diimport melalui phpMyAdmin.</p>
            <p><small>Pesan teknis: " . htmlspecialchars($e->getMessage()) . "</small></p>
         </div>");
}

/**
 * Helper Keamanan: Log Audit Aktivitas
 */
function log_audit($pdo, $user_id, $aksi, $modul, $rincian) {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO audit_log (user_id, aksi, modul, rincian, ip_address, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$user_id, $aksi, $modul, $rincian, $ip]);
    } catch (Exception $e) {
        // Silent error on audit log failure
    }
}
