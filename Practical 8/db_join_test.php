<?php
/*
    Practical 8 - Database Join Test
    Demonstrates a JOIN query to show which students are enrolled in which courses.
*/
require_once 'db_connect.php';

try {
    // Query to get Course ID, Course Name, and Student Name
    // LEFT JOIN ensures courses are listed even if no students are enrolled.
    $sql = "SELECT c.course_id, c.course_name, s.name AS student_name
            FROM courses c
            LEFT JOIN students s ON c.course_id = s.course_id
            ORDER BY c.course_id ASC";

    $stmt = $pdo->query($sql);
    $results = $stmt->fetchAll();

    echo "<h1 style='font-family: Arial, sans-serif;'>Course Enrollment Report</h1>";

    if ($results) {
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 60%; font-family: Arial, sans-serif;'>
                <thead style='background-color: #f2f2f2;'>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Student Name</th>
                    </tr>
                </thead>
                <tbody>";

        foreach ($results as $row) {
            $studentName = $row['student_name'] ?? '<em>No students enrolled</em>';
            echo "<tr>
                    <td>{$row['course_id']}</td>
                    <td>{$row['course_name']}</td>
                    <td>{$studentName}</td>
                  </tr>";
        }
        echo "</tbody></table>";
    } else {
        echo "<p>No data available.</p>";
    }
} catch (PDOException $e) {
    echo "Error executing join query: " . $e->getMessage();
}

echo "<br><a href='view_students_db.php'>View Formatted Students Table</a>";
?>
