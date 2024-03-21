import {setEndMarkerIcon, setStartEndMarkerIcon, setStartMarkerIcon} from "./updateMarker.js";
import {euclidisch} from "./euclidisch.js";
import {dijkstra} from "./dijkstra.js";
import {resultBranchAndBound} from "./branchAndBound.js";
import {bepaalRoute} from "./route.js";
import {chosenLineNumbers, map, updateRangeBars, modChosenLineNumbers, modStartPunt, modEindPunt, getRadius} from "./mapdata.js";

const euclideanRadioBtn = document.getElementById("euclidisch");
const dijkstraRadioBtn = document.getElementById("dijkstra");
const branchAndBoundRadioBtn = document.getElementById("branch&bound");
const recentRouteBtn = document.getElementById("recent");
const setStartBtn = document.getElementById("set-start");
const setEndBtn = document.getElementById("set-eind");

export async function bepaalRecent() {
    let algoritme = sessionStorage.getItem("algoritme").split(";")[0];
    let cafes = JSON.parse(sessionStorage.getItem("gekozenCafes"));
    updateRangeBars();

    let marker;
    if(cafes[0].lat === cafes[cafes.length - 1].lat && cafes[0].lon === cafes[cafes.length - 1].lon) {
        marker = setStartEndMarkerIcon(L.marker([cafes[0].lat, cafes[0].lon]));
        marker.addTo(map);
        marker.bindPopup(cafes[0].name);
        marker.addEventListener("mouseover", () => marker.openPopup());
        modStartPunt(marker)
        modEindPunt(marker)
    } else {
        marker = setStartMarkerIcon(L.marker([cafes[0].lat, cafes[0].lon]));
        marker.addTo(map);
        marker.bindPopup(cafes[0].name);
        marker.addEventListener("mouseover", () => marker.openPopup());
        modStartPunt(marker)

        marker = setEndMarkerIcon(L.marker([cafes[cafes.length - 1].lat, cafes[cafes.length - 1].lon]));
        marker.addTo(map)
        marker.bindPopup(cafes[cafes.length - 1].name);
        marker.addEventListener("mouseover", () => marker.openPopup());
        modEindPunt(marker)
    }

    modChosenLineNumbers(cafes.map((cafe) => cafe.index))

    let antw;
    switch (algoritme){
        case "euclidisch":
            antw = await euclidisch(chosenLineNumbers);
            break;
        case "dijkstra":
            antw = await dijkstra(chosenLineNumbers);
            break;
        case "branch&bound":
            antw = await resultBranchAndBound(chosenLineNumbers);
            break;
    }

    bepaalRoute(antw);
}

export async function bepaalAlgoritme() {
    let noErr = true;
    let antw;
    const radius = getRadius();
    if (euclideanRadioBtn.checked) {
        sessionStorage.setItem("algoritme", "euclidisch;" + radius);
        console.time("euclidean")
        antw = await euclidisch(chosenLineNumbers);
        console.timeEnd("euclidean")
    } else if (dijkstraRadioBtn.checked) {
        sessionStorage.setItem("algoritme", "dijkstra;" + radius);
        console.time("dijkstra")
        antw = await dijkstra(chosenLineNumbers);
        console.timeEnd("dijkstra")
    } else if (branchAndBoundRadioBtn.checked) {
        sessionStorage.setItem("algoritme", "branch&bound;" + radius);
        console.time("branch&bound")
        antw = await resultBranchAndBound(chosenLineNumbers);
        console.timeEnd("branch&bound")
    } else{
        alert("geen agloritme gekozen");
        noErr = false;
    }

    if(noErr){
        bepaalRoute(antw);
    }

    if (sessionStorage.getItem("algoritme") !== null) {
        recentRouteBtn.disabled = false;
        document.getElementById("download").disabled = false;

    }

    setStartBtn.classList.add("hideStartEindButton");
    setEndBtn.classList.add("hideStartEindButton");
}
