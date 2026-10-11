<?php
/*
    Practical 8 - View Students Database
    Provides a professional tabular display of all students and their courses.
*/
require_once 'db_connect.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Database Students</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .db-container {
            padding: 2rem;
            max-width: 1100px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
        }
        .db-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1.5rem;
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .db-table th, .db-table td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }
        .db-table th {
            background-color: #007bff;
            color: white;
            text-transform: uppercase;
            font-size: 0.9rem;
        }
        .db-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .db-table tr:hover {
            background-color: #f1f1f1;
        }
        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .btn-action {
            padding: 8px 15px;
            background: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="header-top">
            <a class="brand" href="index.html">
                <img src="assets/studenthub-logo.png" alt="StudentHub logo" width="56" height="56">
                <h1>StudentHub Portal</h1>
            </a>
        </div>
    </header>

    <main class="db-container">
        <div class="header-section">
            <h2>Database Student Directory</h2>
            <a href="db_insert.php" class="btn-action">+ Add New Student</a>
        </div>

        <?php
        try {
            // JOIN query to get student details and their course name
            $sql = "SELECT s.student_id, s.name, s.email, c.course_name
                    FROM students s
                    JOIN courses c ON s.course_id = c.course_id
                    ORDER BY s.student_id ASC";

            $stmt = $pdo->query($sql);
            $students = $stmt->fetchAll();

            if ($students) {
                echo '<table class="db-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>Enrolled Course</th>
                            </tr>
                        </thead>
                        <tbody>';

                foreach ($students as $student) {
                    echo '<tr>
                            <td>' . htmlspecialchars($student['student_id']) . '</td>
                            <td>' . htmlspecialchars($student['name']) . '</td>
                            <td>' . htmlspecialchars($student['email']) . '</td>
                            <td>' . htmlspecialchars($student['course_name']) . '</td>
                          </tr>';
                }
                echo '</tbody></table>';
            } else {
                echo '<p style="text-align: center; color: #666; margin-top: 2rem;">No students found in the database.</p>';
            }
        } catch (PDOException $e) {
            echo '<p style="color: red;">Database Error: ' . htmlspecialchars($e->getMessage()) . '</p>';
        }
        ?>
    </main>

    <footer style="text-align: center; padding: 2rem; color: #666;">
        <p>&copy; 2026 StudentHub Portal. All rights reserved.</p>
    </footer>
</body>
</html>
