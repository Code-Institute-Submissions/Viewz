// Create and assign variables
const appContainer = document.getElementById("app-container");
const form = document.getElementById("form");
const viewDescription = document.getElementById("viewDescription");
const inputName = document.getElementById("name");
const inputDate = document.getElementById("date");
const inputImg = document.getElementById("view-img");
const cardContainer = document.querySelector(".cards");
const submit = document.querySelector(".submit");
const viewList = document.querySelector(".list-views");
const addView = document.querySelector(".add-view");
const closeBtn = document.getElementById("close-btn");
const popUp = document.getElementById("popUp");
const pagination_element = document.getElementById("pagination");
const checkMark = document.querySelector(".fa-check");
let current_page = 1;
let rows = 4;
let image;
let mapEvent;
let map;
let views = [];
let marker;

//Create a new view object

// Event handlers

//Functions
// Getting the users current location coords from the browsers geolocation
function initCoords() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(loadMap, function () {
      alert("Could not get your position");
    });
}

// Creaties a map using the Leaflet Js API
function loadMap(pos) {
  const { latitude } = pos.coords;
  const { longitude } = pos.coords;

  const coords = [latitude, longitude];

  map = L.map("map").setView(coords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //Handles clicks on the map
  map.on("click", function (mapE) {
    mapEvent = mapE;
    const { lat, lng } = mapEvent.latlng;

    viewList.classList.add("not-active");
    addView.classList.remove("not-active");

    // If a marker is already placed remove it and add the new one on click
    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "view-popup",
        })
      )
      .setPopupContent();

    // Makes the form visble to the user
    showForm();
    cardContainer.classList.add("hidden");
    pagination_element.classList.add("hidden");
  });
  // Renders a marker for every view saved in local storage
  views.forEach((view) => {
    renderViewMarker(view);
  });

  displayList();
}

// Call the functions
