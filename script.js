/**
 * WhizTech Enterprise Web Architecture
 * Client-side Controller & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initSmoothScroll();
  initMetricCounters();
  initTurnstileWidget();
  initLeadForm();
  initTiltEffects();
  initSpotlightAndHalo();
  initLiveArchitectureTelemetry();
  initScrollReveal();
  initBackToTop();
});

/* ==========================================================================
   Sticky Header & Scroll State
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Mobile Drawer & Navigation
   ========================================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('close-drawer-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  const toggle = (isOpen) => {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !drawer.classList.contains('open');
    menuBtn.classList.toggle('open', shouldOpen);
    drawer.classList.toggle('open', shouldOpen);
    menuBtn.setAttribute('aria-expanded', shouldOpen);
    drawer.setAttribute('aria-hidden', !shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
    document.body.classList.toggle('mobile-menu-active', shouldOpen);
  };

  menuBtn.addEventListener('click', () => toggle());
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) toggle(false);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggle(false);
    }
  });

  window.toggleMobileDrawer = toggle;
}

/* ==========================================================================
   Smooth Scroll & Active Nav Spy
   ========================================================================== */
function initSmoothScroll() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Animated Metric Counters
   ========================================================================== */
function initMetricCounters() {
  const metricItems = document.querySelectorAll('.metric-number[data-target]');
  if (!metricItems.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricItems.forEach(el => animateCount(el));
      }
    });
  }, { threshold: 0.3 });

  const strip = document.querySelector('.metric-strip');
  if (strip) observer.observe(strip);
}

function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const isDecimal = target % 1 !== 0;
  const duration = 1600;
  const startTime = performance.now();

  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = progress * target;

    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    }
  };

  requestAnimationFrame(update);
}

/* ==========================================================================
   Simulated Cloudflare Turnstile Verification Widget
   ========================================================================== */
function initTurnstileWidget() {
  const box = document.getElementById('turnstile-box');
  const checkbox = document.getElementById('turnstile-checkbox');
  const statusText = document.getElementById('turnstile-status-text');
  const hiddenInput = document.getElementById('turnstile-verified');
  const errorMsg = document.getElementById('turnstile-error');

  if (!box || !checkbox || !statusText || !hiddenInput) return;

  window.toggleTurnstileCheck = function() {
    if (box.classList.contains('verified') || box.classList.contains('verifying')) {
      return;
    }

    // Trigger verifying animation
    box.classList.add('verifying');
    statusText.textContent = 'Verifying security signature...';
    if (errorMsg) errorMsg.classList.remove('visible');

    setTimeout(() => {
      box.classList.remove('verifying');
      box.classList.add('verified');
      statusText.textContent = 'Verification Successful';
      statusText.style.color = '#10b981';
      checkbox.setAttribute('aria-checked', 'true');
      hiddenInput.value = 'true';
    }, 850);
  };
}

/* ==========================================================================
   Modern Intake Lead Form Controller
   ========================================================================== */
function initLeadForm() {
  const form = document.getElementById('lead-intake-form');
  const successCard = document.getElementById('form-success-card');
  const turnstileVerified = document.getElementById('turnstile-verified');
  const turnstileError = document.getElementById('turnstile-error');

  if (!form) return;

  const fields = [
    { id: 'fullName', errorId: 'fullName-error', validate: val => val.trim().length >= 2 },
    { id: 'businessEmail', errorId: 'businessEmail-error', validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
    { id: 'serviceNeeded', errorId: 'serviceNeeded-error', validate: val => val !== '' },
    { id: 'projectScope', errorId: 'projectScope-error', validate: val => val.trim().length >= 10 }
  ];

  // Real-time error removal
  fields.forEach(field => {
    const el = document.getElementById(field.id);
    const err = document.getElementById(field.errorId);
    if (!el || !err) return;

    el.addEventListener('input', () => {
      if (field.validate(el.value)) {
        el.classList.remove('error');
        err.classList.remove('visible');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    fields.forEach(field => {
      const el = document.getElementById(field.id);
      const err = document.getElementById(field.errorId);
      if (!el || !err) return;

      if (!field.validate(el.value)) {
        el.classList.add('error');
        err.classList.add('visible');
        hasError = true;
      } else {
        el.classList.remove('error');
        err.classList.remove('visible');
      }
    });

    // Check Cloudflare Turnstile verification
    if (turnstileVerified && turnstileVerified.value !== 'true') {
      if (turnstileError) turnstileError.classList.add('visible');
      hasError = true;
    } else {
      if (turnstileError) turnstileError.classList.remove('visible');
    }

    if (hasError) {
      showToast('Please complete all required fields and security check', 'error');
      return;
    }

    // Submit Simulation
    const submitBtn = document.getElementById('submit-inquiry-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Encrypting &amp; Submitting...</span>`;
    }

    setTimeout(() => {
      // Generate unique ref ID
      const refNumber = Math.floor(1000 + Math.random() * 9000);
      const refEl = document.getElementById('inquiry-ref');
      if (refEl) refEl.textContent = `#WZT-${refNumber}`;

      form.style.display = 'none';
      if (successCard) successCard.style.display = 'flex';

      showToast(`Inquiry #WZT-${refNumber} received! An architect will reach out shortly.`, 'success');
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Inquiry (Protected by Cloudflare Turnstile)</span>`;
      }
    }, 1100);
  });
}

function resetLeadForm() {
  const form = document.getElementById('lead-intake-form');
  const successCard = document.getElementById('form-success-card');
  const turnstileBox = document.getElementById('turnstile-box');
  const turnstileCheckbox = document.getElementById('turnstile-checkbox');
  const turnstileStatus = document.getElementById('turnstile-status-text');
  const turnstileInput = document.getElementById('turnstile-verified');

  if (form && successCard) {
    form.reset();
    form.style.display = 'flex';
    successCard.style.display = 'none';

    // Reset turnstile
    if (turnstileBox && turnstileCheckbox && turnstileStatus && turnstileInput) {
      turnstileBox.classList.remove('verified', 'verifying');
      turnstileCheckbox.setAttribute('aria-checked', 'false');
      turnstileStatus.textContent = 'Verify you are human';
      turnstileStatus.style.color = '';
      turnstileInput.value = 'false';
    }
  }
}

/* ==========================================================================
   Consultation Booking Modal
   ========================================================================== */
function openConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  if (!modal) return;

  // Set minimum date to tomorrow
  const dateInput = document.getElementById('consult-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function handleConsultationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('consult-name')?.value || 'Client';
  const date = document.getElementById('consult-date')?.value || 'selected date';

  closeConsultationModal();
  showToast(`Consultation confirmed for ${name} on ${date}. Calendar invite dispatched.`, 'success');
  document.getElementById('consultation-form')?.reset();
}

/* ==========================================================================
   Legal Modals (Privacy, Terms, Security)
   ========================================================================== */
const legalData = {
  privacy: {
    title: 'Privacy Policy',
    content: `
      <h4>1. Enterprise Data Stewardship</h4>
      <p>WhizTech Solutions Inc. ("WhizTech") adheres strictly to enterprise data governance standards. We treat all client business information, code repositories, architectural designs, and communications with strict non-disclosure obligations.</p>
      <h4>2. Information Collected</h4>
      <p>We only collect information voluntarily provided via intake forms, consultation requests, or contractual agreements. We do not sell, rent, or lease client data to third parties under any circumstances.</p>
      <h4>3. Security &amp; Compliance</h4>
      <p>All transmitted data is encrypted in transit using TLS 1.3 and at rest with AES-256 encryption. Our infrastructure complies with modern ISO 27001 and SOC2 Type II benchmarks.</p>
      <h4>4. Contact Privacy Officer</h4>
      <p>Inquiries regarding privacy compliance can be directed to <strong>privacy@whiztech.info</strong>.</p>
    `
  },
  terms: {
    title: 'Terms of Service',
    content: `
      <h4>1. Advisory &amp; Software Delivery</h4>
      <p>All professional services, engineering deliverable schedules, and service level agreements (SLAs) provided by WhizTech are governed by mutual Master Services Agreements (MSAs) and Statements of Work (SOWs).</p>
      <h4>2. Intellectual Property Rights</h4>
      <p>Upon final settlement of project invoices, all custom software artifacts, source code, and architectural documentation created specifically for the client become the exclusive property of the client.</p>
      <h4>3. SLA &amp; Uptime Commitments</h4>
      <p>Production systems managed under WhizTech DevOps support maintain a guaranteed 99.9% uptime SLA with 24/7 continuous health telemetry and incident escalation.</p>
    `
  },
  security: {
    title: 'Security Statement & Compliance',
    content: `
      <h4>1. Zero-Trust Architecture</h4>
      <p>WhizTech designs every client system under the principle of Zero Trust: verify explicitly, grant least-privileged access, and assume breach. All microservices communicate over mutual TLS (mTLS).</p>
      <h4>2. Vulnerability Management</h4>
      <p>Continuous automated SAST/DAST scans are integrated directly into our CI/CD pipelines. Regular third-party penetration testing is conducted across cloud environments.</p>
      <h4>3. Incident Escalation</h4>
      <p>Our dedicated Security Operations Center (SOC) operates 24/7/365 with automated alerting and a maximum 15-minute response window for P1 critical events.</p>
    `
  }
};

function showLegalModal(key, event) {
  if (event) event.preventDefault();
  const data = legalData[key] || legalData.security;
  const modal = document.getElementById('legal-modal');
  const title = document.getElementById('legal-modal-title');
  const body = document.getElementById('legal-modal-body');

  if (modal && title && body) {
    title.textContent = data.title;
    body.innerHTML = data.content;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeLegalModal() {
  const modal = document.getElementById('legal-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

/* ==========================================================================
   Card Mouse Follow / Subtle Tilt
   ========================================================================== */
function initTiltEffects() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = card.querySelector('.card-glow-bg');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(29, 99, 237, 0.22) 0%, transparent 65%)`;
      }
    });
  });
}

/* ==========================================================================
   Bespoke Spotlight & Ambient Cursor Follower (Linear / Raycast Style)
   ========================================================================== */
function initSpotlightAndHalo() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const halo = document.getElementById('cursor-halo');

  // Ambient Halo tracking (Desktop only)
  if (!isTouch && halo) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let haloX = mouseX;
    let haloY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        halo.classList.add('active');
        isMoving = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      halo.classList.remove('active');
    });

    const renderHalo = () => {
      haloX += (mouseX - haloX) * 0.08;
      haloY += (mouseY - haloY) * 0.08;
      halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderHalo);
    };
    requestAnimationFrame(renderHalo);
  }

  // Linear-style Card Spotlight Border Illumination
  const spotlightTargets = document.querySelectorAll('.service-card, .testimonial-card, .spotlight-card, [data-tilt]');
  spotlightTargets.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    });
  });
}

/* ==========================================================================
   Live Architecture Telemetry (Production Micro-Fluctuations)
   ========================================================================== */
function initLiveArchitectureTelemetry() {
  const latencyEl = document.getElementById('live-latency-val');
  const throughputEl = document.getElementById('live-throughput-val');
  if (!latencyEl || !throughputEl) return;

  const latencies = ['0.7ms', '0.8ms', '0.9ms', '0.8ms', '1.1ms', '0.8ms'];
  const throughputs = ['48.2k req/s', '48.7k req/s', '49.1k req/s', '48.4k req/s', '50.3k req/s', '49.8k req/s'];
  let index = 0;

  setInterval(() => {
    index = (index + 1) % latencies.length;
    
    // Pulse indicator
    latencyEl.classList.add('ping-active');
    throughputEl.classList.add('ping-active');

    setTimeout(() => {
      latencyEl.textContent = latencies[index];
      throughputEl.textContent = throughputs[index];
      latencyEl.classList.remove('ping-active');
      throughputEl.classList.remove('ping-active');
    }, 280);
  }, 2600);
}

/* ==========================================================================
   Scroll Reveal Observer (Smooth Staggered Entrance)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Back to Top Smooth Floating Pill
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// Global exposure for inline HTML event handlers
window.openConsultationModal = openConsultationModal;
window.closeConsultationModal = closeConsultationModal;
window.handleConsultationSubmit = handleConsultationSubmit;
window.showLegalModal = showLegalModal;
window.closeLegalModal = closeLegalModal;
window.resetLeadForm = resetLeadForm;
