export async function downloadRoute(){
    let request = new XMLHttpRequest();

    request.open('POST', "https://api.openrouteservice.org/v2/directions/foot-walking/gpx");

    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', '5b3ce3597851110001cf6248fffedf8d96224f68816f255633c06001');
    let chosen = JSON.parse(sessionStorage.getItem("gekozenCafes"));
    let co = chosen.map((coord) => [coord.lon, coord.lat]);

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if(this.status===200) {
                let pos = this.responseText.length - 6;
                let fileInhoud = [this.responseText.slice(0, pos), waypoints(chosen), this.responseText.slice(pos)].join("");
                download("Route_" + Date.now().toString() + ".gpx", fileInhoud)
            }
            else{
                console.log("Status",this.status);
            }
        }
    };
    const body = '{"coordinates":'+JSON.stringify(co)+'}';
    request.send(body);
}

function waypoints(co){
    return co.map((coord) => `<wpt lat="${coord.lat}" lon="${coord.lon}"><name>${coord.name}</name></wpt>`).join("");

}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
    element.setAttribute('download', filename);
    element.style.display = 'none';     //lijkt niets te doen maar voert de download uit
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
