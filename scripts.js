"use strict";

// Selecting Nav bar elements
const nav = document.querySelector(".nav-bar");
const btnCloseNav = document.querySelector(".close-nav-btn");

//! Closing the nav bar on clicking X
btnCloseNav.addEventListener("click", function (e) {
    e.preventDefault();

    nav.classList.add("nav-bar-closed");
});

const getCurrentPosition = async function () {
    try {
        const position = await navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log(position);
                const { latitude: lat, longitude: lng } = position.coords;
                displayMap(lat, lng);
            },
            function (error) {
                throw new Error("Couldn't get users coordinates");
            }
        );
    } catch (err) {
        console.error(err);
    }
};

getCurrentPosition();

//! Displaying the map
const displayMap = function (lat, lng) {
    const map = L.map("map").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // L.marker([51.5, -0.09])
    //     .addTo(map)
    //     .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    //     .openPopup();
};

// displayMap();
