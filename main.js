// navbar mobile version
const nav = document.querySelector(".navbar");
const navToggle = document.querySelector(".nav-toggle");

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll('.nav-tabs a').forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 700) {
        nav.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

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
const demoModelName = document.getElementById("demoModelName");

const demoFireF1Und = document.getElementById("demoFireF1Und");
const demoFireF1Des = document.getElementById("demoFireF1Des");
const demoFireF1W   = document.getElementById("demoFireF1W");
const demoFireAcc   = document.getElementById("demoFireAcc");

const demoOverallF1Und = document.getElementById("demoOverallF1Und");
const demoOverallF1Des = document.getElementById("demoOverallF1Des");
const demoOverallF1W   = document.getElementById("demoOverallF1W");
const demoOverallAcc   = document.getElementById("demoOverallAcc");

const FIRE_INFO = {
  french:   { fireName: "French"},
  mosquito:{ fireName: "Mosquito"},
  erskine: { fireName: "Erskine"},
  carr:    { fireName: "Carr" }
};

// Overall test set metrics (same for all fires)
const OVERALL_TEST_METRICS = {
  rf: { f1Und: "0.696", f1Des: "0.908", f1W: "0.871", acc: "0.859" },
  nn: { f1Und: "0.619",   f1Des: "0.928",   f1W: "0.873",   acc: "0.879" }
};

// Per-fire metrics for each model 
const FIRE_METRICS = {
  rf: {
    french:   { f1Und: "0.940", f1Des: "0.531", f1W: "0.904", acc: "0.894" },
    mosquito: { f1Und: "0.900", f1Des: "0.764", f1W: "0.860", acc: "0.860" },
    erskine:  { f1Und: "0.0", f1Des: "0.978", f1W: "0.978", acc: "0.958" },
    carr:     { f1Und: "0.0", f1Des: "0.905", f1W: "0.905", acc: "0.826" }
  },
  nn: {
    french:   { f1Und: "0.744", f1Des: "0.296", f1W: "0.705", acc: "0.625" },
    mosquito: { f1Und: "0.633", f1Des: "0.592", f1W: "0.620", acc: "0.613" },
    erskine:  { f1Und: "0.0", f1Des: "1.0", f1W: "1.0", acc: "1.0" },
    carr:     { f1Und: "0.0", f1Des: "0.967", f1W: "0.967", acc: "0.936" }
  }
};

function modelFolder(model) {
  return model === "rf" ? "random_forest" : "neural_network";
}

function modelLabel(model) {
  return model === "rf" ? "Random Forest" : "Neural Network";
}

function imgPath(model, fire) {
  return `images/demo/${modelFolder(model)}/${fire}_map.png`;
}

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

  const info = FIRE_INFO[fire];
  const fireMetrics = FIRE_METRICS?.[model]?.[fire];
  const overall = OVERALL_TEST_METRICS?.[model];

  if (!info || !fireMetrics || !overall) {
    demoEmpty.textContent = "This fire/model pair isn't available in the demo yet.";
    demoEmpty.style.display = "block";
    demoImageWrap.style.display = "none";
    demoText.style.display = "none";
    return;
  }

  demoImage.src = imgPath(model, fire);
  demoImage.alt = `${info.fireName} - ${modelLabel(model)} maps`;

  demoFireName.textContent = info.fireName;
  demoModelName.textContent = modelLabel(model);

  // Metrics: this fire
  demoFireF1Und.textContent = fireMetrics.f1Und;
  demoFireF1Des.textContent = fireMetrics.f1Des;
  demoFireF1W.textContent   = fireMetrics.f1W;
  demoFireAcc.textContent   = fireMetrics.acc;

  // Metrics: overall test set
  demoOverallF1Und.textContent = overall.f1Und;
  demoOverallF1Des.textContent = overall.f1Des;
  demoOverallF1W.textContent   = overall.f1W;
  demoOverallAcc.textContent   = overall.acc;

  demoEmpty.style.display = "none";
  demoImageWrap.style.display = "block";
  demoText.style.display = "block";
}

if (fireSelect && modelSelect) {
  fireSelect.addEventListener("change", updateDemo);
  modelSelect.addEventListener("change", updateDemo);
  updateDemo();
}
