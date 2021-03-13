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
class View {
  // Creates a new id from the last 10 digits of the current date time stamp
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, viewImg, uName, date, description) {
    this.coords = coords;
    this.uName = uName;
    this.viewImg = viewImg;
    this.date = date;
    this.description = description;
  }
}
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

function renderMarker(view) {
  L.marker(view.coords).addTo(map);
}

function showForm() {
  form.classList.remove("hidden");
}

function hideForm() {
  inputName.value = inputImg.value = inputDate.value = viewDescription.value =
    "";
  form.classList.add("hidden");
  cardContainer.classList.toggle("hidden");
}

// Call the functions
getLocalStorage();
initCoords();
loadMap();

// Creates a new view object and saves it to an array and then local storage.
function newView() {
  //Get data from the form
  const { lat, lng } = mapEvent.latlng;
  const viewImg = inputImg.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
  const uName = inputName.value;
  const date = inputDate.value;
  const description = viewDescription.value;

  //Create the view object
  const view = new View([lat, lng], viewImg, uName, date, description);

  //Add new object the views array
  views.push(view);

  // Render workout on map as marker
  renderViewMarker(view);

  // Render workout on list
  displayList(views, cardContainer, rows, current_page);

  // Hide form + clear input fields
  hideForm();

  // Set local storage to all workouts
  setLocalStorage();

  revealViews();
  setUpPagination(views, pagination_element, rows);
  checkMark.classList.add("hidden");
}
