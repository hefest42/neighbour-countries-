"use strict";

// Selecting Nav bar elements
const nav = document.querySelector(".nav-bar");
const btnCloseNav = document.querySelector(".close-nav-btn");

// Selecint hero country elements
const heroCountryContainer = document.querySelector(".main-country-container");

//! Closing the nav bar on clicking X
btnCloseNav.addEventListener("click", function (e) {
    e.preventDefault();

    nav.classList.add("nav-bar-closed");
});

const getCurrentPosition = async function () {
    try {
        const position = await navigator.geolocation.getCurrentPosition(
            function (position) {
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
    const map = L.map("map").setView([lat, lng], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // ! When clicking on the map
    map.on("click", getHeroCountry.bind(this));
};

//! getting the country of the click event and calling the show country function
const getHeroCountry = async function (event) {
    try {
        const { lat, lng } = event.latlng;
        const positionFetch = await fetch(
            `https://geocode.xyz/${lat},${lng}?geoit=json`
        );

        if (!positionFetch.ok)
            throw new Error("Having issues retrieving coordinates");

        const position = await positionFetch.json();
        // console.log(position);
        const country = position.country;
        if (!country) throw new Error("Could not get the country");

        displayCountryInformation(country);
    } catch (err) {
        console.error(err);
    }
};

//! getting stats about the clicked country

const displayCountryInformation = async function (country) {
    try {
        const getCountryInfo = await fetch(
            `https://restcountries.eu/rest/v2/name/${country}`
        );
        const [heroCountry] = await getCountryInfo.json();
        // console.log(heroCountry);

        displayHeroCountry(heroCountry);
    } catch (err) {
        console.error(err);
    }
};

const displayHeroCountry = function (country) {
    map.style.display = "none";
    console.log(country);

    const html = `
        <div class="main-country">
            <div class="main-flag">
                <img
                    src="${country.flag}"
                    alt="country flag"
                />
            </div>
            <div class="main-info">
                <div class="main-name">Name: <span>${country.name}</span></div>
                <div class="main-continent">
                    Continent: <span>Europe</span>
                </div>
                <div class="main-region">Region: <span></span</div>
                <div class="main-capital">
                    Capital: <span>${country.capital}</span>
                </div>
                <div class="main-population">
                    Population: <span>7m</span>
                </div>
                <div class="main-language">
                    Language: <span>Serbian</span>
                </div>
                <div class="main-currency">
                    Currency: <span>Serbian Dinar</span>
                </div>
            </div>
        </div>`;

    heroCountryContainer.insertAdjacentHTML("afterbegin", html);
};
