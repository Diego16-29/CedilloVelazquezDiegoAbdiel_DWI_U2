/* ==========================================================================
   CHARLY BARBER SHOP - FILTRADO DE GALERÍA Y LIGHTBOX (PREMIUM)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (!galleryItems.length) return; // Salir si no hay galería en la página actual

  // 1. FILTRADO DE GALERÍA CON ANIMACIÓN SUAVE
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Activar botón seleccionado
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          // Mostrar elemento animando la escala y opacidad
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Ocultar elemento
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          // Agregar hidden después de que finalice la transición
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  // 2. LÓGICA DE LIGHTBOX MODAL CON ANTERIOR / SIGUIENTE
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let currentImages = []; // Subconjunto filtrado activo
    let currentIndex = 0;

    // Abrir Lightbox al hacer clic en un elemento de galería
    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obtener solo las imágenes que están visibles actualmente (aplicando filtros)
        currentImages = Array.from(galleryItems).filter(img => !img.classList.contains('hidden'));
        
        // Encontrar índice del elemento cliqueado en el conjunto visible
        currentIndex = currentImages.indexOf(item);

        if (currentIndex !== -1) {
          openLightbox();
          updateLightboxContent();
        }
      });
    });

    function openLightbox() {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restaurar scroll
    }

    function updateLightboxContent() {
      if (currentImages.length === 0 || currentIndex === -1) return;
      
      const currentItem = currentImages[currentIndex];
      const imgSource = currentItem.querySelector('img').getAttribute('src');
      const itemTitle = currentItem.querySelector('.gallery-title').innerText;

      // Animación rápida de cambio de contenido
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.95)';

      setTimeout(() => {
        lightboxImg.setAttribute('src', imgSource);
        lightboxTitle.innerText = itemTitle;
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 200);
    }

    // Navegación - Siguiente Imagen
    function showNext() {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateLightboxContent();
    }

    // Navegación - Imagen Anterior
    function showPrev() {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateLightboxContent();
    }

    // Eventos de botones del Lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);

    // Cerrar al hacer clic en el fondo oscuro
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });

    // Control por Teclado (Accesibilidad Premium)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    });
  }
});
