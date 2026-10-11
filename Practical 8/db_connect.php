<?php
/*
    Practical 8 - Database Connection Utility
    This file provides a reusable PDO connection to the StudentHub database.
*/

// Database configuration
$host     = 'localhost';
$dbname   = 'studenthub_db';
$username = 'root';      // Default XAMPP/WAMP username
$password = '';          // Default XAMPP/WAMP password (empty)

try {
    // Create a PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);

    // Set error mode to exception to catch any database errors
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Set default fetch mode to associative array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // In a production environment, you would log this error instead of echoing it
    die("Database Connection Failed: " . $e->getMessage());
}
?>
