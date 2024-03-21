import {Coordinate} from "./Coordinate.js";
import {changeStartEindpuntIcons, setEndMarkerIcon, setNeutralMarkerIcon, setStartMarkerIcon} from "./updateMarker.js";
import {eindpunt, endLineNumber, map, startLineNumber, startpunt, modStartLineNumber, modEndLineNumber, modStartPunt, modEindPunt, updateCafecount,} from "./mapdata.js";
import {getCo, pickStops} from "./fileReader.js";

const setStartBtn = document.getElementById("set-start");
const setEndBtn = document.getElementById("set-eind");
const getRandomCafesBtn = document.getElementById("randomCafes");
const startEndBtn = document.getElementById("start-eind");
const rangeInstructionsParagraph = document.getElementById("rangeInstructions");
const radiusSlider = document.getElementById('radius');
const dataFile = "data/circle_coords_w_name.csv";

export async function chooseStart() {
    radiusSlider.disabled = true;
    setStartBtn.disabled = true;
    startEndBtn.disabled = true;
    getRandomCafesBtn.disabled = true;
    setEndBtn.disabled = true;
    document.getElementById("download").disabled = true;

    const initialButtonText = setStartBtn.innerHTML;
    const initialText = rangeInstructionsParagraph.innerHTML;
    const endCoords = endLineNumber === startLineNumber && endLineNumber === undefined? new Coordinate([-1, -1]): (await getCo(startLineNumber, endLineNumber, dataFile))[1];

    const markers = (await pickStops(159, dataFile)).map((cafe) => {
        let marker = L.marker([cafe.lat, cafe.lon]);
        marker = cafe.isEqual(endCoords)? setEndMarkerIcon(marker): setNeutralMarkerIcon(marker);
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
    setStartBtn.innerHTML = `<b>Kies nu een startpunt</b>`;


    function changeStartIcon(e) {
        modStartLineNumber(+e.target._icon.id);
        if (previousClicked !== null) previousClicked = setNeutralMarkerIcon(previousClicked);

        let startEind = changeStartEindpuntIcons(startLineNumber, endLineNumber, e.target, eindpunt);
        modStartPunt(startEind[0]);
        modEindPunt(startEind[1])
        previousClicked = startpunt;
    }

    function startGekozen() {
        rangeInstructionsParagraph.innerHTML = initialText;
        setStartBtn.innerHTML = initialButtonText;
        previousClicked = null;
        setStartBtn.removeEventListener("click", startGekozen);
        markers.forEach((marker) => marker.removeEventListener("click", changeStartIcon));

        getRandomCafesBtn.disabled = false;
        startEndBtn.disabled = false;
        setStartBtn.disabled = false;
        setEndBtn.disabled = false;
    }
}

export async function chooseEnd(){
    document.getElementById("download").disabled = true;
    radiusSlider.disabled = true;
    setEndBtn.disabled = true;
    setStartBtn.disabled = true;
    getRandomCafesBtn.disabled = true;
    startEndBtn.disabled = true;

    const initialButtonText = setEndBtn.innerHTML;
    const initialText = rangeInstructionsParagraph.innerHTML;
    const startCoords = endLineNumber === startLineNumber && endLineNumber === undefined? new Coordinate([-1, -1]): (await getCo(startLineNumber, endLineNumber, dataFile))[0];
    let markers = [];
    (await pickStops(159, dataFile)).forEach((cafe) => {
        let marker =  L.marker([cafe.lat, cafe.lon]);
        marker = cafe.isEqual(startCoords)? setStartMarkerIcon(marker): setNeutralMarkerIcon(marker);
        marker.bindPopup(cafe.name);
        marker.bindTooltip(cafe.name);
        marker.addTo(map);
        marker._icon.id = cafe.index;
        marker.addEventListener("click", changeEndIcon)
        marker.addEventListener("click", eindGekozen);
        markers.push(marker);
    });

    rangeInstructionsParagraph.innerHTML = `<b>Kies nu een eindpunt door op een marker te klikken</b>`;
    setEndBtn.innerHTML = `<b>Kies nu een eindpunt</b>`;

    function changeEndIcon(e) {
        modEndLineNumber(+e.target._icon.id);
        setEndBtn.disabled = false;
        let startEind = changeStartEindpuntIcons(startLineNumber, endLineNumber, startpunt, e.target);
        modStartPunt(startEind[0]);
        modEindPunt(startEind[1]);
    }

    function eindGekozen() {
        markers.forEach((marker) => marker.removeEventListener("click", changeEndIcon));
        rangeInstructionsParagraph.innerHTML = initialText;
        setEndBtn.innerHTML = initialButtonText;
        setEndBtn.disabled = false;
        setStartBtn.disabled = false;
        startEndBtn.disabled = false;
        getRandomCafesBtn.disabled = false;
        updateCafecount();
    }
}
