<?php
/*
    Practical 9 - Secure User Registration
    This file handles the registration process by validating input,
    checking for duplicate users, hashing passwords, and inserting data into MySQL.
*/

require_once 'db_connect.php';

// Check POST request method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid Request Method. Please use POST.");
}

// Get data from the submitted form
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$mobile = trim($_POST["mobile"] ?? "");
$password = $_POST["password"] ?? "";
$confirm_password = $_POST["confirm-password"] ?? "";
$course = $_POST["course"] ?? "";
$year = trim($_POST["year"] ?? "");
$gender = $_POST["gender"] ?? "";
$terms = isset($_POST["terms"]);

// Server Side Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = "Please enter a valid name (min 2 characters).";
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

if (empty($mobile) || !preg_match("/^[6-9][0-9]{9}$/", $mobile)) {
    $errors[] = "Please enter a valid 10-digit mobile number.";
}

if (empty($password) || strlen($password) < 8) {
    $errors[] = "Password must be at least 8 characters long.";
}

if ($password !== $confirm_password) {
    $errors[] = "Passwords do not match.";
}

if (empty($course)) {
    $errors[] = "Please select a course.";
}

if (empty($year)) {
    $errors[] = "Please select your academic year.";
}

if (empty($gender)) {
    $errors[] = "Please select your gender.";
}

if (!$terms) {
    $errors[] = "You must accept the terms and conditions.";
}

// Check for duplicate email in database
if (empty($errors)) {
    try {
        $stmt = $pdo->prepare("SELECT student_id FROM students WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors[] = "This email is already registered. Please use a different one or login.";
        }
    } catch (PDOException $e) {
        $errors[] = "Database error occurred while checking email.";
    }
}

// Process Registration
if (count($errors) > 0) {
    echo "<h1>Registration Failed</h1>";
    echo "<ul>";
    foreach ($errors as $error) {
        echo "<li>" . htmlspecialchars($error) . "</li>";
    }
    echo "</ul>";
    echo '<a href="register.html">Go Back</a>';
} else {
    try {
        // Password Hashing
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Course ID Lookup (assuming courses table is populated)
        // For simplicity in this practical, we map the HTML value to a course_id
        // In a real app, you'd fetch this from the courses table.
        $course_map = [
            'btech' => 1,
            'mca'   => 2,
            'msc'   => 3
        ];
        $course_id = $course_map[$course] ?? null;

        // Database Insertion using Prepared Statements (Prevents SQL Injection)
        $sql = "INSERT INTO students (name, email, password, mobile, course_id, year, gender)
                VALUES (:name, :email, :password, :mobile, :course_id, :year, :gender)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name'      => $name,
            ':email'     => $email,
            ':password'  => $hashed_password,
            ':mobile'    => $mobile,
            ':course_id' => $course_id,
            ':year'      => $year,
            ':gender'    => $gender
        ]);

        echo "<h1>Registration Successful!</h1>";
        echo "<p>Your account has been created securely.</p>";
        echo '<a href="login.html">Login Now</a> | <a href="register.html">Register Another Student</a>';

    } catch (PDOException $e) {
        echo "<h1>Registration Error</h1>";
        echo "<p>An unexpected error occurred: " . htmlspecialchars($e->getMessage()) . "</p>";
        echo '<a href="register.html">Go Back</a>';
    }
}
?>
