/* ==========================================================================
   Portfolio Controller Script - Thodeti Sruthi
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if data is available
  if (!window.portfolioData) {
    console.error("Portfolio data not found.");
    return;
  }

  const data = window.portfolioData;

  // Initialize all core controllers
  initThemeController();
  initNavigationController();
  initCursorController();
  initTypingAnimation();
  renderProfileAndAbout(data.profile);
  renderTimelines(data.internships, data.education);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderCertificates(data.certificates);
  renderContactInfo(data.profile);
  initContactForm();

  // Initial call to attach 3D tilt effects
  setTimeout(() => {
    if (window.initTiltEffect) {
      window.initTiltEffect('.tilt-card-3d');
    }
  }, 100);
});

/* ==========================================================================
   1. Theme Toggler (Dark/Light Modes)
   ========================================================================== */
function initThemeController() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeText = document.getElementById('theme-text');
  const themeIcon = document.getElementById('theme-icon');
  const htmlElement = document.documentElement;

  // Read saved theme or fallback to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (theme === 'dark') {
      themeText.textContent = 'Light Mode';
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeText.textContent = 'Dark Mode';
      themeIcon.className = 'fa-solid fa-moon';
    }

    // Inform Three.js background of color change
    if (window.updateThreeTheme) {
      window.updateThreeTheme(theme);
    }
  }
}

/* ==========================================================================
   2. Single Page App (SPA) Routing & Mobile Drawer Navigation
   ========================================================================== */
function initNavigationController() {
  const navItems = document.querySelectorAll('.nav-item');
  const pageViews = document.querySelectorAll('.page-view');
  const sidebar = document.getElementById('sidebar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navTriggerBtns = document.querySelectorAll('.nav-trigger-btn');

  // Set up mobile menu hamburger toggle
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('mobile-open');
  });

  // Close mobile sidebar when clicking main content
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
      sidebar.classList.remove('mobile-open');
    }
  });

  // Sidebar item click router
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      const pageId = this.getAttribute('data-page');
      navigateTo(pageId);
    });
  });

  // External page triggers (like home section CTA buttons)
  navTriggerBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const targetPage = this.getAttribute('data-target');
      navigateTo(targetPage);
    });
  });

  // Handle direct url hash load (e.g. index.html#skills)
  if (window.location.hash) {
    const targetHash = window.location.hash.substring(1);
    const targetSection = document.getElementById(targetHash);
    if (targetSection && targetSection.classList.contains('page-view')) {
      navigateTo(targetHash);
    }
  }

  function navigateTo(pageId) {
    // Scroll window back to top smoothly
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active state in sidebar
    navItems.forEach(item => {
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active section
    pageViews.forEach(view => {
      if (view.id === pageId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Close mobile menu drawer if open
    sidebar.classList.remove('mobile-open');

    // Update browser URL hash quietly without jumping
    history.pushState(null, null, `#${pageId}`);
  }
}

/* ==========================================================================
   3. Custom Cursor Tracker
   ========================================================================== */
function initCursorController() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position inner dot instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Render loop using requestAnimationFrame for smooth spring lag on outer ring
  function updateRing() {
    // Linear Interpolation (lerp) formula: Current = Current + (Target - Current) * EaseFactor
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Attach hover styles to clickable items
  const hoverSelectors = 'a, button, input, textarea, .tilt-card-3d, .filter-btn, .theme-toggle-btn';
  
  // Set up listeners using event delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.add('custom-cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      // Check if mouse left or entered another hover target
      if (!e.relatedTarget || !e.relatedTarget.closest(hoverSelectors)) {
        document.body.classList.remove('custom-cursor-hover');
      }
    }
  });
}

/* ==========================================================================
   4. Typing Ticker Animation
   ========================================================================== */
function initTypingAnimation() {
  const target = document.getElementById('typing-text');
  const titles = [
    "Computer Science Engineer",
    "AI & Deep Learning Enthusiast",
    "Web Application Developer",
    "NSS Volunteer & Leader"
  ];
  
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
      // Erase character
      target.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40; // Erase faster
    } else {
      // Type character
      target.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    // Typing pauses at full word
    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typeSpeed = 2200; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  // Launch loop
  setTimeout(type, 1000);
}

/* ==========================================================================
   5. Dynamic Section Renderers
   ========================================================================== */

// Profile & About details
function renderProfileAndAbout(profile) {
  document.getElementById('hero-profile-tagline').textContent = profile.tagline;
  document.getElementById('about-summary-text').textContent = profile.about;

  const detailsList = document.getElementById('about-details-list');
  const details = [
    { label: "Email", val: profile.email },
    { label: "Phone", val: profile.phone },
    { label: "Address", val: profile.address },
    { label: "Birth Date", val: profile.dob },
    { label: "Nationality", val: profile.nationality }
  ];

  detailsList.innerHTML = details.map(item => `
    <li>
      <span class="label">${item.label}</span>
      <span class="val">${item.val}</span>
    </li>
  `).join('');
}

// Timelines: Internships & Education
function renderTimelines(internships, education) {
  // 1. Internships
  const internshipTimeline = document.getElementById('internships-timeline');
  internshipTimeline.innerHTML = internships.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card glass-panel p-4">
        <div class="timeline-header">
          <h4 class="mb-0 fw-bold">${item.role}</h4>
          <div class="timeline-date"><i class="fa-solid fa-calendar-days"></i> ${item.duration}</div>
        </div>
        <h5 class="timeline-inst text-uppercase text-secondary">${item.company}</h5>
        <ul class="timeline-points">
          ${item.points.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // 2. Education
  const eduTimeline = document.getElementById('education-timeline');
  eduTimeline.innerHTML = education.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card glass-panel p-4">
        <div class="timeline-header">
          <h4 class="mb-0 fw-bold">${item.degree}</h4>
          <span class="timeline-badge">${item.metricType}: ${item.metricValue}</span>
        </div>
        <h5 class="timeline-inst text-secondary">${item.institution}</h5>
        <div class="timeline-date"><i class="fa-solid fa-location-dot"></i> ${item.location} &nbsp;|&nbsp; <i class="fa-solid fa-clock"></i> ${item.duration}</div>
      </div>
    </div>
  `).join('');
}

// Skills Matrix
function renderSkills(skills) {
  // 1. Technical Skills
  const techGrid = document.getElementById('tech-skills-grid');
  techGrid.innerHTML = skills.languages.map(skill => `
    <div class="skill-card-3d tilt-card-3d glass-panel">
      <div class="skill-icon-wrap">
        <i class="${skill.icon}"></i>
      </div>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-progress-container">
        <div class="skill-progress-bar" style="width: ${skill.level}%"></div>
      </div>
    </div>
  `).join('');

  // Trigger skill bars transition animation after viewing the skills tab
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.skill-progress-bar');
        bars.forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = width; }, 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  observer.observe(document.getElementById('skills'));

  // 2. Coursework
  const courseworkContainer = document.getElementById('coursework-badges-container');
  courseworkContainer.innerHTML = skills.coursework.map(item => `
    <div class="badge-coursework">
      <i class="fa-solid fa-circle-check"></i> ${item}
    </div>
  `).join('');

  // 3. Soft Skills
  const softGrid = document.getElementById('soft-skills-grid');
  softGrid.innerHTML = skills.softSkills.map(skill => `
    <div class="soft-skill-card glass-panel">
      <i class="${skill.icon}"></i>
      <span class="soft-skill-name">${skill.name}</span>
    </div>
  `).join('');
}

// Projects & Dynamic Category Filtering
function renderProjects(projects) {
  const container = document.getElementById('projects-grid-container');
  const filtersTab = document.getElementById('project-filters');

  // Extract unique categories dynamically
  const categories = ['All', ...new Set(projects.map(p => p.category))];

  // Render Filter Buttons
  filtersTab.innerHTML = categories.map((cat, idx) => `
    <button class="filter-btn ${idx === 0 ? 'active' : ''}" data-filter="${cat}">
      ${cat}
    </button>
  `).join('');

  // Project SVG/Icon mappings
  const iconMap = {
    "AI & IoT": "fa-solid fa-microchip",
    "Web Development": "fa-solid fa-globe",
    "AI & LLM": "fa-solid fa-brain"
  };

  // Render Project Cards function
  function displayCards(filterCat) {
    const filteredProjects = filterCat === 'All' 
      ? projects 
      : projects.filter(p => p.category === filterCat);

    container.innerHTML = filteredProjects.map(proj => `
      <div class="project-card-3d tilt-card-3d glass-panel" data-category="${proj.category}">
        <div class="project-header-img">
          <span class="project-category-tag">${proj.category}</span>
          <div class="project-icon-placeholder">
            <i class="${iconMap[proj.category] || 'fa-solid fa-cube'}"></i>
          </div>
        </div>
        <div class="project-body">
          <h4 class="project-title">${proj.title}</h4>
          <p class="project-summary">${proj.summary}</p>
          <div class="tech-tags">
            ${proj.technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            ${proj.technologies.length > 4 ? `<span class="tech-tag">+${proj.technologies.length - 4} more</span>` : ''}
          </div>
          <a href="#" class="project-link-btn" data-project-id="${proj.id}">
            View Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    `).join('');

    // Re-initialize tilt on newly rendered elements
    if (window.initTiltEffect) {
      window.initTiltEffect('.project-card-3d');
    }

    // Attach click listeners to Details button
    document.querySelectorAll('.project-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projId = btn.getAttribute('data-project-id');
        openProjectModal(projId);
      });
    });
  }

  // Run initial show
  displayCards('All');

  // Filter Buttons Click Actions
  filtersTab.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.filter-btn');
    if (!clickedBtn) return;

    // Toggle active class
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    clickedBtn.classList.add('active');

    // Run transition animation
    container.style.opacity = '0';
    container.style.transform = 'translateY(15px)';
    container.style.transition = 'opacity 0.25s, transform 0.25s';

    setTimeout(() => {
      displayCards(clickedBtn.getAttribute('data-filter'));
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 250);
  });

  // Modal Populator
  function openProjectModal(projId) {
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;

    document.getElementById('modalProjectTitle').textContent = proj.title;
    document.getElementById('modalProjectCategory').textContent = proj.category;
    document.getElementById('modalProjectSummary').textContent = proj.summary;

    const detailsList = document.getElementById('modalProjectDetailsList');
    detailsList.innerHTML = proj.details.map(detail => `<li>${detail}</li>`).join('');

    const techList = document.getElementById('modalProjectTechList');
    techList.innerHTML = proj.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');

    // Show modal via Bootstrap API
    const modalElement = document.getElementById('projectDetailsModal');
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
  }
}

// Certificates Grid Renderer
function renderCertificates(certs) {
  const container = document.getElementById('certs-grid-container');
  container.innerHTML = certs.map(c => `
    <div class="cert-card-3d tilt-card-3d glass-panel">
      <div>
        <div class="cert-icon"><i class="fa-solid fa-certificate"></i></div>
        <h4 class="cert-name">${c.name}</h4>
      </div>
      <div class="cert-issuer">${c.issuer}</div>
    </div>
  `).join('');
}

// Contact Information Renderer
function renderContactInfo(profile) {
  const container = document.getElementById('contact-info-list');
  const infoItems = [
    { label: "Call Me", val: profile.phone, icon: "fa-solid fa-phone-volume", link: `tel:${profile.phone}` },
    { label: "Email Me", val: profile.email, icon: "fa-solid fa-envelope-open-text", link: `mailto:${profile.email}` },
    { label: "My Address", val: profile.address, icon: "fa-solid fa-map-location-dot" }
  ];

  container.innerHTML = infoItems.map(item => `
    <li class="contact-method-item">
      ${item.link ? `<a href="${item.link}" class="d-flex align-items-center gap-3 w-100">` : '<div class="d-flex align-items-center gap-3 w-100">'}
        <div class="contact-icon-box">
          <i class="${item.icon}"></i>
        </div>
        <div class="contact-details">
          <span class="contact-label">${item.label}</span>
          <span class="contact-value">${item.val}</span>
        </div>
      ${item.link ? '</a>' : '</div>'}
    </li>
  `).join('');
}

/* ==========================================================================
   6. Contact Form Validation and Submissions
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Reset status panel
    feedback.style.display = 'none';
    feedback.className = 'feedback-status';

    // Validation checks
    if (!name || !email || !subject || !message) {
      showFeedback('Please fill out all input fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please provide a valid email address.', 'error');
      return;
    }

    // Success response mockup (mimics background processing)
    const originalBtn = form.querySelector('button[type="submit"]');
    const originalText = originalBtn.innerHTML;
    originalBtn.disabled = true;
    originalBtn.innerHTML = 'Sending Message <i class="fa-solid fa-circle-notch fa-spin ms-2"></i>';

    setTimeout(() => {
      originalBtn.disabled = false;
      originalBtn.innerHTML = originalText;
      showFeedback(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
      form.reset();
    }, 1500);
  });

  function showFeedback(text, type) {
    feedback.textContent = text;
    feedback.style.display = 'block';
    
    if (type === 'success') {
      feedback.classList.add('feedback-success');
    } else {
      feedback.classList.add('feedback-error');
    }
  }
}
