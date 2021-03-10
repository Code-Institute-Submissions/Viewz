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

// Call the functions
