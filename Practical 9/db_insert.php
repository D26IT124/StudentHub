<?php
/*
    Practical 8 - Database Insert Operation
    Demonstrates how to insert a new student record using prepared statements.
*/
require_once 'db_connect.php';

// Test data for insertion
$name = "Rahul Verma";
$email = "rahul.verma" . time() . "@example.com"; // Unique email for each test
$course_id = 1; // Assuming course_id 1 exists (B.Tech IT)

try {
    $sql = "INSERT INTO students (name, email, course_id) VALUES (:name, :email, :course_id)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':course_id' => $course_id
    ]);

    echo "<h1>Insert Operation</h1>";
    echo "<p style='color: green;'>✅ Student <strong>$name</strong> has been successfully added to the database.</p>";
    echo "<p>New Student ID: " . $pdo->lastInsertId() . "</p>";
} catch (PDOException $e) {
    echo "<h1>Insert Error</h1>";
    echo "<p style='color: red;'>❌ Error inserting data: " . $e->getMessage() . "</p>";
}

echo "<br><a href='db_select.php'>View All Students</a>";
?>
