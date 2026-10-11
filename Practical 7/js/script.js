/* =====================================================================
   Practical 6: shared interactions and JSON-driven StudentHub views.
   Data is fetched from external JSON files, then searched, filtered,
   sorted, paginated, and rendered without placing record data in HTML.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  /* Restore and update the shared theme preference on every portal page. */
  if (localStorage.getItem('studenthub-theme') === 'dark') body.classList.add('dark-theme');
  const updateThemeButtons = () => document.querySelectorAll('.theme-toggle').forEach((button) => {
    const darkThemeIsActive = body.classList.contains('dark-theme');
    button.textContent = darkThemeIsActive ? 'Use Light Theme' : 'Change Theme';
    button.setAttribute('aria-pressed', String(darkThemeIsActive));
  });
  updateThemeButtons();
  document.querySelectorAll('.theme-toggle').forEach((button) => button.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('studenthub-theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    updateThemeButtons();
  }));

  /* The home and dashboard notice buttons remain independent of data views. */
  document.querySelectorAll('.heading-button').forEach((button) => button.addEventListener('click', () => {
    const heading = button.closest('.live-notification')?.querySelector('h2');
    if (!heading) return;
    heading.textContent = heading.textContent.includes('🎉')
      ? heading.textContent.replace(/\s*🎉/g, '')
      : `${heading.textContent} 🎉`;
  }));
  document.querySelectorAll('.notification-close').forEach((button) => button.addEventListener('click', () => {
    const notification = button.closest('.live-notification');
    if (notification) notification.hidden = true;
  }));

  /* Keep only one dynamically rendered FAQ answer open at a time. */
  document.addEventListener('toggle', (event) => {
    const openedItem = event.target;
    if (!openedItem.matches?.('.faq-item[open]')) return;
    document.querySelectorAll('.faq-item[open]').forEach((item) => {
      if (item !== openedItem) item.open = false;
    });
  }, true);

  /* Homepage slider data stays separate from the Practical 6 JSON collections. */
  const slides = [
    ['assets/studenthub-admin-building.png', 'StudentHub administration building on a sunny campus day', 'The StudentHub administration building—your campus connection point.'],
    ['assets/studenthub-innovation-lab.png', 'Students collaborating in a modern innovation laboratory', 'Student innovators collaborate, experiment, and build together.'],
    ['assets/studenthub-cultural-event.png', 'Students enjoying a cultural event in the campus courtyard', 'Campus events create connections beyond the classroom.']
  ];
  const image = document.getElementById('slider-image');
  const caption = document.getElementById('slider-caption');
  const sliderStatus = document.getElementById('slider-status');
  let currentSlide = 0;
  const showSlide = (index) => {
    if (!image || !caption || !sliderStatus) return;
    currentSlide = (index + slides.length) % slides.length;
    const [source, alternativeText, description] = slides[currentSlide];
    image.src = source;
    image.alt = alternativeText;
    caption.textContent = description;
    sliderStatus.textContent = `Image ${currentSlide + 1} of ${slides.length}`;
  };
  document.querySelectorAll('[data-slider-action]').forEach((button) => button.addEventListener('click', () => {
    showSlide(currentSlide + (button.dataset.sliderAction === 'next' ? 1 : -1));
  }));

  /* Fetch one JSON file and make request failures clear to visitors and developers. */
  const fetchJson = async (filePath) => {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json();
  };

  /* Escape JSON text before inserting it in templates so it is displayed as text, not HTML. */
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  /* Insert unique filter choices from a JSON field into an existing select element. */
  const fillFilterOptions = (select, records, property) => {
    [...new Set(records.map((record) => record[property]))].sort((first, second) => first.localeCompare(second))
      .forEach((value) => select.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
  };

  /* Render previous/next controls and a clear current-page indicator. */
  const renderPagination = (container, totalPages, activePage, changePage) => {
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const previousButton = document.createElement('button');
    previousButton.type = 'button';
    previousButton.textContent = '← Back';
    previousButton.className = 'page-button';
    previousButton.disabled = activePage === 1;
    previousButton.addEventListener('click', () => changePage(activePage - 1));

    const pageIndicator = document.createElement('span');
    pageIndicator.className = 'page-indicator';
    pageIndicator.textContent = `Page ${activePage} of ${totalPages}`;
    pageIndicator.setAttribute('aria-live', 'polite');

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = 'Next →';
    nextButton.className = 'page-button';
    nextButton.disabled = activePage === totalPages;
    nextButton.addEventListener('click', () => changePage(activePage + 1));

    container.append(previousButton, pageIndicator, nextButton);
  };

  /* This reusable controller performs all Practical 6 array operations for one view. */
  const initialiseDataView = async ({
    filePath, search, filter, sort, status, results, pagination, filterProperty,
    searchRecord, sortRecords, renderRecord, recordsPerPage = 6, emptyMessage
  }) => {
    try {
      const records = await fetchJson(filePath);
      if (!Array.isArray(records)) throw new Error('The JSON response must contain an array.');

      fillFilterOptions(filter, records, filterProperty);
      let currentPage = 1;

      const render = () => {
        const searchTerm = search.value.trim().toLocaleLowerCase();
        const selectedFilter = filter.value;
        // filter() narrows by text and category/course/topic; sort() orders a new copy.
        const matchedRecords = records
          .filter((record) => searchRecord(record, searchTerm))
          .filter((record) => !selectedFilter || record[filterProperty] === selectedFilter);
        const orderedRecords = sortRecords([...matchedRecords], sort.value);
        const totalPages = Math.max(1, Math.ceil(orderedRecords.length / recordsPerPage));
        currentPage = Math.min(currentPage, totalPages);
        // slice() selects just the records belonging to the chosen page.
        const pageRecords = orderedRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

        results.innerHTML = pageRecords.map(renderRecord).join('');
        status.textContent = orderedRecords.length
          ? `${orderedRecords.length} ${orderedRecords.length === 1 ? 'result' : 'results'} found.`
          : emptyMessage;
        renderPagination(pagination, totalPages, currentPage, (page) => { currentPage = page; render(); });
      };

      // Any new search/filter/sort begins at page one so results are never hidden on a later page.
      [search, filter, sort].forEach((control) => control.addEventListener(control === search ? 'input' : 'change', () => {
        currentPage = 1;
        render();
      }));
      render();
    } catch (error) {
      status.classList.add('is-error');
      status.textContent = 'Unable to load data. Start the site through a local web server and try again.';
      console.error(`StudentHub could not load ${filePath}:`, error);
    }
  };

  /* Events: search title, filter category, and sort chronologically or alphabetically. */
  const eventResults = document.getElementById('events-grid');
  if (eventResults) initialiseDataView({
    filePath: 'data/events.json', search: document.getElementById('event-search'), filter: document.getElementById('event-category'),
    sort: document.getElementById('event-sort'), status: document.getElementById('events-status'), results: eventResults,
    pagination: document.getElementById('events-pagination'), filterProperty: 'category', emptyMessage: 'No events match your choices.',
    searchRecord: (event, term) => !term || event.title.toLocaleLowerCase().includes(term),
    sortRecords: (items, order) => items.sort((first, second) => {
      if (order.startsWith('date')) return order === 'date-asc' ? first.date.localeCompare(second.date) : second.date.localeCompare(first.date);
      return order === 'title-asc' ? first.title.localeCompare(second.title) : second.title.localeCompare(first.title);
    }),
    renderRecord: (event) => `<article class="event-card"><p class="event-category">${escapeHtml(event.category)}</p><h3>${escapeHtml(event.title)}</h3><p class="event-date">${new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(new Date(`${event.date}T00:00:00`))}</p><p class="event-description">${escapeHtml(event.description)}</p><a class="enroll-button" href="login.html">Enroll now</a></article>`
  });

  /* Students: search name/email, filter course, and sort by name or academic year. */
  const studentResults = document.getElementById('students-table-body');
  if (studentResults) initialiseDataView({
    filePath: 'data/students.json', search: document.getElementById('student-search'), filter: document.getElementById('student-course'),
    sort: document.getElementById('student-sort'), status: document.getElementById('students-status'), results: studentResults,
    pagination: document.getElementById('students-pagination'), filterProperty: 'course', emptyMessage: 'No student records match your choices.',
    searchRecord: (student, term) => !term || `${student.name} ${student.email}`.toLocaleLowerCase().includes(term),
    sortRecords: (items, order) => items.sort((first, second) => {
      if (order.startsWith('year')) return order === 'year-asc' ? first.year - second.year : second.year - first.year;
      return order === 'name-asc' ? first.name.localeCompare(second.name) : second.name.localeCompare(first.name);
    }),
    renderRecord: (student) => `<tr><td>${escapeHtml(student.id)}</td><td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.email)}</td><td>${escapeHtml(student.course)}</td><td>Year ${escapeHtml(student.year)}</td><td>${escapeHtml(student.status)}</td></tr>`
  });

  /* FAQs: search question/answer, filter topic, and sort by question or topic. */
  const faqResults = document.getElementById('faq-list');
  if (faqResults) initialiseDataView({
    filePath: 'data/faqs.json', search: document.getElementById('faq-search'), filter: document.getElementById('faq-category'),
    sort: document.getElementById('faq-sort'), status: document.getElementById('faq-status'), results: faqResults,
    pagination: document.getElementById('faq-pagination'), filterProperty: 'category', emptyMessage: 'No FAQs match your choices.',
    searchRecord: (faq, term) => !term || `${faq.question} ${faq.answer}`.toLocaleLowerCase().includes(term),
    sortRecords: (items, order) => items.sort((first, second) => {
      if (order === 'category-asc') return first.category.localeCompare(second.category) || first.question.localeCompare(second.question);
      return order === 'question-asc' ? first.question.localeCompare(second.question) : second.question.localeCompare(first.question);
    }),
    renderRecord: (faq) => `<details class="faq-item"><summary>${escapeHtml(faq.question)}<span class="faq-topic">${escapeHtml(faq.category)}</span></summary><p>${escapeHtml(faq.answer)}</p></details>`
  });
});
