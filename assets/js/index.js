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

// Function that runs when page is refreshed.  Sets the add view section visible
function refresh() {
  form.classList.remove("hidden");
  cardContainer.classList.add("hidden");
  viewList.classList.add("not-active");
  addView.classList.remove("not-active");
  pagination_element.classList.add("hidden");
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

// Function to  reveal  the hidden  views. The hidden class sets the display to none
function revealViews() {
  cardContainer.classList.remove("hidden");
  form.classList.add("hidden");
  addView.classList.add("not-active");
  viewList.classList.remove("not-active");
  pagination_element.classList.remove("hidden");
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

// Displays  the view cards in a list. Rows variable determines how many view cards are displayed on the page.
function displayList(views, wrapper, rows_per_page, page) {
  if (wrapper.innerHTML) {
    wrapper.innerHTML = "";
  }
  page--;

  let start = rows_per_page * page;
  let end = start + rows_per_page;
  let paginatedItems = views.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];

    const html = `
          <div class="card" style="margin: 10px;" data-id=${item.id}>
          <img class="card-img-top" src="assets/imgs/${item.viewImg}" alt="">
          <div class="card-body">
              <h1 class="card-title" style="text-align: center;">${item.uName}</h1>
              <p class="card-text" style="text-align: center;">${item.date}</p>
            </div>
       </div>
    `;
    cardContainer.insertAdjacentHTML("afterbegin", html);
  }
}

// Setting up pagination. Page buttons display based on the number of view objects in the array and the Rows variable.
function setUpPagination(views, wrapper, rows_per_page) {
  pagination_element.innerHTML = "";
  let page_count = Math.ceil(views.length / rows_per_page);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = paginationButton(i, views);
    wrapper.appendChild(btn);
  }
}

// Creating the page button
function paginationButton(page, views) {
  let button = document.createElement("button");
  button.innerText = page;

  if (current_page == page) button.classList.add("active");

  button.addEventListener("click", function () {
    current_page = page;
    displayList(views, cardContainer, rows, current_page);

    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");

    button.classList.add("active");
  });
  return button;
}

// Zooms the map to the selected view and displays a pop-up with the view details.
function moveToMarker(e) {
  const viewEl = e.target.closest(".card");

  if (!viewEl) return;

  const view = views.find((view) => view.id === viewEl.dataset.id);

  let html = `
      <div class="modal-header">
        <div class="title">${view.uName} <p style="display: inline; font-size: 1rem;">${view.date}</p></div>
        <button id="close-btn" class="close-btn">&times;</button>      
      </div>
      <div class="modal-body">
        <div class="modal-img-container"><img style="width: 100%;" src="assets/imgs/${view.viewImg}" alt=""></div>
        <div class="modal-text-container">${view.description}</div>
      </div>
      <div class="modal-footer"></div>
  `;

  map.setView(view.coords, 18, {
    animate: true,
    pan: {
      duration: 1,
    },
  });
  popUp.innerHTML = "";
  popUp.insertAdjacentHTML("afterbegin", html);
  popUp.classList.remove("hidden");
  popUp.scrollIntoView();
  appContainer.classList.add("blur");
}

// Using browser Local Storage API to store data locally
function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("views"));

  if (!data) return;

  views = data;

  views.forEach((view) => {
    displayList(views, cardContainer, rows, current_page);
  });
}

//Set the local storage with current data
function setLocalStorage() {
  localStorage.setItem("views", JSON.stringify(views));
}

//Clear all data in local storgae
function reset() {
  localStorage.removeItem("views");
  location.reload();
}
