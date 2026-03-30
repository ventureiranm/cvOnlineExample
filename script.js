/**
 * script.js — CV Online · Nicolás Manuel Ventureira
 * ============================================================
 * Funcionalidades:
 *  1. Navbar scroll-aware (fondo + clase .scrolled)
 *  2. Menú hamburger (mobile)
 *  3. Navegación suave + cierre de menú al hacer click en enlace
 *  4. Reveal al hacer scroll (Intersection Observer)
 *  5. Animación de barras de habilidades
 *  6. Validación y simulación de envío del formulario de contacto
 * ============================================================
 */

/* ─────────────────────────────────────────
   1. NAVBAR — Comportamiento al hacer scroll
───────────────────────────────────────── */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  /**
   * Agrega o quita la clase `.scrolled` según la posición del scroll.
   * Con `.scrolled` el navbar recibe fondo oscuro semitransparente.
   */
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Ejecutar una vez al cargar por si la página ya está scrolleada
  onScroll();
})();


/* ─────────────────────────────────────────
   2. MENÚ HAMBURGER (mobile)
───────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  /**
   * Alterna la apertura/cierre del menú móvil
   * usando las clases `.open` en ambos elementos.
   */
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    // Bloquea/desbloquea el scroll del body mientras el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
})();


/* ─────────────────────────────────────────
   3. NAVEGACIÓN SUAVE + CIERRE DE MENÚ
───────────────────────────────────────── */
(function initSmoothNav() {
  const navLinks  = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const links     = document.querySelectorAll('.nav-link');

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      // Cerrar el menú móvil si estuviera abierto
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
})();


/* ─────────────────────────────────────────
   4. REVEAL AL HACER SCROLL (Intersection Observer)
───────────────────────────────────────── */
(function initReveal() {
  /**
   * Usamos Intersection Observer para detectar cuándo
   * cada elemento `.reveal` entra en el viewport
   * y le agregamos la clase `.visible` (definida en CSS).
   */
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observerOptions = {
    root:       null,     // viewport
    rootMargin: '0px',
    threshold:  0.12      // 12% del elemento visible = dispara
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        // Pequeño delay escalonado para elementos en una misma sección
        const delay = (index % 6) * 80; // ms entre cada elemento
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        // Dejar de observar una vez que se hizo visible
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ─────────────────────────────────────────
   5. ANIMACIÓN DE BARRAS DE HABILIDADES
───────────────────────────────────────── */
(function initSkillBars() {
  /**
   * Selecciona todos los elementos <progress class="skill-progress">.
   * Cuando entran en el viewport, se anima su atributo `value`
   * desde 0 hasta el valor final definido en `data-pct`.
   * La transición visual la maneja CSS sobre ::-webkit-progress-value
   * y ::-moz-progress-bar.
   */
  const bars = document.querySelectorAll('.skill-progress');
  if (!bars.length) return;

  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const bar = entry.target;
        // Leer el porcentaje final desde el atributo data-pct del padre .skill-bar-item
        // o desde el aria-label como fallback
        const pct = bar.getAttribute('data-pct') ||
                    parseInt(bar.getAttribute('aria-label')) || 0;
        // Setear value dispara la transición CSS en webkit y moz
        bar.value = pct;
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(function (bar) {
    barObserver.observe(bar);
  });
})();


/* ─────────────────────────────────────────
   6. FORMULARIO DE CONTACTO
───────────────────────────────────────── */
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

  /* ── Helpers ── */

  /**
   * Muestra un mensaje de error para un campo dado.
   * @param {HTMLElement} input   - El input/textarea
   * @param {string}      errorId - ID del span de error
   * @param {string}      msg     - Mensaje a mostrar
   */
  function showError(input, errorId, msg) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) errorSpan.textContent = msg;
    if (input)     input.classList.add('error');
  }

  /**
   * Limpia el mensaje de error de un campo.
   * @param {HTMLElement} input   - El input/textarea
   * @param {string}      errorId - ID del span de error
   */
  function clearError(input, errorId) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) errorSpan.textContent = '';
    if (input)     input.classList.remove('error');
  }

  /**
   * Valida si una cadena es un email válido.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    // Expresión regular básica para email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Valida si una cadena es un número de teléfono válido.
   * Acepta formatos como +54 9 11 1234-5678 o (011) 1234-5678, etc.
   * @param {string} phone
   * @returns {boolean}
   */
  function isValidPhone(phone) {
    // Permite dígitos, espacios, paréntesis, guiones y el signo +
    return /^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim());
  }

  /* ── Validación en tiempo real (blur) ── */

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

  /* ── Validación al enviar ── */

  /**
   * Valida todos los campos del formulario.
   * @returns {boolean} true si todos son válidos.
   */
  function validateForm() {
    let isValid = true;

    // Nombre
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

    // Teléfono (opcional pero validado si se completa)
    if (phoneInput.value.trim() && !isValidPhone(phoneInput.value.trim())) {
      showError(phoneInput, 'phoneError', 'Número de teléfono no válido.');
      isValid = false;
    } else {
      clearError(phoneInput, 'phoneError');
    }

    // Mensaje
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

  /* ── Submit handler ── */

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recarga

    // Ocultar mensaje de éxito previo si existe
    if (successMsg) successMsg.style.display = 'none';

    // Validar formulario
    if (!validateForm()) return;

    /* ── Simular envío ── */
    // Mostrar estado de carga en el botón
    if (btnText)   btnText.style.display   = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';
    if (submitBtn) submitBtn.disabled = true;

    /**
     * Simulamos una llamada a un backend con un setTimeout.
     * En producción, aquí iría un fetch() a la API de backend
     * o un servicio como EmailJS / Formspree.
     */
    setTimeout(function () {
      // Restaurar botón
      if (btnText)   btnText.style.display   = 'inline';
      if (btnLoader) btnLoader.style.display  = 'none';
      if (submitBtn) submitBtn.disabled = false;

      // Mostrar mensaje de éxito
      if (successMsg) successMsg.style.display = 'flex';

      // Limpiar formulario
      form.reset();

      // Scroll suave al mensaje de éxito
      if (successMsg) {
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Ocultar mensaje de éxito después de 6 segundos
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

    }, 1800); // 1.8 segundos de "carga"
  });

})();


/* ─────────────────────────────────────────
   EXTRA: Resaltar enlace de nav activo
   según sección visible en pantalla
───────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  /**
   * Detecta qué sección está visible y resalta
   * el enlace correspondiente en la navbar.
   */
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
