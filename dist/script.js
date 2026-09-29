const dialog = document.querySelector('#lightbox');
let touchStartX = null;
let touchStartY = null;
dialog.addEventListener('touchstart', event => {
  if (event.touches.length !== 1) return;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, {passive: true});
dialog.addEventListener('touchend', event => {
  if (touchStartX === null || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  const dy = event.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(selectedPhoto + (dx < 0 ? 1 : -1));
  touchStartX = null; touchStartY = null;
}, {passive: true});
const photos = [...document.querySelectorAll('.gallery-card')];
let selectedPhoto = 0;
function showPhoto(index) {
  selectedPhoto = (index + photos.length) % photos.length;
  const photo = photos[selectedPhoto];
  document.querySelector('#large-photo').src = photo.dataset.image;
  document.querySelector('#large-photo').alt = photo.querySelector('img').alt;
  document.querySelector('#photo-caption').textContent = photo.dataset.caption;
  document.querySelector('#photo-count').textContent = `${selectedPhoto + 1} / ${photos.length}`;
}
photos.forEach((button, index) => button.addEventListener('click', () => { showPhoto(index); dialog.showModal(); }));
document.querySelector('#previous-photo').addEventListener('click', () => showPhoto(selectedPhoto - 1));
document.querySelector('#next-photo').addEventListener('click', () => showPhoto(selectedPhoto + 1));
document.querySelector('#close-gallery').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); showPhoto(selectedPhoto + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
document.querySelectorAll('[data-session]').forEach(link => link.addEventListener('click', () => { document.querySelector('#session').value = link.dataset.session; }));
const today = new Date();
document.querySelector('#date').min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
document.querySelector('#enquiry').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  if (!name) { form.elements.name.setCustomValidity('Please enter your name.'); form.elements.name.reportValidity(); return; }
  const date = form.elements.date.value;
  const message = [
    `Hello Maha Siri 3D Kids Studio! I’m ${name}.`,
    `Session: ${form.elements.session.value}`,
    `Who’s joining: ${form.elements.people.value}`,
    form.elements.age.value ? `Child’s age: ${form.elements.age.value}` : '',
    date ? `Preferred date: ${date}` : '',
    form.elements.message.value.trim(),
    'Please share availability, packages, and what is included.'
  ].filter(Boolean).join('\n');
  const url = `https://wa.me/919247284575?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
  const status = document.querySelector('#form-status');
  status.replaceChildren(document.createTextNode('Continue in WhatsApp to review and send your message. '));
  const fallback = document.createElement('a');
  fallback.href = url; fallback.target = '_blank'; fallback.rel = 'noopener';
  fallback.textContent = 'Open WhatsApp'; fallback.style.textDecoration = 'underline';
  status.append(fallback);
});
document.querySelector('#name').addEventListener('input', event => event.target.setCustomValidity(''));
const art = document.querySelector('#hero-art');
if (art && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const photo = art.querySelector('.hero-photo');
  const back = art.querySelector('.photo-back');
  const stamp = art.querySelector('.stamp');
  const tilt = event => {
    const r = art.getBoundingClientRect();
    const x = (event.clientX - r.left - r.width / 2) / r.width;
    const y = (event.clientY - r.top - r.height / 2) / r.height;
    photo.style.transform = `rotate(-4deg) rotateY(${x * 14}deg) rotateX(${y * -12}deg)`;
    back.style.transform = `translateZ(-34px) rotate(${7 + x * 4}deg) translate(${x * -5}px,${y * -4}px)`;
    stamp.style.transform = `translateZ(52px) rotate(${12 + x * 6}deg) translate(${x * 8}px,${y * 6}px)`;
  };
  const reset = () => {
    photo.style.transform = 'rotate(-4deg)';
    back.style.transform = 'translateZ(-34px) rotate(7deg)';
    stamp.style.transform = 'translateZ(52px) rotate(12deg)';
  };
  art.addEventListener('pointermove', tilt);
  art.addEventListener('pointerleave', reset);
  art.addEventListener('pointercancel', reset);
}

// Premium entrance and gentle depth motion powered by Anime.js.
if (window.anime && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.anime.timeline({easing: 'easeOutExpo'})
    .add({targets: '.hero-copy', opacity: [0, 1], translateY: [28, 0], duration: 950})
    .add({targets: '.hero-art', opacity: [0, 1], scale: [.94, 1], translateY: [22, 0], duration: 1100}, '-=720');
  window.anime({targets: '.hero-glow', scale: [.94, 1.06], opacity: [.55, .9], duration: 3200, direction: 'alternate', loop: true, easing: 'easeInOutSine'});
}

// Horizontal gallery reel: swipe/scroll manually or let it advance automatically.
const galleryRail = document.querySelector('.gallery-grid');
if (galleryRail) {
  const galleryCards = [...galleryRail.querySelectorAll('.gallery-card')];
  let galleryIndex = 0;
  let galleryTimer;
  let galleryPausedByForm = false;
  const stopGallery = () => { clearInterval(galleryTimer); };
  const startGallery = () => {
    if (galleryPausedByForm || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopGallery();
    galleryTimer = setInterval(() => {
      galleryIndex = (galleryIndex + 1) % galleryCards.length;
      const card = galleryCards[galleryIndex];
      const left = card.offsetLeft - (galleryRail.clientWidth - card.offsetWidth) / 2;
      galleryRail.scrollTo({left: Math.max(0, left), behavior: 'smooth'});
    }, 4200);
  };
  galleryRail.addEventListener('pointerenter', stopGallery);
  galleryRail.addEventListener('pointerleave', startGallery);
  galleryRail.addEventListener('touchstart', stopGallery, {passive: true});
  galleryRail.addEventListener('touchend', () => setTimeout(startGallery, 2800), {passive: true});
  document.querySelector('#enquiry')?.addEventListener('focusin', () => { galleryPausedByForm = true; stopGallery(); });
  startGallery();
}

// Animate complete frames rather than zooming or cropping the photographs.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let stopScrollEffects = () => {};
function configureScrollEffects() {
  stopScrollEffects();
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  const animations = new Set();
  const revealTargets = [...document.querySelectorAll('.hero-copy, .hero-art, .section-head, .gallery-card, .sessions > div, .steps article, .faq > div, .contact > div, #enquiry, .visit > div')];
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      if (typeof entry.target.animate !== 'function') return;
      const siblings = [...entry.target.parentElement.children];
      const stagger = entry.target.matches('.gallery-card, .steps article') ? (siblings.indexOf(entry.target) % 3) * 90 : 0;
      const animation = entry.target.animate([
        {opacity: 0.12, transform: 'translateY(26px)'},
        {opacity: 1, transform: 'translateY(0)'}
      ], {duration: 720, delay: stagger, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'});
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -24px 0px'});
  revealTargets.forEach(target => revealObserver.observe(target));

  const frames = [...document.querySelectorAll('.hero-art, .gallery-card')];
  const visibleFrames = new Set();
  let pendingFrame = 0;
  function updateFrames() {
    pendingFrame = 0;
    const viewport = window.innerHeight;
    const distance = window.innerWidth <= 760 ? 7 : 15;
    const positions = [...visibleFrames].map(frame => {
      const rect = frame.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewport / 2) / viewport));
      return [frame, -progress * distance];
    });
    positions.forEach(([frame, offset]) => { frame.style.translate = `0 ${offset.toFixed(2)}px`; });
  }
  function requestFrame() {
    if (!pendingFrame) pendingFrame = requestAnimationFrame(updateFrames);
  }
  const frameObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleFrames.add(entry.target);
      else visibleFrames.delete(entry.target);
    });
    requestFrame();
  }, {rootMargin: '80px 0px'});
  frames.forEach(frame => frameObserver.observe(frame));
  window.addEventListener('scroll', requestFrame, {passive: true});
  window.addEventListener('resize', requestFrame, {passive: true});
  stopScrollEffects = () => {
    revealObserver.disconnect(); frameObserver.disconnect();
    cancelAnimationFrame(pendingFrame);
    window.removeEventListener('scroll', requestFrame);
    window.removeEventListener('resize', requestFrame);
    animations.forEach(animation => animation.cancel());
    frames.forEach(frame => { frame.style.translate = ''; });
  };
}
configureScrollEffects();
motionPreference.addEventListener('change', configureScrollEffects);
