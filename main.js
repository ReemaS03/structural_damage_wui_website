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

// Fire x Model Demo
const fireSelect = document.getElementById("fireSelect");
const modelSelect = document.getElementById("modelSelect");

const demoEmpty = document.getElementById("demoEmpty");
const demoImageWrap = document.getElementById("demoImageWrap");
const demoImage = document.getElementById("demoImage");
const demoText = document.getElementById("demoText");

const demoFireName = document.getElementById("demoFireName");
const demoFireType = document.getElementById("demoFireType");
const demoModelName = document.getElementById("demoModelName");

const demoFireF1 = document.getElementById("demoFireF1");
const demoFireAcc = document.getElementById("demoFireAcc");
const demoTypeF1 = document.getElementById("demoTypeF1");
const demoTypeAcc = document.getElementById("demoTypeAcc");


// data for demo (atlas and glass with RF only for now)
const demoData = {
  "atlas_rf": {
    fireName: "Atlas",
    fireType: "Wind-driven",
    modelName: "Random Forest",
    imgSrc: "images/demo/atlas_rf_map.png",
    metrics: {
      fire: { f1: "0.597", acc: "0.657" },
      type: { f1: "0.686", acc: "0.698" }
    }
  },

  "glass_rf": {
    fireName: "Glass",
    fireType: "Wind-driven",
    modelName: "Random Forest",
    imgSrc: "images/demo/glass_rf_map.png",
    metrics: {
      fire: { f1: "0.625", acc: "0.681" },
      type: { f1: "0.686", acc: "0.698" }
    }
  }
};


// Update demo when dropdowns change
function updateDemo() {
  if (!fireSelect || !modelSelect) return;

  const fire = fireSelect.value;
  const model = modelSelect.value;

  if (!fire || !model) {
    demoEmpty.textContent = "Choose a fire + model to view maps.";
    demoEmpty.style.display = "block";
    demoImageWrap.style.display = "none";
    demoText.style.display = "none";
    return;
  }

  const key = `${fire}_${model}`;
  const item = demoData[key];

  if (!item) {
    demoEmpty.textContent = "This fire/model pair isn't available in the demo yet.";
    demoEmpty.style.display = "block";
    demoImageWrap.style.display = "none";
    demoText.style.display = "none";
    return;
  }

  demoImage.src = item.imgSrc;
  demoImage.alt = `${item.fireName} - ${item.modelName} maps`;

  demoFireName.textContent = item.fireName;
  demoFireType.textContent = item.fireType;
  demoModelName.textContent = item.modelName;

  demoFireF1.textContent = item.metrics.fire.f1;
  demoFireAcc.textContent = item.metrics.fire.acc;
  demoTypeF1.textContent = item.metrics.type.f1;
  demoTypeAcc.textContent = item.metrics.type.acc;

  demoEmpty.style.display = "none";
  demoImageWrap.style.display = "block";
  demoText.style.display = "block";
}

if (fireSelect && modelSelect) {
  fireSelect.addEventListener("change", updateDemo);
  modelSelect.addEventListener("change", updateDemo);
  updateDemo(); 
}
