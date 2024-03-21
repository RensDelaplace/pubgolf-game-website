import {Coordinate} from "./Coordinate.js";
import {chooseStart,chooseEnd} from "./changeStartOrEnd.js";
import {lineToCoordinate, pickStops} from "./fileReader.js";
import {bepaalRecent,bepaalAlgoritme} from "./bepaalAlgo.js";
import {chooseMarkers} from "./chooseMarker.js";
import {downloadRoute} from "./downloadRoute.js";


const dataFile = "data/circle_coords_w_name.csv";
export const middelpunt = new Coordinate([51.049943696116436, 3.728676199588391, 2, "kaart middelpunt"]);
export let chosenLineNumbers = [];
export let startLineNumber = undefined;
export let endLineNumber = undefined;

// Initialiseert de kaart
export const map = L.map('map', {
    center: [middelpunt.lat, middelpunt.lon],
    zoom: 13
});

// Stelt de kaart data-bron in en associeert met de kaart
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,      //max zoom waarbij kaart scherp blijft
    minZoom: 12,       //enkel centrum gent is relevant => niet meer uitzoomen dan 12
    attribution: '© OpenStreetMap'
}).addTo(map);

let circle, zoomed;
export let startpunt;
export let eindpunt;

// Krijgt de sliders en invoervelden
const radiusSlider = document.getElementById('radius');
const radiusValue = document.getElementById('radiusValue');
const cafeSlider = document.getElementById('cafes');
const cafeValue = document.getElementById('cafeValue');
const startEndBtn = document.getElementById("start-eind");
const dynamicRangeCheckbox = document.getElementById("dynamicRange");
const getRandomCafesBtn = document.getElementById("randomCafes");
const findRouteBtn = document.getElementById("route");
const recentRouteBtn = document.getElementById("recent");
const setStartBtn = document.getElementById("set-start");
const setEndBtn = document.getElementById("set-eind");
const rangeInstructionsParagraph = document.getElementById("rangeInstructions");
const euclideanRadioBtn = document.getElementById("euclidisch");
const dijkstraRadioBtn = document.getElementById("dijkstra");
const branchAndBoundRadioBtn = document.getElementById("branch&bound");
const routeList = document.getElementById("route-lijst");
const downloadBtn = document.getElementById("download");
addListeners();
// Bij een wijziging van de straalwaarde, update de straaltekst
function addListeners() {
    radiusSlider.addEventListener('input', () => {
        radiusValue.textContent = `${getRadius() / 1000} km`;
    });
    cafeSlider.addEventListener('input', () => {
        cafeValue.textContent = `${getNumCafes()} café(s)`;
    });
    radiusSlider.addEventListener("input", updateCafecount);
    recentRouteBtn.addEventListener("click", bepaalRecent);
    recentRouteBtn.addEventListener("click", scrollToMap);
    findRouteBtn.addEventListener("click", bepaalAlgoritme);  // TODO: dynamic toggle error (variabele cafeNum niet geüpdate?)
    findRouteBtn.addEventListener("click", scrollToMap);
    setStartBtn.addEventListener("click", resetMap);
    setStartBtn.addEventListener("click", chooseStart);
    setEndBtn.addEventListener("click", chooseEnd);
    startEndBtn.addEventListener("click", setPos);
    startEndBtn.addEventListener("click", scrollToMap);
    dynamicRangeCheckbox.addEventListener("click", dynamicCafeCheckboxAlert);
    getRandomCafesBtn.addEventListener("click", scrollToMap);
    downloadBtn.addEventListener("click",downloadRoute);

// Initialiseert de straal van de slider
    radiusValue.textContent = `${getRadius() / 1000} km`;
    cafeValue.textContent = `${getNumCafes()} café(s)`;

    getRandomCafesBtn.disabled = true;
    findRouteBtn.disabled = true;
    cafeSlider.disabled = true;

    if (sessionStorage.getItem("gekozenCafes") === null && sessionStorage.getItem("algoritme") === null) {
        recentRouteBtn.disabled = true;
        document.getElementById("download").disabled = true;

    }
    if(sessionStorage.getItem("gameStarted")==="true") {
        bepaalRecent();
        startEndBtn.disabled = true;
    }
}




export function resetMap() {
    //verwijdert markers en cirkel
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    // Stelt de kaart data-bron in en associeert met de kaart
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,      //max zoom waarbij kaart scherp blijft
        minZoom: 12,       //enkel centrum gent is relevant => niet meer uitzoomen dan 12
        attribution: '© OpenStreetMap'
    }).addTo(map);
    if (startpunt !== undefined && eindpunt !== undefined) {
        startpunt.addEventListener("mouseover", () => startpunt.openPopup())
        eindpunt.addEventListener("mouseover", () => eindpunt.openPopup())
        startpunt.addTo(map);
        eindpunt.addTo(map);

        circle = L.circle([middelpunt.lat, middelpunt.lon], getRadius()).addTo(map);
        // Voegt een marker toe aan de kaart en een cirkel voor de nauwkeurigheid
        if (!zoomed) {
            zoomed = map.fitBounds(circle.getBounds());
        }
        // Stelt het zoomniveau in op de grenzen van de nauwkeurigheidscirkel
        map.setView([middelpunt.lat, middelpunt.lon]);
    }
}

// setPos-functie wordt uitgevoerd om start en eind markers te plaatsen/bepalen
export function setPos() {
    startpunt = undefined;
    eindpunt = undefined;
    recentRouteBtn.disabled = true;
    document.getElementById("download").disabled = true;
    startEndBtn.removeEventListener("click", setPos);

    resetMap();

    circle = L.circle([middelpunt.lat, middelpunt.lon], getRadius()).addTo(map);
    // Voegt een marker toe aan de kaart en een cirkel voor de nauwkeurigheid
    if (!zoomed) {
        zoomed = map.fitBounds(circle.getBounds());
    }
    // Stelt het zoomniveau in op de grenzen van de nauwkeurigheidscirkel
    map.setView([middelpunt.lat, middelpunt.lon]);

    chooseMarkers();
}

export function getRadius() {
    return parseInt(radiusSlider.value);
}

// Geeft het aantal cafes terug van het invoerveld
function getNumCafes() {
    return parseInt(cafeSlider.value);
}

export function updateRangeBars() {
    let [algoritme, straal] = sessionStorage.getItem("algoritme").split(";");
    let cafes = JSON.parse(sessionStorage.getItem("gekozenCafes"));
    radiusSlider.value = parseInt(straal);
    cafeSlider.value = cafes.length - 2;
    radiusValue.textContent = `${getRadius() / 1000} km`;
    cafeValue.textContent = `${getNumCafes()} café(s)`;
    if (algoritme === "euclidisch") {
        euclideanRadioBtn.checked = true;
    } else if (algoritme === "dijkstra") {
        dijkstraRadioBtn.checked = true;
    } else if (algoritme === "branch&bound") {
        branchAndBoundRadioBtn.checked = true;
    }
}

function dynamicCafeCheckboxAlert() {
    if (dynamicRangeCheckbox.checked)
        alert("Niet aangeraden om aan te zetten! Kan voor vertraging of crashes zorgen, bij meer dan 10 gekozen cafés");

    updateCafecount();
}

export async function updateCafecount() {
    let cafeamount = (await pickStops(159, dataFile)).length;

    if (dynamicRangeCheckbox.checked) cafeSlider.max = Math.min(cafeamount - 2, 48);
    else cafeSlider.max = Math.min(10, cafeamount - 2);

    cafeSlider.value = Math.ceil(cafeSlider.max / 2);
    cafeValue.textContent = `${getNumCafes()} café(s)`;
}

export async function toonLijst(gesorteerde_regels,afstand) {
    let dist;
    if (afstand<=1000)
        dist = afstand.toString()+" meter";
    else
        dist = (afstand/1000).toFixed(2)+" km";
    routeList.innerHTML = "<p class='mooi'>De route is "+dist+" lang<\p>";
    let cafes = await lineToCoordinate(gesorteerde_regels, dataFile);
    sessionStorage.setItem("gekozenCafes", JSON.stringify(cafes));
    for (const [index, cafe] of cafes.entries()) {
        let tekst = document.createElement("p");
        tekst.innerHTML = `<strong>Bar ${parseInt(index) + 1}</strong>: ${cafe.name}`
        routeList.appendChild(tekst);
    }
}

function scrollToMap() {
    let targetSection = document.getElementById("map");
    targetSection.scrollIntoView({ behavior: "smooth" });
}

//functies om geëxporteerde variabele aan te passen
export function modEindPunt(value){
    eindpunt = value;
}

export function modStartPunt(value) {
    startpunt = value;
}

export function modStartLineNumber(value){
    startLineNumber = value;
}

export function modEndLineNumber(value){
    endLineNumber = value;
}

export function modChosenLineNumbers(value) {
    chosenLineNumbers = value;
}

export function pushChosenLineNumbers(value){
    if (value[Symbol.iterator] ==='function'){
        for (let val of value)
            chosenLineNumbers.push(val);
    }else {
        chosenLineNumbers.push(value)
    }
}
