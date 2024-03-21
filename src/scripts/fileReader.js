import {Coordinate} from "./Coordinate.js";
import {getRadius, middelpunt} from "./mapdata.js";



export async function lineToCoordinate(array, file){    //TODO: VERMELDING IN VERSLAG
    return await fetch(file).then(res=>res.text())
        .then(res=>{
            let allText = res;
            allText = allText.split("\n");
            allText.pop();
            return array.map(el => {
                let co = allText[el].split(";");
                co.splice(2, 0, el);
                co[0] = +co[0];
                co[1] = +co[1];
                return new Coordinate(co);
            })
        })
}
export async function pickStops(number, file) {
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
        coords = coords.filter(el => el.distance(middelpunt) <= getRadius());
        return shuffle(coords).slice(0,number);
    });
}

// Functie om een array willekeurig door elkaar te halen
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}
export async function getCo(start, end, file) {
    return await fetch(file).then(res=>res.text()).then(res=>{
        let allText = res;
        allText = allText.split("\n");
        allText.pop(); //new line verwijderen
        let startCo = allText[start].split(";");
        startCo.splice(2, 0, start);
        startCo[0] = +startCo[0];
        startCo[1] = +startCo[1];
        let endCo = allText[end].split(";");
        endCo.splice(2, 0, end);
        endCo[0] = +endCo[0];
        endCo[1] = +endCo[1];
        return [new Coordinate(startCo), new Coordinate(endCo)];
    });
}
