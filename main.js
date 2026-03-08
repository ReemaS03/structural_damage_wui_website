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
  rf: { f1Und: "0.745", f1Des: "0.932", f1W: "0.898", acc: "0.892" },
  nn: { f1Und: "0.629",   f1Des: "0.938",   f1W: "0.883",   acc: "0.893" }
};

// Per-fire metrics for each model 
const FIRE_METRICS = {
  rf: {
    french:   { f1Und: "0.928", f1Des: "0.490", f1W: "0.890", acc: "0.875" },
    mosquito: { f1Und: "0.894", f1Des: "0.760", f1W: "0.855", acc: "0.853" },
    erskine:  { f1Und: "0.0", f1Des: "0.991", f1W: "0.991", acc: "0.982" },
    carr:     { f1Und: "0.0", f1Des: "0.934", f1W: "0.934", acc: "0.876" }
  },
  nn: {
    french:   { f1Und: "0.771", f1Des: "0.314", f1W: "0.731", acc: "0.657" },
    mosquito: { f1Und: "0.423", f1Des: "0.515", f1W: "0.450", acc: "0.473" },
    erskine:  { f1Und: "0.0", f1Des: "1.0", f1W: "1.0", acc: "1.0" },
    carr:     { f1Und: "0.0", f1Des: "0.986", f1W: "0.986", acc: "0.972" }
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

// Fire Subset x Model SHAP Demo
const subsetSelect = document.getElementById("subsetSelect");
const shapModelSelect = document.getElementById("shapModelSelect");

const shapEmpty = document.getElementById("shapEmpty");
const shapImageWrap = document.getElementById("shapImageWrap");
const shapImage = document.getElementById("shapImage");
const shapText = document.getElementById("shapText");

const shapSubsetName = document.getElementById("shapSubsetName");
const shapModelName = document.getElementById("shapModelName");
const shapExplanation = document.getElementById("shapExplanation");

const SUBSET_INFO = {
  rf: {
    all_fires: {
      subsetName: "All Fires",
      explanation: `
        <ul>
          <li>
            Structural characteristics such as exterior wall materials, roof type, and eave design strongly influence predictions.
            <ul>
              <li>Structures with flammable outer walls increase predicted structural damage risk.</li>
              <li>Open or enclosed eaves are associated with lower predicted structural damage.</li>
            </ul>
          </li>
          <li>
            Environmental factors such as burn severity class and weather conditions also affect predictions.
            <ul>
              <li>Higher burn severity is associated with increased predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    },

    small: {
      subsetName: "Small Fires",
      explanation: `
        <ul>
          <li>
            Environmental conditions play a major role in predictions for smaller fires, with precipitation and burn severity among the most influential features.
            <ul>
              <li>Higher precipitation is associated with lower predicted structural damage risk.</li>
              <li>Higher burn severity increases predicted structural damage risk.</li>
            </ul>
          </li>
          <li>
            Structural characteristics still influence outcomes.
            <ul>
              <li>Open eaves are associated with lower predicted structural damage risk.</li>
              <li>Structures with single-pane windows tend to show higher predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    },

    low_severity: {
      subsetName: "Low Severity",
      explanation: `
        <ul>
          <li>
            Structural characteristics play a larger role in predictions for lower-severity fires.
            <ul>
              <li>Structures with single-pane windows tend to show higher predicted structural damage risk.</li>
              <li>The use of certain roof types, such as asphalt or metal roofs, is also associated with higher predicted structural damage risk.</li>
            </ul>
          </li>
          <li>
            Environmental conditions still influence predictions.
            <ul>
              <li>Higher precipitation is associated with lower predicted structural damage risk.</li>
              <li>Higher burn severity increases predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    },

    high_severity: {
      subsetName: "High Severity",
      explanation: `
        <ul>
          <li>
            Environmental conditions play a particularly important role for high-severity fires.
            <ul>
              <li>
                All values (low, medium, and high) of max vapor pressure deficit — a measure of how dry the air is — increase the predicted structural damage risk, but higher values produce stronger increases in predicted structural damage risk. In other words, the higher the vapor pressure deficit, the greater the predicted structural damage risk.
              </li>
              <li>Burn severity class also remains an important predictor of structural damage risk.</li>
            </ul>
          </li>
          <li>
            Structural features still contribute, particularly the use of asphalt roofs, which is associated with higher predicted structural damage risk in this subset.
          </li>
        </ul>
      `
    },

    wind_driven: {
      subsetName: "Wind Driven",
      explanation: `
        <ul>
          <li>
            Structural characteristics play an important role in predictions for wind-driven fires.
            <ul>
              <li>Structures with flammable outer wall materials are associated with higher predicted structural damage risk in this subset.</li>
              <li>The use of fire-resistant roofs also appears among the most influential structural predictors. This does not necessarily mean these roofs increase predicted structural damage risk, but may reflect that these structures tend to occur in areas that experience more severe wind-driven fire conditions.</li>
            </ul>
          </li>
          <li>
            Environmental conditions also influence predictions.
            <ul>
              <li>Higher burn severity increases predicted structural damage risk.</li>
              <li>Lower precipitation is associated with higher predicted structural damage risk, suggesting that drier conditions contribute to greater vulnerability during wind-driven fires.</li>
            </ul>
          </li>
        </ul>
      `
    },

    plume_driven: {
      subsetName: "Plume Driven",
      explanation: `
        <ul>
          <li>
            Environmental conditions play a particularly strong role in predictions for plume-driven fires, with burn severity class having the largest impact on predicted structural damage.
            <ul>
              <li>Higher burn severity classes are strongly associated with increased predicted structural damage risk, while lower and moderate burn severity values tend to reduce predicted structural damage risk.</li>
              <li>Although the effect of max vapor pressure deficit — a measure of how dry the air is — is less clearly separated than burn severity, the highest values increase predicted structural damage risk, while the remaining range of values tends to reduce predicted structural damage risk.</li>
            </ul>
          </li>
          <li>
            Several structural characteristics also influence predictions.
            <ul>
              <li>Structures with single-pane windows or open eaves are associated with higher predicted structural damage risk.</li>
              <li>Features related to defensible space — the buffer between a structure and the surrounding area — also appear influential. Structures without fences or decks/porches tend to increase predicted structural damage risk, while their presence is associated with reduced predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    }
  },

  nn: {
    all_fires: {
      subsetName: "All Fires",
      explanation: `
        <ul>
          <li>
            Structural characteristics strongly influence predictions for this subset.
            <ul>
              <li>Outer wall materials appear highly influential, with both flammable and burn-resistant outer walls associated with higher predicted structural damage risk. This does not necessarily mean burn-resistant materials increase predicted structural damage risk, but may reflect that these structures tend to occur in areas with higher wildfire exposure.</li>
              <li>Eave design also appears highly influential, with structures that have either open or enclosed eaves associated with lower predicted structural damage risk.</li>
            </ul>
          </li>
          <li>
            Environmental conditions also contribute to predictions.
            <ul>
              <li>Higher burn severity classes are associated with increased predicted structural damage risk, while moderate and low classes tend to reduce predicted structural damage risk.</li>
              <li>Higher precipitation is associated with higher predicted structural damage risk, while lower precipitation tends to reduce predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    },

    small: {
      subsetName: "Small Fires",
      explanation: `
        <ul>
          <li>
            Environmental conditions play an important role in predictions for smaller fires.
            <ul>
              <li>Higher precipitation is associated with lower predicted structural damage risk, while lower precipitation tends to increase predicted structural damage risk.</li>
              <li>Higher burn severity classes are associated with increased predicted structural damage risk, while lower severity levels tend to reduce predicted structural damage risk.</li>
            </ul>
          </li>

          <li>
            Structural characteristics also influence predictions in this subset.
            <ul>
              <li>Structures with open or enclosed eaves are associated with lower predicted structural damage risk.</li>
            </ul>
          </li>

          <li>
            Some location-based characteristics also appear influential.
            <ul>
              <li>Vacant housing unit density generally reduces predicted structural damage risk, with higher vacancy levels associated with even lower predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    },

    low_severity: {
      subsetName: "Low Severity",
      explanation: `
        <ul>
          <li>
            Environmental conditions still influence predictions in the low-severity fire subset.
            <ul>
              <li>Higher burn severity classes are associated with increased predicted structural damage risk, while lower severity levels tend to reduce predicted structural damage risk.</li>
              <li>Higher precipitation is associated with lower predicted structural damage risk, while lower precipitation tends to increase predicted structural damage risk. The reduction in predicted structural damage risk for higher precipitation levels appears stronger than the increase associated with lower precipitation in this subset.</li>
            </ul>
          </li>

          <li>
            Structural characteristics also play an important role in predictions.
            <ul>
              <li>Structures with either open or enclosed eaves are associated with lower predicted structural damage risk.</li>
              <li>Fire-resistant roofs are associated with higher predicted structural damage risk in this subset. This does not necessarily mean these roofs increase vulnerability, but may reflect that such structures are more common in areas that experience higher wildfire exposure.</li>
            </ul>
          </li>
        </ul>
      `
    },

    high_severity: {
      subsetName: "High Severity",
      explanation: `
        <ul>
          <li>
            Environmental conditions play an important role in predictions for high-severity fires.
            <ul>
              <li>Max vapor pressure deficit — a measure of how dry the air is — consistently contributes to higher predicted structural damage risk in this subset, although its effect is not cleanly separated by feature value.</li>
              <li>Higher burn severity classes are associated with increased predicted structural damage risk, while lower severity levels tend to reduce predicted structural damage risk.</li>
            </ul>
          </li>

          <li>
            Structural characteristics also influence predictions in this subset.
            <ul>
              <li>Structures without flammable outer wall materials are associated with lower predicted structural damage risk in this subset.</li>
              <li>Asphalt roofs are also associated with higher predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    },

    wind_driven: {
      subsetName: "Wind Driven",
      explanation: `
        <ul>
          <li>
            Environmental conditions play an important role in predictions for wind-driven fires.
            <ul>
              <li>Higher burn severity classes are associated with increased predicted structural damage risk, while lower severity levels tend to reduce predicted structural damage risk.</li>
              <li>Higher mean temperatures are associated with lower predicted structural damage risk in this subset.</li>
            </ul>
          </li>

          <li>
            Structural and spatial characteristics also influence predictions.
            <ul>
              <li>Structures with flammable outer wall materials are associated with higher predicted structural damage risk.</li>
              <li>Greater distance to nearby structures is associated with lower predicted structural damage risk, suggesting that more isolated structures may be less exposed to fire spread in wind-driven conditions.</li>
            </ul>
          </li>
        </ul>
      `
    },

    plume_driven: {
      subsetName: "Plume Driven",
      explanation: `
        <ul>
          <li>
            Environmental features influence predictions in plume-driven fires.
            <ul>
              <li>Higher burn severity classes are associated with increased predicted structural damage risk, while lower severity levels tend to reduce predicted structural damage risk.</li>
              <li>Higher precipitation levels are generally associated with lower predicted structural damage risk in this subset.</li>
              <li>Greater surrounding vegetation height is associated with higher predicted structural damage risk.</li>
            </ul>
          </li>

          <li>
            Structural characteristics also influence predictions.
            <ul>
              <li>Structures without fences are associated with higher predicted structural damage risk.</li>
              <li>Structures with open eaves are associated with lower predicted structural damage risk.</li>
            </ul>
          </li>
        </ul>
      `
    }
  }
};

function shapModelFolder(model) {
  return model === "rf" ? "random_forest" : "neural_network";
}

function shapModelLabel(model) {
  return model === "rf" ? "Random Forest" : "Neural Network";
}

function shapImgPath(model, subset) {
  return `images/demo/${shapModelFolder(model)}/${subset}_shap.png`;
}

function updateShapDemo() {
  if (!subsetSelect || !shapModelSelect) return;

  const subset = subsetSelect.value;
  const model = shapModelSelect.value;

  if (!subset || !model) {
    shapEmpty.textContent = "Choose a fire subset + model to view the SHAP plot.";
    shapEmpty.style.display = "block";
    shapImageWrap.style.display = "none";
    shapText.style.display = "none";
    return;
  }

  const info = SUBSET_INFO[model]?.[subset];

  if (!info) {
    shapEmpty.textContent = "This fire subset/model pair isn't available in the demo yet.";
    shapEmpty.style.display = "block";
    shapImageWrap.style.display = "none";
    shapText.style.display = "none";
    return;
  }

  shapImage.src = shapImgPath(model, subset);
  shapImage.alt = `${info.subsetName} - ${shapModelLabel(model)} SHAP plot`;

  shapSubsetName.textContent = info.subsetName;
  shapModelName.textContent = shapModelLabel(model);
  shapExplanation.innerHTML = info.explanation;

  shapEmpty.style.display = "none";
  shapImageWrap.style.display = "block";
  shapText.style.display = "block";
}

if (subsetSelect && shapModelSelect) {
  subsetSelect.addEventListener("change", updateShapDemo);
  shapModelSelect.addEventListener("change", updateShapDemo);
  updateShapDemo();
}
