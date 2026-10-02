/* ==========================================================================
   CHARLY BARBER SHOP - BOTÓN FLOTANTE DE WHATSAPP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const whatsappWrapper = document.querySelector('.whatsapp-btn-wrapper');

  if (whatsappWrapper) {
    // 1. ANIMACIÓN DE ENTRADA DESPUÉS DE 2 SEGUNDOS
    setTimeout(() => {
      whatsappWrapper.classList.add('bounce-active');
    }, 2000);

    // 2. CONFIGURACIÓN DEL ENLACE DE WHATSAPP (CONVERSIÓN DIRECTA)
    const whatsappLink = whatsappWrapper.querySelector('.whatsapp-link');
    if (whatsappLink) {
      const phoneNumber = '5215512345678'; // Reemplazar por el número real de Charly Barber Shop
      const defaultMessage = 'Hola, quiero información sobre sus servicios de barbería y agendar una cita.';
      const encodedMessage = encodeURIComponent(defaultMessage);
      
      whatsappLink.setAttribute('href', `https://wa.me/${phoneNumber}?text=${encodedMessage}`);
      whatsappLink.setAttribute('target', '_blank');
      whatsappLink.setAttribute('rel', 'noopener noreferrer');
    }
  }
});
