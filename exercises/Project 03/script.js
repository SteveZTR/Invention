/* =========================
   Map 初始化
========================= */

const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [-3.5, 54.5],
  zoom: 5
});

const popupContainer = document.getElementById("popup-container");
const showAllBtn = document.getElementById("show-all");

let citiesData = [];
let cityMarkers = [];
let placeMarkers = [];


/* =========================
   Popup 控制
========================= */

function showPopup() {
  popupContainer.style.display = "block";
  requestAnimationFrame(() => {
    popupContainer.classList.add("show");
  });
}

function hidePopup() {
  popupContainer.classList.remove("show");
  setTimeout(() => {
    if (!popupContainer.classList.contains("show")) {
      popupContainer.style.display = "none";
    }
  }, 300);
}


/* =========================
   清除 Marker
========================= */

function clearMarkers(markers) {
  markers.forEach(marker => marker.remove());
  markers.length = 0;
}


/* =========================
   城市 Popup（左右布局）
========================= */

function showCityPopup(city) {
  popupContainer.className = "city-popup";
  popupContainer.innerHTML = `
    <img src="${city.images[0]}" alt="${city.city}">
    <div class="city-info">
      <h3>${city.city}</h3>
      <p>${city.description}</p>
      <button id="enter-city">Enter city</button>
    </div>
  `;

  showPopup();

  document.getElementById("enter-city").addEventListener("click", () => {
    hidePopup();
    enterCity(city);
  });
}


/* =========================
   景点 Popup（普通 / 博物馆）
========================= */

function showPlacePopup(place) {
  popupContainer.className = "";

  let html = `
    <h3>${place.name}</h3>
    <p>${place.description}</p>
  `;

  place.images.forEach(img => {
    html += `<img src="${img}" alt="${place.name}">`;
  });

  if (place.type === "museum" && place.artifacts) {
    popupContainer.classList.add("museum-popup");
    html += `<h4>Artifacts</h4><div class="artifacts-grid">`;
    place.artifacts.forEach(art => {
      html += `
        <div>
          <img src="${art.image}" alt="${art.name}">
          <div>${art.name}</div>
        </div>
      `;
    });
    html += `</div>`;
  }

  popupContainer.innerHTML = html;
  showPopup();
}


/* =========================
   渲染城市 Marker
========================= */

function renderCityMarkers() {
  clearMarkers(cityMarkers);
  clearMarkers(placeMarkers);
  hidePopup();

  citiesData.forEach(city => {
    const marker = new maplibregl.Marker({ color: "red" })
      .setLngLat([city.lng, city.lat])
      .addTo(map);

    marker.getElement().addEventListener("mouseenter", () => {
      showCityPopup(city);
    });

  marker.getElement().addEventListener("mouseenter", () => {
  showCityPopup(city);
  });

    cityMarkers.push(marker);
  });
}


/* =========================
   进入城市 → 显示景点
========================= */

function enterCity(city) {
  clearMarkers(cityMarkers);
  hidePopup();

  map.flyTo({
    center: [city.lng, city.lat],
    zoom: 13,
    speed: 0.8
  });

  city.places.forEach(place => {
    const marker = new maplibregl.Marker({
      color: place.type === "museum" ? "blue" : "green"
    })
      .setLngLat([place.lng, place.lat])
      .addTo(map);

    // hover 显示名字
    marker.getElement().addEventListener("mouseenter", () => {
      popupContainer.className = "";
      popupContainer.innerHTML = `<h3>${place.name}</h3>`;
      showPopup();
    });

    marker.getElement().addEventListener("mouseleave", hidePopup);

    // click 显示详细内容
    marker.getElement().addEventListener("click", () => {
      showPlacePopup(place);
    });

    placeMarkers.push(marker);
  });
}


/* =========================
   Show All（回到总览）
========================= */

showAllBtn.addEventListener("click", () => {
  hidePopup();
  map.flyTo({
    center: [-3.5, 54.5],
    zoom: 5,
    speed: 0.8
  });
  renderCityMarkers();
});


/* =========================
   加载 JSON 数据
========================= */

fetch("data/collection.json")
  .then(res => res.json())
  .then(data => {
    citiesData = data;
    renderCityMarkers();
  })
  .catch(err => {
    console.error("Failed to load collection.json", err);
  });

  map.on("click", () => {
  hidePopup();
});