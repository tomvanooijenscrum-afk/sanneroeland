const header = document.querySelector('.header');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu +';
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Sluiten −' : 'Menu +';
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menu.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

function preparePhoto(img) {
  const fallback = () => {
    const placeholder = document.createElement('div');
    placeholder.className = 'photo-placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', 'Het portret van Sanne wordt binnenkort toegevoegd');
    placeholder.innerHTML = '<span class="placeholder-monogram" aria-hidden="true">sr.</span><span>Het portret volgt binnenkort</span>';
    img.replaceWith(placeholder);
  };
  img.addEventListener('error', fallback, { once: true });
  if (img.complete && img.naturalWidth === 0) fallback();
}
const figures = [...document.querySelectorAll('.portfolio-item')];
const photos = figures.map(figure => ({
  image: figure.querySelector('img').cloneNode(true),
  caption: figure.querySelector('figcaption span').textContent,
}));
document.querySelectorAll('img').forEach(preparePhoto);

const dialog = document.createElement('dialog');
dialog.className = 'lightbox';
dialog.setAttribute('aria-label', 'Fotoviewer');
dialog.innerHTML = '<button class="lightbox-close" aria-label="Fotoviewer sluiten" autofocus>Sluiten <span aria-hidden="true">×</span></button><div class="lightbox-photo"></div><div class="lightbox-bottom"><button aria-label="Vorige foto">←</button><p aria-live="polite"></p><button aria-label="Volgende foto">→</button></div>';
document.body.append(dialog);
let selected = 0;
let trigger;
let oldOverflow;
const buttons = [...dialog.querySelectorAll('button')];
function displayPhoto(index) {
  selected = (index + photos.length) % photos.length;
  const photo = photos[selected];
  const img = photo.image.cloneNode(true);
  img.loading = 'eager';
  dialog.querySelector('.lightbox-photo').replaceChildren(img);
  preparePhoto(img);
  const caption = dialog.querySelector('p');
  caption.textContent = photo.caption;
  const counter = document.createElement('small');
  counter.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')} · Tijdelijk beeld`;
  caption.append(counter);
}
figures.forEach((figure, index) => {
  figure.querySelector('button').addEventListener('click', event => {
    trigger = event.currentTarget;
    displayPhoto(index);
    oldOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    buttons[0].focus();
  });
});
buttons[0].addEventListener('click', () => dialog.close());
buttons[1].addEventListener('click', () => displayPhoto(selected - 1));
buttons[2].addEventListener('click', () => displayPhoto(selected + 1));
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = oldOverflow;
  trigger?.focus();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    displayPhoto(selected + (event.key === 'ArrowLeft' ? -1 : 1));
  }
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === buttons[0]) {
      event.preventDefault();
      buttons[2].focus();
    } else if (!event.shiftKey && document.activeElement === buttons[2]) {
      event.preventDefault();
      buttons[0].focus();
    }
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  document.querySelector('.hero').style.setProperty('--parallax',
    !reducedMotion.matches && window.innerWidth > 900 ? `${Math.min(window.scrollY * 0.045, 22)}px` : '0px');
  frame = 0;
}
window.addEventListener('scroll', () => {
  if (!frame) frame = requestAnimationFrame(updateScroll);
}, { passive: true });
window.addEventListener('resize', updateScroll);
reducedMotion.addEventListener('change', updateScroll);
updateScroll();
