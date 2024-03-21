import {getCo, pickStops} from "./fileReader.js";
import {changeStartEindpuntIcons, setNeutralMarkerIcon} from "./updateMarker.js";
import {
    eindpunt,
    endLineNumber,
    map, modChosenLineNumbers, modEindPunt, modEndLineNumber, modStartLineNumber,
    modStartPunt, pushChosenLineNumbers,
    resetMap,
    startLineNumber,
    startpunt,
    setPos
} from "./mapdata.js";

const dataFile = "data/circle_coords_w_name.csv";
const setStartBtn = document.getElementById("set-start");
const setEndBtn = document.getElementById("set-eind");
const radiusSlider = document.getElementById('radius');
const cafeSlider = document.getElementById('cafes');
const startEndBtn = document.getElementById("start-eind");
const getRandomCafesBtn = document.getElementById("randomCafes");
const findRouteBtn = document.getElementById("route");
const recentRouteBtn = document.getElementById("recent");
const rangeInstructionsParagraph = document.getElementById("rangeInstructions");

export async function chooseMarkers() {
    radiusSlider.disabled = true;
    startEndBtn.disabled = true;
    document.getElementById("download").disabled = true;


    if(getRandomCafesBtn.getAttribute("listener") !== "true") {      // vermijden dat er meerdere listeners op de button komen bij herkiezen start/eindpunt
        getRandomCafesBtn.addEventListener("click", genereerCafes);
        getRandomCafesBtn.setAttribute("listener","true");
    }

    const initialButtonText = startEndBtn.innerHTML;
    const initialText = rangeInstructionsParagraph.innerHTML;

    const markers = (await pickStops(159, dataFile)).map((cafe) => {
        let marker = L.marker([cafe.lat, cafe.lon]);
        marker = setNeutralMarkerIcon(marker)
        marker.bindPopup(cafe.name);
        marker.bindTooltip(cafe.name);
        marker.addTo(map);
        marker._icon.id = cafe.index;
        marker.addEventListener("click", changeStartIcon);
        marker.addEventListener("click", startGekozen);
        return marker
    });

    let previousClicked = null;

    rangeInstructionsParagraph.innerHTML = `<b>Kies nu een startpunt door op een marker te klikken</b>`;
    startEndBtn.innerHTML = `<b>Kies nu een startpunt</b>`;

    function changeStartIcon(e) {
        modStartLineNumber(+e.target._icon.id);
        if (previousClicked !== null) previousClicked = setNeutralMarkerIcon(previousClicked);

        let startEind = changeStartEindpuntIcons(startLineNumber, endLineNumber, e.target, eindpunt);
        modStartPunt(startEind[0]);
        modEindPunt(startEind[1]);
        previousClicked = startpunt;
    }

    function startGekozen() {
        rangeInstructionsParagraph.innerHTML = `<b>Kies nu een eindpunt</b>`;
        startEndBtn.innerHTML = `<b>Kies nu een eindpunt</b>`;
        previousClicked = null;
        startEndBtn.removeEventListener("click", startGekozen);
        startEndBtn.addEventListener("click", eindGekozen);
        startEndBtn.disabled = true;
        markers.forEach((marker) => {
            marker.removeEventListener("click", changeStartIcon);
            marker.addEventListener("click", changeEndIcon);
            marker.addEventListener("click", eindGekozen);
        });
    }

    function changeEndIcon(e) {
        modEndLineNumber(+e.target._icon.id)
        startEndBtn.disabled = false;

        if (previousClicked !== null) previousClicked = setNeutralMarkerIcon(previousClicked);

        let startEind = changeStartEindpuntIcons(startLineNumber, endLineNumber, startpunt, e.target);
        modStartPunt(startEind[0]);
        modEindPunt(startEind[1]);
        previousClicked = eindpunt;
    }

    function eindGekozen() {
        rangeInstructionsParagraph.innerHTML = initialText;
        startEndBtn.innerHTML = initialButtonText;
        previousClicked = null;
        markers.forEach((marker) =>marker.removeEventListener("click", changeEndIcon));
        startEndBtn.innerText = "wijzig bereik";
        startEndBtn.removeEventListener("click", eindGekozen);
        startEndBtn.addEventListener("click", updateRadius);
        startEndBtn.addEventListener("click", hideSetStartEnd)
        getRandomCafesBtn.disabled = false;
        cafeSlider.disabled = false;
        document.querySelectorAll('.hideStartEindButton').forEach((b) => b.classList.remove("hideStartEindButton"));
    }

    async function genereerCafes() {
        findRouteBtn.disabled = false;
        recentRouteBtn.disabled = true;
        document.getElementById("download").disabled = true;

        resetMap();
        modChosenLineNumbers([startLineNumber]);
        let chosen = controleStartOrEnd(await pickStops(getNumCafes() + 2, dataFile));
        chosen.forEach((cafe) => {
            let marker = L.marker([cafe.lat, cafe.lon]);
            marker = setNeutralMarkerIcon(marker);
            marker.clickable = false;
            marker.bindPopup(cafe.name);
            marker.bindTooltip(cafe.name);
            marker.addEventListener("mouseover", () => marker.openPopup())
            marker.addTo(map);
            pushChosenLineNumbers(cafe.index);
        });
        pushChosenLineNumbers(endLineNumber);
        let startEndCo = await getCo(startLineNumber, endLineNumber, dataFile);
        sessionStorage.setItem("gekozenCafes", JSON.stringify([startEndCo[0],...chosen, startEndCo[1]]));  //cafes toevoegen
    }

    function updateRadius() {
        sessionStorage.removeItem("gekozenCafes");
        sessionStorage.removeItem("algoritme");
        modStartPunt(undefined);
        modEindPunt(undefined);
        resetMap();
        modChosenLineNumbers([]);
        cafeSlider.disabled = true;
        getRandomCafesBtn.disabled = true;
        radiusSlider.disabled = false;
        recentRouteBtn.disabled = true;
        document.getElementById("download").disabled = true;
        findRouteBtn.disabled = true;

        startEndBtn.removeEventListener("click", updateRadius);
        startEndBtn.innerText = "Kies start en eind";
        startEndBtn.addEventListener("click", setPos);
    }
}

function controleStartOrEnd(chosen) {
    return chosen.filter((el) => !((el.lat === startpunt._latlng.lat && el.lon === startpunt._latlng.lng) || (el.lat === eindpunt._latlng.lat && el.lon === eindpunt._latlng.lng))).slice(0, getNumCafes());
}

function getNumCafes() {
    return parseInt(cafeSlider.value);
}

function hideSetStartEnd(){
    setStartBtn.classList.add("hideStartEindButton");
    setEndBtn.classList.add("hideStartEindButton");
}
