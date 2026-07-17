function init() {
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('is-open');
    });
  }

  const revealGroups = [
    '.hero__eyebrow, .detail-eyebrow, .hero h1, .hero__lead, .hero__actions',
    '.image-grid__col > *',
    '.section-head',
    '.service-cards > *',
    '.service-rows > *',
    '.card-grid > *',
    '.steps > *',
    '.cta-banner',
    '.contact-list, form',
    '.detail-body > *',
    '.project-sidebar > *',
    '.project-main h4',
    '.deliverable-grid > *',
    '.results-grid > *',
  ];

  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  // Safety net: never leave content permanently hidden if something above fails.
  setTimeout(() => {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
