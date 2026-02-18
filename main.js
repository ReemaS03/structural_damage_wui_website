// show "back to top" after user scrolls a bit
const btn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    btn.style.display = 'flex';
  } else {
    btn.style.display = 'none';
  }
});

// navbar offset for scroll-margin-top in CSS depdending on window size
function setNavOffset() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const h = nav.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--nav-offset', `${h}px`);
}

window.addEventListener('load', setNavOffset);
window.addEventListener('resize', setNavOffset);
