/* ==========================================================================
   CHARLY BARBER SHOP - LÓGICA PRINCIPAL (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. PRELOADER ELEGANTE
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Activar animaciones del Hero una vez que se retira el preloader
        document.querySelectorAll('.hero-content > *').forEach((el, index) => {
          el.classList.add(`hero-animation-${index + 1}`);
        });
      }, 500); // Pequeña demora para asegurar suavidad visual
    });
  }

  // 2. CURSOR PERSONALIZADO (SOLO PARA PANTALLAS DESKTOP)
  const isTouchDevice = () => {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  };

  if (!isTouchDevice()) {
    // Agregar clase que activa cursor personalizado en estilos
    document.body.classList.add('custom-cursor-active');

    // Crear elementos del cursor dinámicamente si no existen
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'custom-cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    // Actualizar coordenadas objetivo del ratón
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Animar el círculo exterior con un ligero delay para efecto orgánico
    const animateCursor = () => {
      const delay = 8; // Factor de retraso
      outlineX += (mouseX - outlineX) / delay;
      outlineY += (mouseY - outlineY) / delay;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Detección de elementos interactivos para ampliar el cursor (efecto zoom)
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, select, textarea, .gallery-item, .clickable');
    interactiveElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover-active');
      });
      elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover-active');
      });
    });
  }

  // 3. BARRA DE PROGRESO DE SCROLL
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (windowScroll / height) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  // 4. NAVBAR COMPACTO AL SCROLL
  const headerNav = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerNav.classList.add('scroll-scrolled');
    } else {
      headerNav.classList.remove('scroll-scrolled');
    }
  });

  // 5. MENÚ HAMBURGUESA RESPONSIVO
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 6. DETECCIÓN DE NAVEGACIÓN ACTIVA EN SCROLL
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100; // Offset para el header fijo
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  });

  // 7. ANIMACIONES AL DESPLAZARSE (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Dejar de observar una vez animado
        }
      });
    }, {
      threshold: 0.15, // Porcentaje de visibilidad requerido
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback si el navegador no tiene soporte para IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 8. CONTADORES ANIMADOS EN "SOBRE NOSOTROS"
  const statsSection = document.querySelector('.stats-grid');
  const statsNumbers = document.querySelectorAll('.stat-number');
  let statsStarted = false;

  const startCounters = () => {
    statsNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const increment = target / 100; // Velocidad de subida
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          stat.innerText = Math.ceil(current);
          setTimeout(updateCounter, 15);
        } else {
          stat.innerText = target + (stat.getAttribute('data-suffix') || '');
        }
      };
      
      updateCounter();
    });
  };

  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsStarted) {
          statsStarted = true;
          startCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  } else if (statsSection) {
    // Fallback
    startCounters();
  }

  // 9. VALIDACIÓN DEL FORMULARIO DE CONTACTO
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Limpiar feedback anterior
      formFeedback.style.display = 'none';
      formFeedback.className = 'form-feedback';

      // Obtener valores
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validar obligatoriedad
      if (!name || !email || !phone || !message) {
        showFeedback('Por favor, completa todos los campos del formulario.', 'error');
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback('Por favor, ingresa un correo electrónico válido.', 'error');
        return;
      }

      // Simulación de envío exitoso
      showFeedback('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
      contactForm.reset();
    });

    function showFeedback(message, type) {
      formFeedback.innerText = message;
      formFeedback.classList.add(type);
      formFeedback.style.display = 'block';
    }
  }

  // 10. PARALLAX EN HERO
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      // Desplazamiento más lento para simular profundidad
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.4}px)`;
    });
  }
});
