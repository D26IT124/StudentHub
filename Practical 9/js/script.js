/* Practical 4: theme persistence, notification controls, FAQ behavior, and homepage slider. */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  // Restore the saved preference before visitors interact with the page.
  if (localStorage.getItem('studenthub-theme') === 'dark') body.classList.add('dark-theme');

  // Theme buttons appear throughout the portal and save their selection in localStorage.
  const updateThemeButtons = () => document.querySelectorAll('.theme-toggle').forEach((button) => {
    const dark = body.classList.contains('dark-theme');
    button.textContent = dark ? 'Use Light Theme' : 'Change Theme';
    button.setAttribute('aria-pressed', String(dark));
  });
  updateThemeButtons();
  document.querySelectorAll('.theme-toggle').forEach((button) => button.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('studenthub-theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    updateThemeButtons();
  }));

  // Change Heading toggles one emoji suffix: add it on one click, remove it on the next.
  document.querySelectorAll('.heading-button').forEach((button) => button.addEventListener('click', () => {
    const heading = button.closest('.live-notification')?.querySelector('h2');
    if (!heading) return;
    heading.textContent = heading.textContent.includes('🎉')
      ? heading.textContent.replace(/\s*🎉/g, '')
      : `${heading.textContent} 🎉`;
  }));

  // The close button affects only its own notification banner.
  document.querySelectorAll('.notification-close').forEach((button) => button.addEventListener('click', () => {
    const notification = button.closest('.live-notification');
    if (notification) notification.hidden = true;
  }));

  // Native details/summary remains keyboard friendly; this adds one-open-item behavior.
  document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.faq-item[open]').forEach((other) => { if (other !== item) other.open = false; });
  }));

  // Future slider images can be added by placing another object in this array.
  const slides = [
    ['assets/studenthub-admin-building.png', 'StudentHub administration building on a sunny campus day', 'The StudentHub administration building—your campus connection point.'],
    ['assets/studenthub-innovation-lab.png', 'Students collaborating in a modern innovation laboratory', 'Student innovators collaborate, experiment, and build together.'],
    ['assets/studenthub-cultural-event.png', 'Students enjoying a cultural event in the campus courtyard', 'Campus events create connections beyond the classroom.']
  ];
  const image = document.getElementById('slider-image');
  const caption = document.getElementById('slider-caption');
  const status = document.getElementById('slider-status');
  let currentSlide = 0;
  // Render the selected image and announce its new position.
  const showSlide = (index) => {
    if (!image || !caption || !status) return;
    currentSlide = (index + slides.length) % slides.length;
    const [src, alt, text] = slides[currentSlide];
    image.src = src; image.alt = alt; caption.textContent = text;
    status.textContent = `Image ${currentSlide + 1} of ${slides.length}`;
  };
  document.querySelectorAll('[data-slider-action]').forEach((button) => button.addEventListener('click', () => {
    showSlide(currentSlide + (button.dataset.sliderAction === 'next' ? 1 : -1));
  }));

  // Hamburger menu toggle for Practical 4
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        navToggle.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (siteNav.classList.contains('is-open') && !siteNav.contains(e.target) && !navToggle.contains(e.target)) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // Registration Form Validation (Practical 5 & 9)
  const regForm = document.getElementById('registration-form');
  if (regForm) {
    const validateField = (id, condition, message) => {
      const field = document.getElementById(id);
      const errorEl = document.getElementById(`${id}-error`);
      if (!condition) {
        if (errorEl) errorEl.textContent = message;
        if (field) field.classList.add('invalid');
        return false;
      }
      if (errorEl) errorEl.textContent = '';
      if (field) field.classList.remove('invalid');
      return true;
    };

    // Password Strength Meter
    const passInput = document.getElementById('password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('password-strength');

    if (passInput) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[a-z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) strength++;

        const levels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#ff4d4d', '#ffad33', '#ffff66', '#99ff33', '#00cc00'];

        if (strengthBar && strengthText) {
          strengthText.textContent = `Password strength: ${levels[strength - 1] || 'Too Weak'}`;
          strengthBar.style.width = `${(strength / 5) * 100}%`;
          strengthBar.style.backgroundColor = colors[strength - 1] || '#ff4d4d';
        }
      });
    }

    regForm.addEventListener('submit', (e) => {
      let isValid = true;

      isValid &= validateField('name', regForm.name.value.trim().length >= 2 && /^[A-Za-z ]+$/.test(regForm.name.value), 'Name must be 2+ characters (letters only).');
      isValid &= validateField('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.value), 'Enter a valid email address.');
      isValid &= validateField('mobile', /^[6-9][0-9]{9}$/.test(regForm.mobile.value), 'Enter a valid 10-digit mobile number.');
      isValid &= validateField('password', regForm.password.value.length >= 8, 'Password must be at least 8 characters.');
      isValid &= validateField('confirm-password', regForm['confirm-password'].value === regForm.password.value, 'Passwords do not match.');
      isValid &= validateField('course', regForm.course.value !== '', 'Please select a course.');
      isValid &= validateField('year', regForm.year.value !== '', 'Please select a year.');

      // Gender validation
      const genderSelected = regForm.querySelector('input[name="gender"]:checked');
      isValid &= validateField('gender', !!genderSelected, 'Please select your gender.');

      isValid &= validateField('terms', regForm.terms.checked, 'You must accept the terms.');

      if (!isValid) {
        e.preventDefault();
        document.getElementById('form-status').textContent = 'Please correct the errors above.';
        document.getElementById('form-status').style.color = 'red';
      }
    });
  }
});