<?php
/*  Practical 7 - PHP Registration Form Processing
    This file validates the data obtained after the registration form is submitted.
    It validates independently from JavaScript validation and validates each field separately.
    The registered data gets stored in the registrations.csv file.
*/

// Check POST request method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid Request Method. Please use POST.");
}

// Get data from the submitted form
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$mobile_number = trim($_POST["mobile"] ?? "");
$password = $_POST["password"] ?? "";
$confirm_password = $_POST["confirm-password"] ?? "";
$course = $_POST["course"] ?? "";
$year = trim($_POST["year"] ?? "");
$gender = $_POST["gender"] ?? "";
$terms = isset($_POST["terms"]);

// Server Side Independent Validation
$errors = [];

// Name Validation: Required, letters and spaces only, min 2 chars
if (empty($name)) {
    $errors[] = "Name is a required field.";
} else if (strlen($name) < 2) {
    $errors[] = "Name must be at least 2 characters long.";
} else if (!preg_match("/^[A-Za-z ]+$/", $name)) {
    $errors[] = "Name must contain only alphabets and spaces.";
}

// Email Validation
if (empty($email)) {
    $errors[] = "Email is a required field.";
} else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

// Mobile Number Validation: 10 digits starting with 6,7,8 or 9
if (empty($mobile_number)) {
    $errors[] = "Mobile Number is a required field.";
} else if (!preg_match("/^[6-9][0-9]{9}$/", $mobile_number)) {
    $errors[] = "Please enter a valid 10-digit mobile number which starts from 6, 7, 8 or 9.";
}

// Password Validation
if (empty($password)) {
    $errors[] = "Password is a required field.";
} else {
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters long.";
    }
    if (!preg_match("/[A-Z]/", $password)) {
        $errors[] = "Password must contain at least one uppercase letter.";
    }
    if (!preg_match("/[a-z]/", $password)) {
        $errors[] = "Password must contain at least one lowercase letter.";
    }
    if (!preg_match("/[0-9]/", $password)) {
        $errors[] = "Password must contain at least one number.";
    }
    if (!preg_match("/[!@#$%^&*(),.?\":{}|<>]/", $password)) {
        $errors[] = "Password must contain at least one special character.";
    }
}

// Confirm Password Validation
if (empty($confirm_password)) {
    $errors[] = "Confirm Password is a required field.";
} else if ($password !== $confirm_password) {
    $errors[] = "Password and Confirm Password must match each other.";
}

// Course Validation
if (empty($course)) {
    $errors[] = "Please select a course.";
}

// Academic Year Validation
if (empty($year)) {
    $errors[] = "Please select your academic year.";
}

// Gender Validation
if (empty($gender)) {
    $errors[] = "Please select your gender.";
}

// Terms and Conditions Validation
if (!$terms) {
    $errors[] = "Please accept the terms and conditions.";
}

// Displaying Errors
if (count($errors) > 0) {
    echo "<h1>Registration Failed</h1>";
    echo "<ul>";
    foreach ($errors as $error) {
        echo "<li>" . htmlspecialchars($error) . "</li>";
    }
    echo "</ul>";
    echo '<a href="register.html">Go Back</a>';
} else {
    // Successful Submission Processing
    
    // Sanitization
    $s_name = htmlspecialchars($name);
    $s_email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $s_mobile = htmlspecialchars($mobile_number);
    $s_course = htmlspecialchars($course);
    $s_year = htmlspecialchars($year);
    $s_gender = htmlspecialchars($gender);
    
    // Password Hashing
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Data to be stored
    $data = [$s_name, $s_email, $s_mobile, $hashed_password, $s_course, $s_year, $s_gender];
    
    // CSV Storage
    $file = fopen("registrations.csv", "a");
    if ($file === false) {
        die("Error opening the file for writing.");
    }
    
    if (fputcsv($file, $data)) {
        fclose($file);
        echo "<h1>Registration Successful!</h1>";
        echo "<p>Your data has been saved successfully.</p>";
        echo '<a href="view_registrations.php">View All Registrations</a> | <a href="register.html">Register Another Student</a>';
    } else {
        fclose($file);
        echo "<h1>Registration Failed</h1>";
        echo "<p>An error occurred while saving your data.</p>";
    }
}
?>
EOF`
