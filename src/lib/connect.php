<?php
require_once("../config/config.php");

try {
    $pdo = new PDO(dsn, user, password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    echo $e->getMessage();
}