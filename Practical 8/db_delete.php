<?php
/*
    Practical 8 - Database Delete Operation
    Demonstrates how to remove a student record by ID.
*/
require_once 'db_connect.php';

// Delete data for student_id 10 (sample)
$id = 10;

try {
    $sql = "DELETE FROM students WHERE student_id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);

    echo "<h1>Delete Operation</h1>";
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Student ID $id has been successfully deleted.</p>";
    } else {
        echo "<p>Student ID $id not found or already deleted.</p>";
    }
} catch (PDOException $e) {
    echo "<h1>Delete Error</h1>";
    echo "<p style='color: red;'>❌ Error deleting data: " . $e->getMessage() . "</p>";
}

echo "<br><a href='db_select.php'>View All Students</a>";
?>
