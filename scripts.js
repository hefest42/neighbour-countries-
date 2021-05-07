"use strict";

// Selecting Nav bar elements
const nav = document.querySelector(".nav-bar");
const btnCloseNav = document.querySelector(".close-nav-btn");

const countriesContainer = document.querySelector(".country-section");

// Selecint hero country elements
const heroCountryContainer = document.querySelector(".main-country-container");

// selecting neighbour countires elements
const neighbourCountryContainer = document.querySelector(
    ".neighbour-container"
);

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
    const map = L.map("map").setView([lat, lng], 4);

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
        const { lat, lng } = await event.latlng;
        const positionFetch = await fetch(
            `https://geocode.xyz/${lat},${lng}?geoit=json`
        );

        if (!positionFetch.ok)
            throw new Error("Having issues retrieving coordinates");

        const position = await positionFetch.json();
        // console.log(position);
        const country = position.country;
        // if (!country) throw new Error("Could not get the country");

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
    countriesContainer.style.display = "flex";
    console.log(country);

    const html = `
            <div class="main-flag-container">
            <img
                class="main-flag"
                src="${country.flag}"
                alt="hero country flag"
            />
        </div>
        <div class="main-info">
            <div class="main-name">Name: <span>${country.name}</span></div>
            <div class="main-continent">
                Continent: <span>${country.region}</span>
            </div>
            <div class="main-region">Region: ${country.subregion}</div>
            <div class="main-capital">
                Capital: <span>${country.capital}</span>
            </div>
            <div class="main-population">
                Population: <span>${(+country.population / 1000000).toFixed(
                    1
                )}</span>
            </div>
            <div class="main-language">
                Language: <span>${country.languages[0].name}</span>
            </div>
            <div class="main-currency">
                Currency: <span>${country.currencies[0].name} ${
        country.currencies[0].symbol
    }</span>
            </div>
        </div>
    `;

    heroCountryContainer.insertAdjacentHTML("afterbegin", html);

    // ! selecing neighbours and calling the function to display them
    const countryNeighbours = country.borders;
    displayNeighbours(countryNeighbours);
};

const displayNeighbours = async function (countries) {
    const getNeighbours = countries.map(async country => {
        return await fetch(`https://restcountries.eu/rest/v2/alpha/${country}`);
    });

    const neighbours = await Promise.all(getNeighbours);

    neighbours.forEach(async neighbour => {
        const data = await neighbour.json();
        console.log(data);

        const html = `
        <div class="neighbour">
            <div class="neighbour-flag-container">
                <img
                    class="neighbour-flag"
                    src="${data.flag}"
                    alt="hero country flag"
                />
            </div>
            <div class="neighbour-info">
                <div class="neighbour-name">Name: <span>${
                    data.name
                }</span></div>
                <div class="neighbour-capital">
                    Capital: <span>${data.capital}</span>
                </div>
                <div class="neighbour-population">
                    Population: <span>${(+data.population / 1000000).toFixed(
                        1
                    )}</span>
                </div>
                <div class="neighbour-language">
                    Language: <span>${data.languages[0].name}</span>
                </div>
                <div class="neighbour-currency">
                    Currency: <span>${data.currencies[0].name} ${
            data.currencies[0].symbol
        }</span>
                </div>
            </div>
        </div>
        `;

        neighbourCountryContainer.insertAdjacentHTML("afterbegin", html);
    });
};
