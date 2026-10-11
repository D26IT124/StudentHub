<?php
/*
    Practical 8 - Database Select Operation
    Fetches and displays all students currently in the database.
*/
require_once 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT * FROM students");
    $students = $stmt->fetchAll();

    echo "<h1>Student List</h1>";
    if ($students) {
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course ID</th>
                    </tr>
                </thead>
                <tbody>";
        foreach ($students as $student) {
            echo "<tr>
                    <td>{$student['student_id']}</td>
                    <td>{$student['name']}</td>
                    <td>{$student['email']}</td>
                    <td>{$student['course_id']}</td>
                  </tr>";
        }
        echo "</tbody></table>";
    } else {
        echo "<p>No students found in the database.</p>";
    }
} catch (PDOException $e) {
    echo "Error fetching data: " . $e->getMessage();
}

echo "<br><a href='db_insert.php'>Add New Student</a>";
?>
