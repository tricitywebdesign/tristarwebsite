/* ============================================================
   TRI STAR LAWN & STUMP — SCRIPT.JS
   ============================================================ */

(function () {
  'use strict';

  /* ---- DOM References ---- */
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navOverlay = document.getElementById('nav-overlay');
  const mobileClose = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const successModal = document.getElementById('success-modal');
  const successModalClose = document.getElementById('success-modal-close');
  const successModalBg = document.getElementById('success-modal-backdrop');
  const successModalOk = document.getElementById('success-modal-ok');
  const footerYear = document.getElementById('footer-year');
  const navLinks = document.querySelectorAll('.main-nav ul li a');
  const sections = document.querySelectorAll('section[id]');

  const submitButtonDefault = contactForm
    ? contactForm.querySelector('[type="submit"]').innerHTML
    : '';

  /* ---- Footer Year ---- */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ---- Sticky Header Shadow ---- */
  function onScroll() {
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    highlightNav();
    revealElements();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Active Nav Highlight ---- */
  function highlightNav() {
    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Mobile Nav ---- */
  function openMobileNav() {
    if (!mobileNav || !navOverlay || !navToggle) return;

    mobileNav.classList.add('open');
    navOverlay.classList.add('active');
    navOverlay.style.display = 'block';
    mobileNav.setAttribute('aria-hidden', 'false');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav || !navOverlay || !navToggle) return;

    mobileNav.classList.remove('open');
    navOverlay.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    setTimeout(function () {
      if (!navOverlay.classList.contains('active')) {
        navOverlay.style.display = 'none';
      }
    }, 300);
  }

  if (navToggle) navToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---- Success Modal ---- */
  function openSuccessModal() {
    if (!successModal) return;

    successModal.hidden = false;
    successModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSuccessModal() {
    if (!successModal) return;

    successModal.hidden = true;
    successModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (successModalClose) successModalClose.addEventListener('click', closeSuccessModal);
  if (successModalBg) successModalBg.addEventListener('click', closeSuccessModal);
  if (successModalOk) successModalOk.addEventListener('click', closeSuccessModal);

  /* ---- Keyboard Handling ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }

    if (e.key === 'Escape' && successModal && !successModal.hidden) {
      closeSuccessModal();
    }
  });

  /* ---- Reveal on Scroll (IntersectionObserver) ---- */
  function revealElements() {
    document.querySelectorAll('.reveal:not(.revealed)').forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('revealed');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements();
    window.addEventListener('scroll', revealElements, { passive: true });
  }

  /* ---- Form Helpers ---- */
  function setFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.hidden = false;
    formStatus.textContent = message;
    formStatus.className = 'form-status';

    if (type) {
      formStatus.classList.add('is-' + type);
    }
  }

  function clearFormStatus() {
    if (!formStatus) return;

    formStatus.hidden = true;
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  function markFieldValidity(field) {
    if (!field) return true;

    field.classList.remove('field-error');

    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const isEmailField = field.type === 'email';

    if (isRequired && !value) {
      field.classList.add('field-error');
      return false;
    }

    if (isEmailField && value && !field.checkValidity()) {
      field.classList.add('field-error');
      return false;
    }

    return true;
  }

  function setSubmitState(isSubmitting) {
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('[type="submit"]');
    if (!submitBtn) return;

    submitBtn.disabled = isSubmitting;
    submitBtn.innerHTML = isSubmitting ? 'Sending...' : submitButtonDefault;
  }

  /* ---- Contact Form (Formspree) ---- */
  if (contactForm) {
    const formFields = contactForm.querySelectorAll('input, textarea, select');

    formFields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.classList.contains('field-error')) {
          markFieldValidity(field);
        }
      });

      field.addEventListener('blur', function () {
        markFieldValidity(field);
      });
    });

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearFormStatus();

      const requiredFields = [
        contactForm.querySelector('#name'),
        contactForm.querySelector('#phone'),
        contactForm.querySelector('#message')
      ];

      const optionalEmail = contactForm.querySelector('#email');
      let isValid = true;

      requiredFields.forEach(function (field) {
        if (!markFieldValidity(field)) {
          isValid = false;
        }
      });

      if (optionalEmail && !markFieldValidity(optionalEmail)) {
        isValid = false;
      }

      if (!isValid) {
        const firstInvalid = contactForm.querySelector('.field-error');
        if (firstInvalid) firstInvalid.focus();
        setFormStatus('Please complete the required fields before submitting.', 'error');
        return;
      }

      setSubmitState(true);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method || 'POST',
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          let errorMessage = 'Something went wrong. Please call instead or try again in a moment.';

          try {
            const data = await response.json();
            if (data && Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0].message) {
              errorMessage = data.errors[0].message;
            }
          } catch (jsonError) {
            /* Ignore JSON parsing errors and use fallback message. */
          }

          throw new Error(errorMessage);
        }

        contactForm.reset();
        clearFormStatus();
        openSuccessModal();
      } catch (error) {
        setFormStatus(error.message || 'Unable to send your request right now. Please call instead.', 'error');
      } finally {
        setSubmitState(false);
      }
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href');
      if (!targetSelector || targetSelector === '#') return;

      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
          10
        ) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Initial run ---- */
  onScroll();
})();