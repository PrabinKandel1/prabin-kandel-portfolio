(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        nav.classList.remove('is-open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open navigation');
      }
    });
  }
  const page = document.body.dataset.page;
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const target = link.dataset.nav;
    const isCurrent = target === currentFile || (page === 'case-study' && target === 'projects.html');
    if (isCurrent) link.setAttribute('aria-current', 'page');
  });
  document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());

  const dialog = document.querySelector('.lightbox');
  if (dialog) {
    const image = dialog.querySelector('[data-lightbox-image]');
    const title = dialog.querySelector('[data-lightbox-title]');
    const close = dialog.querySelector('[data-lightbox-close]');
    document.querySelectorAll('[data-lightbox]').forEach(button => {
      button.addEventListener('click', () => {
        image.src = button.dataset.lightbox;
        image.alt = button.dataset.title || 'Certificate document';
        title.textContent = button.dataset.title || 'Certificate';
        dialog.showModal();
      });
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { image.src = ''; });
  }


  // Case-study image viewer: modal zoom preserves the current scroll position.
  const caseDialog = document.querySelector('.case-lightbox');
  if (caseDialog) {
    const caseImage = caseDialog.querySelector('[data-case-lightbox-image]');
    const caseClose = caseDialog.querySelector('.case-lightbox-close');
    document.querySelectorAll('[data-case-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        caseImage.src = trigger.dataset.caseLightbox;
        caseImage.alt = trigger.dataset.title || 'Project screenshot';
        caseDialog.showModal();
      });
    });
    caseClose.addEventListener('click', () => caseDialog.close());
    caseDialog.addEventListener('click', event => { if (event.target === caseDialog) caseDialog.close(); });
    caseDialog.addEventListener('close', () => { caseImage.removeAttribute('src'); });
  }

  // Subtle, purposeful interactions; no page-load intro animation.
  const header = document.querySelector('.site-header');
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('pageshow', updateHeader, { passive: true });

  if (menu && nav) {
    document.addEventListener('click', event => {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menu.contains(event.target)) {
        nav.classList.remove('is-open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  // Reveal content only as it enters the reading area, never on initial page load.
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!motionReduced && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.recognition-item, .education-item, .index-project, .certificate-card, .case-chapter, .case-shot, .principles > div, .contact-detail, .future-note, .project-cta'
    );
    revealTargets.forEach((node, index) => {
      node.classList.add('scroll-reveal');
      node.style.setProperty('--reveal-delay', '0ms');
    });
    try {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
    revealTargets.forEach(node => observer.observe(node));
    } catch (error) {
      revealTargets.forEach(node => node.classList.add('is-visible'));
    }
  }

})();
