import {Coordinate} from "./Coordinate.js";
import {resultBranchAndBound} from "./branchAndBound.js";
import {getCoordArray} from "./graphs.js";

/**!!!*/
/**Duplicated code met mapdata => MOET -> anders werk je met de verkeerde kaarten*/
/**!!!*/


document.getElementById("toonRoute").disabled = true;
const dataFile = "data/circle_coords_w_name.csv";
const middelpunt = new Coordinate([51.049943696116436, 3.728676199588391, 2, "kaart middelpunt"]);
let radius = 2000;
let cafes = [];
let chosenLineNumbers = [];
let polyLinesGreen = []; //array van de groene polylines is nodig om ze later terug te kunnen verwijderen
let circle, zoomed;
const algoritmeMap = L.map('map', {
    center: [middelpunt.lat, middelpunt.lon],
    zoom: 13
});

// Stelt de kaart data-bron in en associeert met de kaart
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,      //max zoom waarbij kaart scherp blijft
    minZoom: 13,       //enkel centrum gent is relevant => niet meer uitzoomen dan 12
    attribution: '© OpenStreetMap'
}).addTo(algoritmeMap);
let icon = L.icon({
    iconUrl: 'img/cafe-icon-2.png',
    iconSize: [40, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -10],
});

async function setMarkers() { // markers van cafes van in begin op de kaart plaatsen

    for(let cafe of cafes){
        let marker = L.marker([cafe.lat, cafe.lon], {icon: icon});
        marker.clickable = false;
        marker.bindPopup(cafe.name);
        marker.bindTooltip(cafe.name);
        marker.addEventListener("mouseover", () => marker.openPopup())
        marker.addTo(algoritmeMap);
        if(cafes.indexOf(cafe) === 0) {
            setStartEndMarkerIcon(marker);
        }
    }
}

function setStartEndMarkerIcon(marker){
    const Icon = L.icon({
        iconUrl: 'img/start-and-end-icon.png',
        iconSize: [40, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -10],
    });
    marker.setIcon(Icon)
    return marker
}

async function genereerCafes(){
    document.getElementById("toonRoute").disabled = false;
    cafes = await pickStops(7,dataFile);
    chosenLineNumbers = [];
    resetMap();
    setMarkers();
    for(let cafe of cafes){
        chosenLineNumbers.push(cafe.index)
    }
}

async function drawRoute() {
    let button = document.getElementById('toonRoute');
    let buttonCafes = document.getElementById('genereer');
    buttonCafes.disabled = true;
    button.disabled = true;
    for (let polyline of polyLinesGreen){
        polyline.remove(algoritmeMap);
    }
    chosenLineNumbers = await resultBranchAndBound([...chosenLineNumbers]) // coords in juiste volgorde plaatsen
    //chosenLineNumbers.splice(chosenLineNumbers.length-1,1);

    let coords = await getCoordArray(chosenLineNumbers);
    let coordsCopy = [...coords];

    let teller = 0
    let polyline;

    while (coordsCopy.length > 3){
        coordsCopy.splice(0,1);
        await drawNextThree(coords[teller],coordsCopy)
        teller++;
    }

    for(let i = teller;i<coords.length-1;i++){
        await timeOut(1000)
        let points = [[coords[i].lat,coords[i].lon],[coords[i+1].lat,coords[i+1].lon]]
        polyline = addPolyLine(points,'green')
        polyline.addTo(algoritmeMap)
        polyLinesGreen.push(polyline)
    }
    await timeOut(1000)
    let points = [[coords[0].lat,coords[0].lon],[coords[coords.length-1].lat,coords[coords.length-1].lon]]
    polyline = addPolyLine(points,'green')
    polyline.addTo(algoritmeMap)
    polyLinesGreen.push(polyline)
    button.disabled = false;
    buttonCafes.disabled = false;

    async function drawNextThree(numberCurrent,nextNumbers) {
        let current = numberCurrent; // huidig cafe waaruit de polylines vertrekken
        let next;
        let points = [] //array van coords die wordt meegegeven aan de polylines
        let polylines = []; //array van de blauwe polylines is nodig om ze later terug te kunnen verwijderen
        if(nextNumbers.length>=3){
            for (let i = 0; i < 3; i++) {
                await timeOut(1000);
                next = nextNumbers[i]
                points = [[current.lat,current.lon],[next.lat,next.lon]]
                polyline = addPolyLine(points,'blue')
                polylines.push(polyline);
                polyline.addTo(algoritmeMap);
            }}

        points = polylines[0].getLatLngs();
        await timeOut(1000)
        polyline = addPolyLine(points,'green')
        polyline.addTo(algoritmeMap)
        polyLinesGreen.push(polyline)
        await timeOut(1500)
        for (let polyline of polylines){
            polyline.remove(algoritmeMap);
        }

    }
}

function addPolyLine(points,color){
    let polyline = L.polyline(points,{
        color: color,
        weight: 4,
        opacity: 1,
        smoothFactor: 1
    });
    return polyline
}

function timeOut (ms) { //timeout functie om de polylines 1 voor 1 te doen verschijnen
    return new Promise(resolve => setTimeout(resolve,ms))
}



async function pickStops(number,file) {
    return await fetch(file).then(response => response.text()).then(res => {
        let allText = res;
        allText = allText.split("\n");
        allText.pop(); //new line verwijderen
        let coords = allText.map(el => {
            let co = el.split(";");
            co.splice(2, 0, allText.indexOf(el));
            co[0] = +co[0];
            co[1] = +co[1];
            return new Coordinate(co);
        });
        coords = coords.filter(el =>
            el.distance(middelpunt) <= radius
        );

        return shuffle(coords).slice(0,number)
    });
}

function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

function resetMap() {
    //verwijdert markers en cirkel
    algoritmeMap.eachLayer(function (layer) {
        algoritmeMap.removeLayer(layer);
    });
    // Stelt de kaart data-bron in en associeert met de kaart
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,      //max zoom waarbij kaart scherp blijft
        minZoom: 13,       //enkel centrum gent is relevant => niet meer uitzoomen dan 12
        attribution: '© OpenStreetMap',
    }).addTo(algoritmeMap);

    circle = L.circle([middelpunt.lat, middelpunt.lon], radius).addTo(algoritmeMap)

    if (!zoomed) {
        zoomed = algoritmeMap.fitBounds(circle.getBounds());
    }
    algoritmeMap.setView([middelpunt.lat, middelpunt.lon]);
}

document.getElementById("toonRoute").addEventListener('click',await drawRoute)
document.getElementById('genereer').addEventListener('click',genereerCafes)
