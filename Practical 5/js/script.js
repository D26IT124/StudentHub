/*
  Practical 5 - StudentHub registration validation
  This file validates user input on blur, while typing, and when the form is
  submitted. It never sends data to a server; successful submission is only a
  frontend demonstration for this practical.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Cache form controls once so validation functions can reuse them efficiently.
  const form = document.getElementById('registration-form');
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    mobile: document.getElementById('mobile'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirm-password'),
    course: document.getElementById('course'),
    year: document.getElementById('year'),
    terms: document.getElementById('terms')
  };
  const strengthBar = document.getElementById('strength-bar');
  const strengthText = document.getElementById('password-strength');
  const formStatus = document.getElementById('form-status');

  // Reusable regular expressions for the assignment's name, email, and mobile rules.
  const patterns = {
    name: /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    mobile: /^(?:\+91[\s-]?)?[6-9]\d{9}$/
  };

  // Places an accessible error message beside a field and marks it invalid.
  function showError(field, message) {
    const error = document.getElementById(`${field.id}-error`);
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('is-invalid');
  }

  // Clears the field-level message after the control meets its validation rule.
  function clearError(field) {
    const error = document.getElementById(`${field.id}-error`);
    if (error) error.textContent = '';
    field.removeAttribute('aria-invalid');
    field.classList.remove('is-invalid');
  }

  // Calculates a 0-4 password score and returns its human-readable label.
  function getPasswordStrength(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return { score, label: ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][score] };
  }

  // Updates the visual meter independently of whether the password is valid.
  function updateStrengthMeter() {
    const { score, label } = getPasswordStrength(fields.password.value);
    strengthBar.style.width = `${score * 25}%`;
    strengthBar.dataset.level = score;
    strengthText.textContent = fields.password.value
      ? `Password strength: ${label}`
      : 'Password strength: not set';
  }

  // Validates one control and returns true only when its value is acceptable.
  function validateField(fieldName) {
    const field = fields[fieldName];
    const value = field.value.trim();

    if (fieldName === 'name') {
      if (value.length < 2 || !patterns.name.test(value)) { showError(field, 'Enter a valid full name using letters and spaces only.'); return false; }
    } else if (fieldName === 'email') {
      if (!patterns.email.test(value)) { showError(field, 'Enter a valid email address, for example name@example.com.'); return false; }
    } else if (fieldName === 'mobile') {
      if (!patterns.mobile.test(value)) { showError(field, 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.'); return false; }
    } else if (fieldName === 'password') {
      const strength = getPasswordStrength(value);
      if (strength.score < 4) { showError(field, 'Use at least 8 characters with upper- and lowercase letters, a number, and a symbol.'); return false; }
    } else if (fieldName === 'confirmPassword') {
      if (!value || value !== fields.password.value) { showError(field, 'Passwords do not match.'); return false; }
    } else if (fieldName === 'course' || fieldName === 'year') {
      if (!value) { showError(field, `Please select your ${fieldName}.`); return false; }
    } else if (fieldName === 'terms') {
      if (!field.checked) { showError(field, 'You must accept the terms and conditions.'); return false; }
    }
    clearError(field);
    return true;
  }

  // Gender is a radio group, so it uses one group message instead of an input ID.
  function validateGender() {
    const selected = form.querySelector('input[name="gender"]:checked');
    const error = document.getElementById('gender-error');
    if (!selected) { error.textContent = 'Please select your gender.'; return false; }
    error.textContent = '';
    return true;
  }

  // Validate while users interact, then re-check confirmation after password changes.
  Object.entries(fields).forEach(([name, field]) => {
    const eventName = field.type === 'checkbox' ? 'change' : 'input';
    field.addEventListener(eventName, () => {
      if (name === 'password') updateStrengthMeter();
      validateField(name);
      if (name === 'password' && fields.confirmPassword.value) validateField('confirmPassword');
    });
    field.addEventListener('blur', () => validateField(name));
  });
  form.querySelectorAll('input[name="gender"]').forEach((radio) => radio.addEventListener('change', validateGender));

  // Submission prevents the demo form from reloading and reports one clear outcome.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fieldsAreValid = Object.keys(fields).every(validateField);
    const genderIsValid = validateGender();
    if (fieldsAreValid && genderIsValid) {
      formStatus.textContent = 'Registration details are valid. You can now submit them to a server in a later practical.';
      formStatus.className = 'form-status is-success';
    } else {
      formStatus.textContent = 'Please correct the highlighted fields and try again.';
      formStatus.className = 'form-status is-error';
      form.querySelector('[aria-invalid="true"], input[name="gender"]')?.focus();
    }
  });
});
