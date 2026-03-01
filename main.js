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

// open modal when clicking on expand button only
function openModal(img) { 
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = img.src;
  modal.style.display = "flex";
  document.body.classList.add("modal-open");
}

// close modal
function closeModal() {
  document.getElementById("imageModal").style.display = "none";
  document.body.classList.remove("modal-open");
}

// close when clicking outside of the image 
document.getElementById("imageModal").addEventListener("click", function(event) {
  if (event.target.id === "imageModal") {
    closeModal();
  }
});

// close when clicking the X button
const closeBtn = document.querySelector(".modal-close");
if (closeBtn) {
  closeBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    closeModal();
  });
}

// close with Escape key
document.addEventListener("keydown", function(event) {
  const modal = document.getElementById("imageModal");
  if (event.key === "Escape" && modal && modal.style.display === "flex") {
    closeModal();
  }
});
