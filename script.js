document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY NAVBAR SCROLL ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 2. MULTI-PAGE NAV ACTIVE HIGH-LIGHTING ---
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').toLowerCase();
    if (href === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- 3. MOBILE DRAWER NAVIGATION MENU ---
  const menuToggle = document.querySelector('.menu-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const navbar = document.querySelector('.navbar');
  const body = document.body;
  const html = document.documentElement;

  const openDrawer = () => {
    if (navbar) navbar.classList.add('active');
    body.classList.add('menu-open');
    html.classList.add('menu-open');
  };

  const closeDrawer = () => {
    if (navbar) navbar.classList.remove('active');
    body.classList.remove('menu-open');
    html.classList.remove('menu-open');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', () => {
      closeDrawer();
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('click', (e) => {
    if (navbar && navbar.classList.contains('active')) {
      const isClickInsideNavbar = navbar.contains(e.target);
      const isClickOnToggle = menuToggle && menuToggle.contains(e.target);
      if (!isClickInsideNavbar && !isClickOnToggle) {
        closeDrawer();
      }
    }
  });

  // --- 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- 5. NUMERICAL COUNTER ANIMATIONS ---
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats');
  
  if (statsSection && statNumbers.length > 0) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const speed = 1200;
      const increment = target / (speed / 16);
      let current = 0;

      const updateCount = () => {
        current += increment;
        if (current < target) {
          if (target % 1 === 0) {
            el.innerText = Math.floor(current) + suffix;
          } else {
            el.innerText = current.toFixed(1) + suffix;
          }
          requestAnimationFrame(updateCount);
        } else {
          el.innerText = target + suffix;
        }
      };
      updateCount();
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => animateCounter(num));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  }

  // --- 6. PRICING MONTHLY/YEARLY TOGGLE ---
  const toggleSwitch = document.querySelector('.toggle-switch');
  const toggleLabels = document.querySelectorAll('.toggle-label');
  const pricingCards = document.querySelectorAll('.plan-card');

  const plansData = {
    personal: { monthly: 5, yearly: 48 },
    professional: { monthly: 12, yearly: 115 },
    enterprise: { monthly: 29, yearly: 278 }
  };

  if (toggleSwitch && pricingCards.length > 0) {
    const updatePricing = (isYearly) => {
      pricingCards.forEach(card => {
        const planId = card.getAttribute('data-plan');
        if (planId && plansData[planId]) {
          const priceEl = card.querySelector('.plan-price');
          const periodEl = card.querySelector('.plan-period');
          if (isYearly) {
            priceEl.innerText = plansData[planId].yearly;
            periodEl.innerText = '/ year';
          } else {
            priceEl.innerText = plansData[planId].monthly;
            periodEl.innerText = '/ month';
          }
        }
      });
    };

    const handleToggle = () => {
      const isYearly = toggleSwitch.classList.toggle('yearly');
      toggleLabels.forEach(lbl => lbl.classList.toggle('active'));
      updatePricing(isYearly);
    };

    toggleSwitch.addEventListener('click', handleToggle);
    toggleLabels.forEach(label => {
      label.addEventListener('click', () => {
        const isYearly = label.classList.contains('lbl-yearly');
        const hasYearlyClass = toggleSwitch.classList.contains('yearly');
        if (isYearly !== hasYearlyClass) {
          handleToggle();
        }
      });
    });
  }

  // --- 7. CUSTOMER TESTIMONIALS SLIDER ---
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-controls');
  let currentSlideIndex = 0;

  if (track && slides.length > 0 && dotsContainer) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const goToSlide = (index) => {
      currentSlideIndex = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    };

    let autoPlayInterval = setInterval(() => {
      let nextIndex = (currentSlideIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 6000);

    const sliderContainer = document.querySelector('.testimonials-slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      sliderContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
          let nextIndex = (currentSlideIndex + 1) % slides.length;
          goToSlide(nextIndex);
        }, 6000);
      });
    }
  }

  // --- 8. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
          });
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // --- 9. FORM ELEMENTS & DOM HOOKS ---
  const form = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close-btn');

  const inputName = document.getElementById('form-name');
  const inputEmail = document.getElementById('form-email');
  const inputPhone = document.getElementById('form-phone');
  const inputCompany = document.getElementById('form-company');
  const inputStorage = document.getElementById('form-storage');
  const inputMessage = document.getElementById('form-message');

  // --- 10. CLOUD ESTIMATION ESTIMATOR BRIDGE (LOCAL STORAGE) ---
  const estPlan = document.getElementById('estPlan');
  const estCapacity = document.getElementById('estCapacity');
  const estUsers = document.getElementById('estUsers');
  const estBilling = document.getElementById('estBilling');
  const btnEstSubmit = document.getElementById('btnEstSubmit');

  if (btnEstSubmit) {
    btnEstSubmit.addEventListener('click', () => {
      const planName = estPlan.options[estPlan.selectedIndex].text;
      const capacityVal = estCapacity.value;
      const usersVal = estUsers.value;
      const billingCycle = estBilling.options[estBilling.selectedIndex].text;
      
      localStorage.setItem('est_capacity', capacityVal);
      localStorage.setItem('est_plan', planName);
      localStorage.setItem('est_users', usersVal);
      localStorage.setItem('est_billing', billingCycle);

      window.location.href = 'contact.html';
    });
  }

  // --- 11. CONTACT FORM VALIDATIONS ---
  const validations = {
    name: {
      regex: /^[A-Za-z\s]+$/,
      element: inputName,
      message: 'Name must contain only alphabets and spaces.'
    },
    email: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      element: inputEmail,
      message: 'Please enter a valid email address.'
    },
    phone: {
      regex: /^\d{10}$/,
      element: inputPhone,
      message: 'Mobile number must be exactly 10 digits.'
    },
    company: {
      regex: /^[A-Za-z0-9\s]*$/,
      element: inputCompany,
      message: 'Company name must contain only letters, numbers, and spaces.'
    },
    storage: {
      regex: /^\d+$/,
      element: inputStorage,
      message: 'Storage requirement must contain numeric values only.'
    },
    message: {
      element: inputMessage,
      validate: (val) => val.trim().length >= 20 && val.trim().length <= 500,
      message: 'Message must be between 20 and 500 characters.'
    }
  };

  const showValidationMessage = (fieldKey, isValid) => {
    const config = validations[fieldKey];
    if (!config || !config.element) return;

    const group = config.element.closest('.form-group');
    const msgEl = group.querySelector('.validation-message');

    if (isValid) {
      config.element.classList.remove('invalid');
      config.element.classList.add('valid');
      if (msgEl) {
        msgEl.classList.remove('active');
        msgEl.innerText = '';
      }
    } else {
      config.element.classList.remove('valid');
      config.element.classList.add('invalid');
      if (msgEl) {
        msgEl.innerText = config.message;
        msgEl.classList.add('active');
      }
    }
  };

  const validateField = (fieldKey) => {
    const config = validations[fieldKey];
    if (!config || !config.element) return true;

    const val = config.element.value;
    
    if (config.element.required && val.trim() === '') {
      config.message = 'This field is required.';
      showValidationMessage(fieldKey, false);
      return false;
    }

    if (fieldKey === 'name') config.message = 'Name must contain only alphabets and spaces.';
    if (fieldKey === 'email') config.message = 'Please enter a valid email address.';
    if (fieldKey === 'phone') config.message = 'Mobile number must be exactly 10 digits.';
    if (fieldKey === 'company') config.message = 'Company name must contain only letters, numbers, and spaces.';
    if (fieldKey === 'storage') config.message = 'Storage requirement must contain numeric values only.';
    if (fieldKey === 'message') config.message = 'Message must be between 20 and 500 characters.';

    let isValid = true;
    if (config.regex) {
      isValid = config.regex.test(val);
    } else if (config.validate) {
      isValid = config.validate(val);
    }

    showValidationMessage(fieldKey, isValid);
    return isValid;
  };

  Object.keys(validations).forEach(key => {
    const el = validations[key].element;
    if (el) {
      el.addEventListener('input', () => validateField(key));
      el.addEventListener('blur', () => validateField(key));
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      Object.keys(validations).forEach(key => {
        const isFieldValid = validateField(key);
        if (!isFieldValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        if (successModal) successModal.classList.add('active');
        form.reset();
        
        Object.keys(validations).forEach(key => {
          const el = validations[key].element;
          if (el) {
            el.classList.remove('valid', 'invalid');
          }
        });
      }
    });
  }

  if (modalClose && successModal) {
    modalClose.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  // --- 12. LOAD PRE-FILL FROM LOCAL STORAGE (ON CONTACT PAGE) ---
  if (currentPath === 'contact.html' && inputStorage && inputMessage) {
    const savedCapacity = localStorage.getItem('est_capacity');
    const savedPlan = localStorage.getItem('est_plan');
    const savedUsers = localStorage.getItem('est_users');
    const savedBilling = localStorage.getItem('est_billing');

    if (savedCapacity) {
      inputStorage.value = savedCapacity;
      validateField('storage');

      inputMessage.value = `Hi, I would like to get a custom quote for our team. We are looking into the "${savedPlan}" tier with a storage capacity requirement of ${savedCapacity} GB and ${savedUsers} user seat licenses, billing cycle term: ${savedBilling}. Please review and advise.`;
      validateField('message');

      if (inputName) {
        inputName.focus();
      }

      localStorage.removeItem('est_capacity');
      localStorage.removeItem('est_plan');
      localStorage.removeItem('est_users');
      localStorage.removeItem('est_billing');
    }
  }

  // --- 13. DASHBOARD SIDEBAR PANEL MOBILE DRAWER TOGGLE ---
  const dbSidebar = document.querySelector('.dashboard-sidebar');
  const dbToggle = document.querySelector('.dashboard-toggle');
  const dbOverlay = document.querySelector('.dashboard-overlay');

  if (dbSidebar && dbToggle) {
    let overlay = dbOverlay;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'dashboard-overlay';
      document.body.appendChild(overlay);
    }

    const openSidebar = () => {
      dbSidebar.classList.add('active');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
      dbSidebar.classList.remove('active');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    };

    dbToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    const sidebarLinks = dbSidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  }

  // --- 14. DYNAMIC DASHBOARD SIDEBAR USER CREDENTIALS ---
  const sidebarUsername = document.querySelector('.sidebar-username');
  const sidebarUserrole = document.querySelector('.sidebar-userrole');
  const sidebarAvatar = document.querySelector('.sidebar-avatar');

  if (sidebarUsername || sidebarAvatar) {
    const email = localStorage.getItem('login_email') || (window.location.pathname.includes('dev-') ? 'elena.rostova@corp.stackly.com' : 'sarah.jenkins@corp.stackly.com');
    const role = localStorage.getItem('login_role') || (window.location.pathname.includes('dev-') ? 'developer' : 'user');

    let displayName = email;
    let avatarPath = 'assets/avatar_sarah.webp';
    let roleTitle = 'Client / User';

    if (role === 'developer') {
      avatarPath = 'assets/avatar_elena.webp';
      roleTitle = 'Developer / Engineer';
    } else if (role === 'admin') {
      avatarPath = 'assets/avatar_david.webp';
      roleTitle = 'System Administrator';
    }

    if (sidebarUsername) {
      sidebarUsername.innerText = displayName;
      sidebarUsername.style.fontSize = '0.78rem';
    }
    if (sidebarUserrole) sidebarUserrole.innerText = roleTitle;
    if (sidebarAvatar) {
      sidebarAvatar.src = avatarPath;
      sidebarAvatar.alt = displayName;
    }
  }

});
