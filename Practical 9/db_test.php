<?php
/*
    Practical 8 - Database Connectivity Test
    Verifies if the connection to the StudentHub database is successful.
*/
require_once 'db_connect.php';

echo "<h1>Database Connection Test</h1>";
if (isset($pdo)) {
    echo "<p style='color: green; font-weight: bold;'>✅ Connection Successful! The PHP application can communicate with the MySQL database.</p>";
} else {
    echo "<p style='color: red; font-weight: bold;'>❌ Connection Failed!</p>";
}
?>
