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
});
