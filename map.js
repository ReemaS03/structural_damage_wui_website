mapboxgl.accessToken = ["pk", "eyJ1IjoicmVlbWFzMDMiLCJhIjoiY21tYXczc3YyMGd1MDJwb213cnBnbjV6OSJ9", "3sdDY2GCTpKt-tKZI8orlA"].join(".");

const FIRE_FILES = {
    french: {
        perimeter: 'data/french_perimeter.geojson',
        structures: 'data/french_structures.geojson'
    },
    carr: {
        perimeter: 'data/carr_perimeter.geojson',
        structures: 'data/carr_structures.geojson'
    }
    };

    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [-122.55, 38.65],
    zoom: 8
});

map.addControl(new mapboxgl.NavigationControl());

let userInteracted = false;
let suppressNextMoveEnd = false;

function ensureStatusEl() {
    let el = document.getElementById('mapStatus');
    if (!el) {
        el = document.createElement('div');
        el.id = 'mapStatus';
        el.style.position = 'absolute';
        el.style.top = '10px';
        el.style.left = '10px';
        el.style.padding = '6px 10px';
        el.style.background = 'rgba(255,255,255,0.85)';
        el.style.fontFamily = 'sans-serif';
        el.style.fontSize = '12px';
        el.style.borderRadius = '6px';
        el.style.zIndex = 2;
        document.getElementById('map').appendChild(el);
    }
    return el;
}

function setStatus(msg) {
    const el = ensureStatusEl();
    el.textContent = msg;
}

// Rectangle marker
function makeRectMarkerImage() {
    const w = 28;
    const h = 18;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);

    if (!map.hasImage('rect-marker')) {
        map.addImage('rect-marker', { width: w, height: h, data: imgData.data }, { sdf: true });
    }
}

function fitBoundsToPointGeoJSON(pointGeojson, padding = 80) {
    const bounds = new mapboxgl.LngLatBounds();
    let count = 0;

    for (const f of pointGeojson.features || []) {
        if (!f || !f.geometry || f.geometry.type !== 'Point') continue;
        const c = f.geometry.coordinates;
        if (!Array.isArray(c) || c.length < 2) continue;
        bounds.extend(c);
        count += 1;
    }

    if (count > 0) {
        suppressNextMoveEnd = true; 
        map.fitBounds(bounds, { padding });
        return true;
    }
    return false;
}

function fitBoundsToPolygonGeoJSON(polyGeojson, padding = 65) {
    const bounds = new mapboxgl.LngLatBounds();
    let extended = 0;

    for (const f of polyGeojson.features || []) {
        const g = f?.geometry;
        if (!g) continue;

        if (g.type === 'Polygon') {
        for (const coord of (g.coordinates?.[0] || [])) {
            bounds.extend(coord);
            extended += 1;
        }
    }

        if (g.type === 'MultiPolygon') {
        for (const poly of (g.coordinates || [])) {
            for (const coord of (poly?.[0] || [])) {
            bounds.extend(coord);
            extended += 1;
            }
        }
    }
}

  if (extended > 0) {
    suppressNextMoveEnd = true; 
    map.fitBounds(bounds, { padding });
    return true;
  }
  return false;
}

function jumpToFirstPoint(pointGeojson) {
    for (const f of pointGeojson.features || []) {
        if (f?.geometry?.type === 'Point' && Array.isArray(f.geometry.coordinates)) {
        suppressNextMoveEnd = true; 
        map.jumpTo({ center: f.geometry.coordinates, zoom: 10 });
        return true;
        }
    }
    return false;
}

async function loadFire(key) {
    const files = FIRE_FILES[key];
    if (!files) return;

    setStatus(`Loading ${key}...`);

    const [perimRes, structRes] = await Promise.all([
        fetch(files.perimeter),
        fetch(files.structures)
    ]);

    if (!perimRes.ok) throw new Error(`Perimeter load failed: ${files.perimeter} (${perimRes.status})`);
    if (!structRes.ok) throw new Error(`Structures load failed: ${files.structures} (${structRes.status})`);

    const [perimGeojson, structGeojson] = await Promise.all([
        perimRes.json(),
        structRes.json()
    ]);

    console.log(`[${key}] perimeter features:`, perimGeojson.features?.length);
    console.log(`[${key}] structures features:`, structGeojson.features?.length);

    map.getSource('fire-perimeter').setData(perimGeojson);
    map.getSource('fire-structures').setData(structGeojson);

    userInteracted = false;
    const recenterBtn = document.getElementById('recenterBtn');
    if (recenterBtn) recenterBtn.style.display = 'none';

    const okPoly = fitBoundsToPolygonGeoJSON(perimGeojson, 65);

    if (!okPoly) {
        const okPoints = fitBoundsToPointGeoJSON(structGeojson, 60);
        if (!okPoints) jumpToFirstPoint(structGeojson);
    }

    setStatus(`Showing: ${key.toUpperCase()} Fire`);
}

// Checkbox filtering 
function applyMapStructureState() {
    const allEl = document.getElementById('toggleStructures');
    const damEl = document.getElementById('toggleDamaged');
    const undEl = document.getElementById('toggleUndamaged');

    if (!allEl || !damEl || !undEl) return;

    const allChecked = allEl.checked;
    const damagedChecked = damEl.checked;
    const undamagedChecked = undEl.checked;

    const showLayer = allChecked || damagedChecked || undamagedChecked;

    map.setLayoutProperty(
        'fire-structures-rect',
        'visibility',
        showLayer ? 'visible' : 'none'
    );

    if (!showLayer) return;

    if ((allChecked && damagedChecked && undamagedChecked) || (damagedChecked && undamagedChecked)) {
        map.setFilter('fire-structures-rect', null);
        return;
    }

    if (damagedChecked && !undamagedChecked) {
        map.setFilter('fire-structures-rect', ['==', ['get', 'damage'], 1]);
        return;
    }

    if (!damagedChecked && undamagedChecked) {
        map.setFilter('fire-structures-rect', ['==', ['get', 'damage'], 0]);
        return;
    }

    map.setFilter('fire-structures-rect', ['==', ['get', 'damage'], -999]);
}

function syncCheckboxesFromAll() {
    const allEl = document.getElementById('toggleStructures');
    const damEl = document.getElementById('toggleDamaged');
    const undEl = document.getElementById('toggleUndamaged');
    if (!allEl || !damEl || !undEl) return;

    if (!allEl.checked) {
        damEl.checked = false;
        undEl.checked = false;
    } else {
        damEl.checked = true;
        undEl.checked = true;
    }
    applyMapStructureState();
}

function syncAllFromSubcategories() {
    const allEl = document.getElementById('toggleStructures');
    const damEl = document.getElementById('toggleDamaged');
    const undEl = document.getElementById('toggleUndamaged');
    if (!allEl || !damEl || !undEl) return;

    allEl.checked = (damEl.checked && undEl.checked);
    applyMapStructureState();
}

// Recenter 
function recenterToCurrentFire() {
    const perSrc = map.getSource('fire-perimeter');
    if (!perSrc || !perSrc._data) return;

    suppressNextMoveEnd = true;
    userInteracted = false;

    const okPoly = fitBoundsToPolygonGeoJSON(perSrc._data, 65);
    if (!okPoly) {
        const stSrc = map.getSource('fire-structures');
        if (stSrc && stSrc._data) fitBoundsToPointGeoJSON(stSrc._data, 60);
    }

    const recenterBtn = document.getElementById('recenterBtn');
    if (recenterBtn) recenterBtn.style.display = 'none';
}

// Map load
map.on('load', async () => {
    makeRectMarkerImage();

    map.addSource('fire-perimeter', {
        type: 'geojson',
        data: FIRE_FILES.french.perimeter
    });

    map.addSource('fire-structures', {
        type: 'geojson',
        data: FIRE_FILES.french.structures
    });

    map.addLayer({
        id: 'fire-perimeter-outline',
        type: 'line',
        source: 'fire-perimeter',
        paint: {
        'line-color': '#000000',
        'line-width': 3
        }
    });

    map.addLayer({
        id: 'fire-structures-rect',
        type: 'symbol',
        source: 'fire-structures',
        layout: {
        'icon-image': 'rect-marker',
        'icon-size': 0.4,
        'icon-allow-overlap': true
        },
        paint: {
        'icon-opacity': 0.25,
        'icon-color': [
            'match',
            ['get', 'damage'],
            1, '#e31a1c',
            0, '#1f78b4',
            '#aaaaaa'
        ],
        'icon-halo-color': [
            'match',
            ['get', 'damage'],
            1, '#e31a1c',
            0, '#1f78b4',
            '#aaaaaa'
        ],
        'icon-halo-width': 2,
        'icon-halo-blur': 0
        }
    });

  document.getElementById('toggleStructures')?.addEventListener('change', syncCheckboxesFromAll);
  document.getElementById('toggleDamaged')?.addEventListener('change', syncAllFromSubcategories);
  document.getElementById('toggleUndamaged')?.addEventListener('change', syncAllFromSubcategories);
  syncAllFromSubcategories();

  const recenterBtn = document.getElementById('recenterBtn');
  if (recenterBtn) {
    recenterBtn.style.display = 'none';
    recenterBtn.addEventListener('click', recenterToCurrentFire);
  }

  map.on('dragstart', () => { userInteracted = true; });
  map.on('zoomstart', () => { userInteracted = true; });
  map.on('rotatestart', () => { userInteracted = true; });
  map.on('pitchstart', () => { userInteracted = true; });

  // Show button only after user moves
  map.on('moveend', () => {
    if (suppressNextMoveEnd) {
      suppressNextMoveEnd = false;
      return;
    }
    if (!userInteracted) return;

    const btn = document.getElementById('recenterBtn');
    if (btn) btn.style.display = 'inline-block';
  });

  try {
    await loadFire('french');
  } catch (err) {
    console.error('Initial load failed:', err);
    setStatus('Initial load failed (check console)');
  }

  const fireSelectMap = document.getElementById('fireSelectMap');
  if (fireSelectMap) {
    fireSelectMap.value = 'french';
    fireSelectMap.addEventListener('change', async (e) => {
      try {
        await loadFire(e.target.value);
      } catch (err) {
        console.error('Switch fire failed:', err);
        setStatus('Switch failed (check console)');
      }
    });
  }
});
