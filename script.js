// Refresh starts at the opening instead of restoring a previous scroll or anchor.
const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
if (isRefresh) {
  history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(history.state, '', location.href.split('#')[0]);
  window.scrollTo({ top: 0, behavior: 'instant' });
  window.addEventListener('pageshow', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, { once: true });
}

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
  caption: figure.querySelector('h3').textContent,
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

// Keep the footer current each year.
document.querySelector('#year').textContent = new Date().getFullYear();


// Motion follows scroll position instead of restarting timed animations.
const motionTargets = [];
let scrollFrame = 0;
const entranceAnimations = [];

function addReveal(element, style = 'up', delay = 0) {
  element.classList.add('reveal');
  element.dataset.reveal = style;
  element.dataset.delay = delay;
  motionTargets.push(element);
}

// Keep the original text and emphasis intact when grouping heading lines.
document.querySelectorAll('main h2, .statement-title').forEach(heading => {
  const nodes = [...heading.childNodes];
  heading.replaceChildren();
  let line = document.createElement('span');
  line.className = 'heading-line';
  heading.append(line);
  nodes.forEach(node => {
    if (node.nodeName === 'BR') {
      line = document.createElement('span');
      line.className = 'heading-line';
      heading.append(line);
    } else {
      line.append(node);
    }
  });
  [...heading.children].forEach((element, index) => addReveal(element, 'up', index * 220));
});

addReveal(document.querySelector('.header'), 'down');
addReveal(document.querySelector('.hero-image'), 'portrait', 100);
addReveal(document.querySelector('.hero-copy > p'), 'up', 180);
[...document.querySelector('h1').children].forEach((line, index) => addReveal(line, 'up', 450 + index * 240));
addReveal(document.querySelector('.hero-bottom'), 'up', 1000);

// Each group is staggered locally, so scrolling never starts a long queue.
const textGroups = [
  '.intro > .eyebrow', '.intro-bottom > *', '.section-heading > div > *',
  '.portfolio-note > *', '.statement > .eyebrow', '.statement > .text-link',
  '.about-copy > p, .about-copy > a', '.contact > .eyebrow',
  '.contact-bottom > *', 'footer > *',
];
textGroups.forEach(selector => {
  document.querySelectorAll(selector).forEach((element, index) => addReveal(element, 'up', (index % 3) * 170));
});
figures.forEach((figure, index) => {
  addReveal(figure.querySelector('.photo-button'), index % 2 ? 'right' : 'left');
  addReveal(figure.querySelector('figcaption'), 'up', 160);
});
addReveal(document.querySelector('.about-photo'), 'left');


// The opening plays once. Everything below it follows scroll continuously.
const openingTargets = motionTargets.filter(element => element.closest('.hero, .header'));
const scrollTargets = motionTargets.filter(element => !openingTargets.includes(element));
const previousY = new WeakMap();

function applyProgress(element, progress) {
  const remaining = 1 - progress;
  const direction = element.dataset.reveal;
  const x = direction === 'left' ? -60 * remaining : direction === 'right' ? 60 * remaining : 0;
  const y = direction === 'up' ? 65 * remaining : 0;
  previousY.set(element, y);
  element.style.opacity = String(progress);
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  element.style.clipPath = ['left', 'right'].includes(direction)
    ? `inset(0 ${direction === 'left' ? 14 * remaining : 0}% 0 ${direction === 'right' ? 14 * remaining : 0}%)`
    : 'none';
}

function updateScrollMotion() {
  scrollFrame = 0;
  const viewportHeight = window.innerHeight;
  const maximumScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
  // Read all positions first, then write styles to avoid repeated layout work.
  const positions = scrollTargets.map(element => ({
    element,
    top: element.getBoundingClientRect().top + window.scrollY - (previousY.get(element) || 0),
  }));
  positions.forEach(({ element, top }) => {
    const stagger = Number(element.dataset.delay) * .12;
    const end = Math.min(top - viewportHeight * .63 + stagger, maximumScroll);
    const start = Math.min(top - viewportHeight * .96 + stagger, end - 100);
    let progress = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
    // Keep a focused control visible, even near the edge of the screen.
    if (element.contains(document.activeElement)) progress = 1;
    const eased = progress * progress * (3 - 2 * progress);
    applyProgress(element, eased);
  });
}

function scheduleScrollMotion() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollMotion);
}

function playOpening() {
  entranceAnimations.forEach(animation => animation.cancel());
  entranceAnimations.length = 0;
  openingTargets.forEach(element => {
    const portrait = element.dataset.reveal === 'portrait';
    const animation = element.animate([
      { opacity: 0, transform: portrait ? 'scale(1.06)' : 'translateY(45px)' },
      { opacity: 1, transform: 'none' },
    ], {
      duration: portrait ? 1800 : 1300,
      delay: Number(element.dataset.delay),
      easing: 'cubic-bezier(.25, .1, .25, 1)',
      fill: 'backwards',
    });
    entranceAnimations.push(animation);
  });
}

function configureMotion(playEntrance = false) {
  updateScrollMotion();
  if (playEntrance) playOpening();
}
window.addEventListener('scroll', scheduleScrollMotion, { passive: true });
window.addEventListener('resize', scheduleScrollMotion);
document.addEventListener('focusin', scheduleScrollMotion);
document.addEventListener('focusout', scheduleScrollMotion);
// Image and font loading can shift positions without a scroll event.
window.addEventListener('load', scheduleScrollMotion);
document.fonts?.ready.then(scheduleScrollMotion);
document.querySelector('.motion-replay').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  configureMotion(true);
});
configureMotion(true);
