function init() {
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('is-open');
    });
  }

  const revealGroups = [
    '.hero__eyebrow, .detail-eyebrow, .hero h1, .hero__tagline, .hero__lead, .hero__actions, .hero__visual',
    '.launch-hero__eyebrows, .launch-hero__title, .launch-hero__photo',
    '.explore__inner > *',
    '.narrative-block .container > *',
    '.mission-block > *',
    '.values-grid > *',
    '.faq-list > *',
    '.home-contact__card > *',
    '.section-head',
    '.service-rows > *',
    '.card-grid > *',
    '.steps > *',
    '.cta-banner',
    '.contact-list, form',
    '.detail-body > *',
    '.project-sidebar > *',
    '.project-main h4',
    '.deliverable-grid > *, .deliverable-card',
    '.results-grid > *',
    '.detail-columns > *',
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

  initModals();
  initContactForms();
}

function initContactForms() {
  document.querySelectorAll('form[action*="formspree.io"]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'A enviar...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          const success = document.createElement('div');
          success.className = 'form-success';
          success.innerHTML = '<h3>Agradecemos o seu contacto!</h3><p>Entraremos em contacto o mais breve possível.</p>';
          form.replaceWith(success);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert('Ocorreu um erro ao enviar. Tente novamente ou envie um email diretamente.');
      }
    });
  });
}

function initModals() {
  const overlays = document.querySelectorAll('.modal-overlay');
  if (!overlays.length) return;

  function panelStoryElements(panel) {
    if (!panel) return [];
    const items = [];
    panel.querySelectorAll(':scope > *').forEach((child) => {
      if (child.tagName === 'UL') {
        items.push(...child.querySelectorAll(':scope > li'));
      } else {
        items.push(child);
      }
    });
    return items;
  }

  const scrollObservers = new WeakMap();

  function getScrollObserver(overlay) {
    if (scrollObservers.has(overlay)) return scrollObservers.get(overlay);
    const scrollRoot = overlay.querySelector('.modal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: scrollRoot, threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    scrollObservers.set(overlay, observer);
    return observer;
  }

  function playStory(overlay, elements) {
    const observer = getScrollObserver(overlay);
    elements.forEach((el) => {
      observer.unobserve(el);
      el.classList.remove('is-visible');
      el.classList.add('modal-reveal');
      el.style.transitionDelay = '0ms';
    });
    requestAnimationFrame(() => {
      elements.forEach((el) => observer.observe(el));
    });
  }

  function playModalStory(overlay) {
    const headerEls = overlay.querySelectorAll('.modal__header h3, .modal__header p');
    const tabs = overlay.querySelector('.modal__tabs');
    const activePanel = overlay.querySelector('.modal__panel.is-active');
    const footerEls = overlay.querySelectorAll('.modal__footer > *');

    const elements = [...headerEls];
    if (tabs) elements.push(tabs);
    elements.push(...panelStoryElements(activePanel));
    elements.push(...footerEls);

    playStory(overlay, elements);
  }

  function openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return false;
    overlay.classList.add('is-open');
    document.body.classList.add('modal-open');
    overlay.querySelector('.modal').scrollTop = 0;
    playModalStory(overlay);
    return true;
  }

  function closeModal(overlay) {
    overlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const opened = openModal(trigger.getAttribute('data-modal-open'));
      if (opened) e.preventDefault();
    });
  });

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });

    overlay.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => closeModal(overlay));
    });

    overlay.querySelectorAll('.modal__tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const panelId = tab.getAttribute('data-tab');
        overlay.querySelectorAll('.modal__tab').forEach((t) => t.classList.remove('is-active'));
        overlay.querySelectorAll('.modal__panel').forEach((p) => p.classList.remove('is-active'));
        tab.classList.add('is-active');
        const panel = overlay.querySelector(`[data-panel="${panelId}"]`);
        panel.classList.add('is-active');
        overlay.querySelector('.modal').scrollTop = 0;
        playStory(overlay, panelStoryElements(panel));
      });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach((overlay) => {
        if (overlay.classList.contains('is-open')) closeModal(overlay);
      });
    }
  });

  const hash = window.location.hash.replace('#', '');
  if (hash) openModal(hash);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
