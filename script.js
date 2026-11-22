(() => {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  // Sticky header styling and responsive menu.
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'فتح القائمة' : 'إغلاق القائمة');
    mainNav.classList.toggle('open', !isOpen);
  });

  mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'فتح القائمة');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav?.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.focus();
    }
  });

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Property finder: filters the cards using the published price and bedroom count.
  const searchForm = document.getElementById('propertySearch');
  const budgetFilter = document.getElementById('budgetFilter');
  const roomsFilter = document.getElementById('roomsFilter');
  const propertyCards = Array.from(document.querySelectorAll('.property-card'));
  const noResults = document.getElementById('noResults');
  const filterProperties = (event) => {
    event?.preventDefault();
    const budget = Number(budgetFilter?.value || 0);
    const rooms = Number(roomsFilter?.value || 0);
    let visible = 0;
    propertyCards.forEach((card) => {
      const price = Number(card.dataset.price || 0);
      const bedrooms = Number(card.dataset.rooms || 0);
      const matchesBudget = !budget || price <= budget;
      const matchesRooms = !rooms || bedrooms >= rooms;
      const show = matchesBudget && matchesRooms;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (noResults) noResults.hidden = visible > 0;
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  searchForm?.addEventListener('submit', filterProperties);

  // Testimonials slider.
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const previous = document.getElementById('testimonialPrev');
  const next = document.getElementById('testimonialNext');
  const counter = document.getElementById('testimonialCounter');
  const progress = document.getElementById('testimonialProgress');
  let activeSlide = 0;

  const showSlide = (index) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === activeSlide));
    if (counter) counter.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (progress) progress.style.width = `${((activeSlide + 1) / slides.length) * 100}%`;
  };
  previous?.addEventListener('click', () => showSlide(activeSlide - 1));
  next?.addEventListener('click', () => showSlide(activeSlide + 1));
  showSlide(0);

  // Keep FAQ focused: opening one answer closes the others.
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
