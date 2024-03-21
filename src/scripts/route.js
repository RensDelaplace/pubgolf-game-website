import {lineToCoordinate} from "./fileReader.js";
import {setNeutralMarkerIcon} from "./updateMarker.js";
import {map,resetMap,updateRangeBars,toonLijst} from "./mapdata.js";
const dataFile = "data/circle_coords_w_name.csv";

export async function bepaalRoute(array_lines) {//array van volgorde coordinaten (regelnummers startende van 0)
    resetMap();
    updateRangeBars();
    laadGeneratedCafes();

    let request = new XMLHttpRequest();
    request.open('POST', "https://api.openrouteservice.org/v2/directions/foot-walking/geojson");
    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', '5b3ce3597851110001cf6248fffedf8d96224f68816f255633c06001');

    const body = '{"coordinates":' + JSON.stringify((await lineToCoordinate(array_lines, dataFile)).map((coord) => [coord.lon, coord.lat])) + ',"units":"m"}';
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200) {
                console.log('Status:', this.status);
            } else {
                let response = JSON.parse(this.responseText);
                let coordinates = response.features[0].geometry.coordinates;
                toonLijst(array_lines, response.features[0].properties.summary.distance);
                tekenRoute(coordinates);
            }
        }
    };
    request.send(body);
}

function tekenRoute(coordinates){
    L.polyline(coordinates.map((coord) => coord.reverse()), {color: 'blue', weight:4}).addTo(map);
}

function laadGeneratedCafes(){
    let storage = JSON.parse(sessionStorage.getItem("gekozenCafes"));
    if (storage !== null && storage !== undefined) {
        storage.pop();
        storage.shift();
        storage.forEach((el) =>{
            let marker = setNeutralMarkerIcon(L.marker([el.lat, el.lon]));
            marker.bindPopup(el.name);
            marker.addTo(map);
            marker.addEventListener("mouseover", () => marker.openPopup());
        });
    }
}
