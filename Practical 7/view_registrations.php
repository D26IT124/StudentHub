<?php
/*  Practical 7 - View Registrations
    This file fetches student registration data from registrations.csv
    and displays it in a tabular format.
*/

$filename = "registrations.csv";

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>StudentHub - Registered Students</title>
    <link rel='stylesheet' href='css/style.css'>
    <style>
        .view-container { padding: 20px; max-width: 1000px; margin: 0 auto; }
        .registration-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .registration-table th, .registration-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .registration-table th { background-color: #f4f4f4; }
        .btn-back { display: inline-block; margin-bottom: 20px; padding: 10px 15px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class='view-container'>
        <h1>Registered Students</h1>
        <a href='register.html' class='btn-back'>Back to Registration</a>
EOF";

if (!file_exists($filename) || filesize($filename) == 0) {
    echo "<p>No registrations found.</p>";
} else {
    $file = fopen($filename, "r");
    if ($file) {
        echo "<table class='registration-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>Gender</th>
                    </tr>
                </thead>
                <tbody>";

        while (($data = fgetcsv($file)) !== FALSE) {
            // CSV Format: name, email, mobile, hashed_password, course, year, gender
            // We skip index 3 (hashed_password) for security.
            echo "<tr>";
            echo "<td>" . htmlspecialchars($data[0] ?? '') . "</td>";
            echo "<td>" . htmlspecialchars($data[1] ?? '') . "</td>";
            echo "<td>" . htmlspecialchars($data[2] ?? '') . "</td>";
            echo "<td>" . htmlspecialchars($data[4] ?? '') . "</td>";
            echo "<td>" . htmlspecialchars($data[5] ?? '') . "</td>";
            echo "<td>" . htmlspecialchars($data[6] ?? '') . "</td>";
            echo "</tr>";
        }

        echo "</tbody></table>";
        fclose($file);
    } else {
        echo "<p>Error opening the registrations file.</p>";
    }
}

echo "</div>
</body>
</html>";
?>
EOF`
