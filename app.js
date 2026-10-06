/* ==========================================================================
   BALLER & CO. | The Footballers' Barber Lounge
   Interactive Logic & Match Ticket Engine (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Default Date to Today
  const dateInput = document.getElementById('matchDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 3. Navbar Sticky Blur Effect on Scroll
  const navbar = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 4. Gallery Filter Tabs
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // 5. Input Listeners to Live-Update Ticket
  const liveInputs = ['playerName', 'playerPhone', 'matchDate', 'matchTime'];
  liveInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', updateTicketSummary);
      input.addEventListener('change', updateTicketSummary);
    }
  });

  // 6. Stadium Ambient Sound Generator (Web Audio API)
  setupStadiumAudio();

  // Initial ticket state update
  updateTicketSummary();
});

/* --- Select Service from Cards --- */
window.selectServiceForBooking = function (serviceName, price, duration) {
  const serviceSelect = document.getElementById('serviceSelect');
  if (serviceSelect) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value === serviceName) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  updateTicketSummary();
  showToast(`¡«${serviceName}» asignado a tu convocatoria!`);

  // Smooth scroll to booking form
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
  }
};

/* --- Select Barber from FUT Cards --- */
window.selectBarberForBooking = function (barberName) {
  const barberRadios = document.querySelectorAll('input[name="barberChoice"]');
  barberRadios.forEach(radio => {
    if (radio.value === barberName) {
      radio.checked = true;
    }
  });

  updateTicketSummary();
  showToast(`¡DT ${barberName} asignado al banquillo!`);

  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
  }
};

/* --- Live Ticket Calculation & DOM Update --- */
window.updateTicketSummary = function () {
  // Service
  const serviceSelect = document.getElementById('serviceSelect');
  const ticketServiceName = document.getElementById('ticketServiceName');
  let basePrice = 25;
  let serviceText = 'EL GALÁCTICO SKIN FADE';

  if (serviceSelect && serviceSelect.selectedIndex > 0) {
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    serviceText = selectedOption.value.toUpperCase();
    basePrice = parseFloat(selectedOption.getAttribute('data-price')) || 25;
  }
  if (ticketServiceName) ticketServiceName.textContent = serviceText;

  // Player Name
  const playerNameInput = document.getElementById('playerName');
  const ticketPlayer = document.getElementById('ticketPlayerName');
  if (ticketPlayer) {
    ticketPlayer.textContent = (playerNameInput && playerNameInput.value.trim()) 
      ? playerNameInput.value.trim().toUpperCase() 
      : 'CRACK INVITADO';
  }

  // Barber
  const selectedBarber = document.querySelector('input[name="barberChoice"]:checked');
  const ticketBarber = document.getElementById('ticketBarberName');
  if (ticketBarber && selectedBarber) {
    ticketBarber.textContent = selectedBarber.value.split('«')[0].trim();
  }

  // Date
  const dateInput = document.getElementById('matchDate');
  const ticketDate = document.getElementById('ticketDate');
  if (ticketDate) {
    if (dateInput && dateInput.value) {
      const parts = dateInput.value.split('-');
      ticketDate.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
    } else {
      ticketDate.textContent = 'HOY';
    }
  }

  // Time
  const timeSelect = document.getElementById('matchTime');
  const ticketTime = document.getElementById('ticketTime');
  if (ticketTime && timeSelect) {
    ticketTime.textContent = timeSelect.value || '10:00 AM';
  }

  // Extras
  let extrasTotal = 0;
  const extrasNames = [];
  const extraCheckboxes = [
    { id: 'extraRayita', name: 'Rayita' },
    { id: 'extraMascarilla', name: 'Mascarilla' },
    { id: 'extraCeja', name: 'Ceja' }
  ];

  extraCheckboxes.forEach(item => {
    const el = document.getElementById(item.id);
    if (el && el.checked) {
      const p = parseFloat(el.getAttribute('data-extra-price')) || 0;
      extrasTotal += p;
      extrasNames.push(item.name);
    }
  });

  const ticketExtrasSummary = document.getElementById('ticketExtrasSummary');
  if (ticketExtrasSummary) {
    ticketExtrasSummary.textContent = extrasNames.length > 0 
      ? `+ Extras: ${extrasNames.join(', ')} (+$${extrasTotal})`
      : 'Sin adicionales';
  }

  // Total Price
  const finalTotal = basePrice + extrasTotal;
  const ticketTotalPrice = document.getElementById('ticketTotalPrice');
  if (ticketTotalPrice) {
    ticketTotalPrice.textContent = `$${finalTotal} USD`;
  }
};

/* --- Booking Submit & WhatsApp Dispatch --- */
window.handleBookingSubmit = function (event) {
  event.preventDefault();

  const name = document.getElementById('playerName')?.value || 'Crack';
  const phone = document.getElementById('playerPhone')?.value || '';
  const service = document.getElementById('serviceSelect')?.value || 'El Galáctico Skin Fade';
  const barber = document.querySelector('input[name="barberChoice"]:checked')?.value || 'Primer DT Disponible';
  const date = document.getElementById('matchDate')?.value || 'Hoy';
  const time = document.getElementById('matchTime')?.value || '10:00 AM';
  const price = document.getElementById('ticketTotalPrice')?.textContent || '$25 USD';

  const message = `⚽ *CONVOCATORIA VIP - BALLER & CO. Barber Lounge*\n\n` +
    `👤 *Jugador:* ${name}\n` +
    `📱 *WhatsApp:* ${phone}\n` +
    `✂️ *Jugada/Corte:* ${service}\n` +
    `💈 *Director Técnico:* ${barber}\n` +
    `📅 *Fecha:* ${date}\n` +
    `⏰ *Horario del Match:* ${time}\n` +
    `💳 *Total Estimado:* ${price}\n\n` +
    `¡Quiero confirmar mi turno en el vestuario! 🔥`;

  showToast('¡Generando Ticket Oficial! Redirigiendo...');

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 800);
};

/* --- Toast Notification Helper --- */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = message;
  toast.classList.add('toast-show');

  setTimeout(() => {
    toast.classList.remove('toast-show');
  }, 3500);
}

/* --- Web Audio Stadium Atmosphere Generator --- */
function setupStadiumAudio() {
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');
  if (!audioBtn) return;

  let isPlaying = false;
  let audioCtx = null;
  let noiseNode = null;
  let filterNode = null;
  let gainNode = null;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      // Start audio
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // White noise buffer for ambient stadium crowd murmur
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Bandpass filter to simulate muffled stadium crowd cheering roar
        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'bandpass';
        filterNode.frequency.value = 450;
        filterNode.Q.value = 3.0;

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

        noiseNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseNode.start();
        isPlaying = true;

        if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high text-turf';
        if (audioLabel) audioLabel.textContent = 'Estadio: ON';
        showToast('🔊 Sonido ambiental de estadio activado');
      } catch (e) {
        console.warn('Audio Context not allowed without direct interaction', e);
      }
    } else {
      // Stop audio
      if (noiseNode) {
        noiseNode.stop();
        noiseNode.disconnect();
      }
      if (audioCtx) {
        audioCtx.close();
      }
      isPlaying = false;
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
      if (audioLabel) audioLabel.textContent = 'Ambiente: OFF';
      showToast('🔇 Sonido de estadio silenciado');
    }
  });
}
