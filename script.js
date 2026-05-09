(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;


  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  
  onScroll();
})();



(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

 
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
})();



(function initSmoothNav() {
  const navLinks  = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const links     = document.querySelectorAll('.nav-link');

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
})();



(function initReveal() {
  
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observerOptions = {
    root:       null,     
    rootMargin: '0px',
    threshold:  0.12      
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
      
        const delay = (index % 6) * 80;
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();



(function initSkillBars() {
 

  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const target = entry.target;
        const pct    = target.getAttribute('data-pct') || '0';
        
        target.style.width = pct + '%';
        barObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(function (fill) {
    barObserver.observe(fill);
  });
})();



(function initContactForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const phoneInput   = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const submitBtn    = document.getElementById('submitBtn');
  const btnLoader    = document.getElementById('btnLoader');
  const btnText      = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const successMsg   = document.getElementById('formSuccess');

 
  function showError(input, errorId, msg) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) errorSpan.textContent = msg;
    if (input)     input.classList.add('error');
  }

 
  function clearError(input, errorId) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) errorSpan.textContent = '';
    if (input)     input.classList.remove('error');
  }


  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

 
  function isValidPhone(phone) {
   
    return /^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim());
  }

  

  if (nameInput) {
    nameInput.addEventListener('blur', function () {
      if (!this.value.trim()) {
        showError(this, 'nameError', 'El nombre es obligatorio.');
      } else if (this.value.trim().length < 3) {
        showError(this, 'nameError', 'Debe tener al menos 3 caracteres.');
      } else {
        clearError(this, 'nameError');
      }
    });
    nameInput.addEventListener('input', function () {
      if (this.value.trim().length >= 3) clearError(this, 'nameError');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', function () {
      if (!this.value.trim()) {
        showError(this, 'emailError', 'El email es obligatorio.');
      } else if (!isValidEmail(this.value.trim())) {
        showError(this, 'emailError', 'Ingresá un email válido.');
      } else {
        clearError(this, 'emailError');
      }
    });
    emailInput.addEventListener('input', function () {
      if (isValidEmail(this.value.trim())) clearError(this, 'emailError');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', function () {
      const val = this.value.trim();
      if (val && !isValidPhone(val)) {
        showError(this, 'phoneError', 'Número de teléfono no válido.');
      } else {
        clearError(this, 'phoneError');
      }
    });
    phoneInput.addEventListener('input', function () {
      if (!this.value.trim() || isValidPhone(this.value.trim())) {
        clearError(this, 'phoneError');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', function () {
      if (!this.value.trim()) {
        showError(this, 'messageError', 'El mensaje no puede estar vacío.');
      } else if (this.value.trim().length < 10) {
        showError(this, 'messageError', 'El mensaje debe tener al menos 10 caracteres.');
      } else {
        clearError(this, 'messageError');
      }
    });
    messageInput.addEventListener('input', function () {
      if (this.value.trim().length >= 10) clearError(this, 'messageError');
    });
  }

 
  function validateForm() {
    let isValid = true;

   
    if (!nameInput.value.trim()) {
      showError(nameInput, 'nameError', 'El nombre es obligatorio.');
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      showError(nameInput, 'nameError', 'Debe tener al menos 3 caracteres.');
      isValid = false;
    } else {
      clearError(nameInput, 'nameError');
    }

    // Email
    if (!emailInput.value.trim()) {
      showError(emailInput, 'emailError', 'El email es obligatorio.');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'emailError', 'Ingresá un email válido.');
      isValid = false;
    } else {
      clearError(emailInput, 'emailError');
    }

    
    if (phoneInput.value.trim() && !isValidPhone(phoneInput.value.trim())) {
      showError(phoneInput, 'phoneError', 'Número de teléfono no válido.');
      isValid = false;
    } else {
      clearError(phoneInput, 'phoneError');
    }

  
    if (!messageInput.value.trim()) {
      showError(messageInput, 'messageError', 'El mensaje no puede estar vacío.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'messageError', 'El mensaje debe tener al menos 10 caracteres.');
      isValid = false;
    } else {
      clearError(messageInput, 'messageError');
    }

    return isValid;
  }



  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recarga

   
    if (successMsg) successMsg.style.display = 'none';

    
    if (!validateForm()) return;

   
    if (btnText)   btnText.style.display   = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';
    if (submitBtn) submitBtn.disabled = true;

    
    setTimeout(function () {
     
      if (btnText)   btnText.style.display   = 'inline';
      if (btnLoader) btnLoader.style.display  = 'none';
      if (submitBtn) submitBtn.disabled = false;

      
      if (successMsg) successMsg.style.display = 'flex';

     
      form.reset();

      
      if (successMsg) {
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      
      setTimeout(function () {
        if (successMsg) {
          successMsg.style.opacity = '0';
          successMsg.style.transition = 'opacity 0.5s ease';
          setTimeout(function () {
            successMsg.style.display  = 'none';
            successMsg.style.opacity  = '';
            successMsg.style.transition = '';
          }, 500);
        }
      }, 6000);

    }, 1800);
  });

})();



(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
})();
