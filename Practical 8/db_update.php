<?php
/*
    Practical 8 - Database Update Operation
    Demonstrates how to update an existing student's details.
*/
require_once 'db_connect.php';

// Update data for student_id 1
$id = 1;
$newName = "Aarav Sharma Updated";
$newEmail = "aarav.updated@example.com";
$newCourseId = 2;

try {
    $sql = "UPDATE students SET name = :name, email = :email, course_id = :course_id WHERE student_id = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':name' => $newName,
        ':email' => $newEmail,
        ':course_id' => $newCourseId,
        ':id' => $id
    ]);

    echo "<h1>Update Operation</h1>";
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Student ID $id has been successfully updated.</p>";
    } else {
        echo "<p>No changes were made or student ID $id not found.</p>";
    }
} catch (PDOException $e) {
    echo "<h1>Update Error</h1>";
    echo "<p style='color: red;'>❌ Error updating data: " . $e->getMessage() . "</p>";
}

echo "<br><a href='db_select.php'>View All Students</a>";
?>
