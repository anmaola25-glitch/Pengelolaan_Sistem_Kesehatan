<?php
// includes/header.php
if (!defined('APP_INIT')) {
    define('APP_INIT', true);
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($page_title) ? htmlspecialchars($page_title) . ' - ' : '' ?>Praktik Mantri Desaku</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        :root {
            --sage-dark: #1b3a32;
            --sage-primary: #2d5a4c;
            --sage-medium: #52796f;
            --sage-light: #84a98c;
            --sage-bg: #f8faf9;
            --sidebar-width: 260px;
        }
        body {
            background-color: var(--sage-bg);
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            color: #1e293b;
        }
        .sidebar {
            width: var(--sidebar-width);
            min-height: 100vh;
            background-color: var(--sage-dark);
            color: #ecfdf5;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            transition: all 0.3s;
        }
        .main-wrapper {
            margin-left: var(--sidebar-width);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .top-navbar {
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            height: 64px;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 999;
        }
        .nav-link-custom {
            color: #cbd5e1;
            padding: 10px 18px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            font-size: 0.92rem;
            margin-bottom: 4px;
            transition: all 0.2s;
        }
        .nav-link-custom:hover {
            color: #ffffff;
            background-color: rgba(255, 255, 255, 0.08);
        }
        .nav-link-custom.active {
            color: #ffffff;
            background-color: var(--sage-primary);
            font-weight: 600;
        }
        .card-stat {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .card-stat:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }
        .btn-sage {
            background-color: var(--sage-primary);
            color: #ffffff;
            border: none;
        }
        .btn-sage:hover {
            background-color: #214338;
            color: #ffffff;
        }
        .tabular-nums {
            font-variant-numeric: tabular-nums;
        }
        @media (max-width: 992px) {
            .sidebar {
                margin-left: calc(-1 * var(--sidebar-width));
            }
            .sidebar.show {
                margin-left: 0;
            }
            .main-wrapper {
                margin-left: 0;
            }
        }
    </style>
</head>
<body>
<div class="d-flex">
