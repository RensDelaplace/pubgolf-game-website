export function setNeutralMarkerIcon(marker){
    const Icon = L.icon({
        iconUrl: 'img/cafe-icon-2.png',
        iconSize: [40, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -10],
    });
    marker.setIcon(Icon)
    return marker
}

export function setStartMarkerIcon(marker){
    const Icon = L.icon({
        iconUrl: 'img/start-icon.png',
        iconSize: [40, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -10],
    });
    marker.setIcon(Icon)
    return marker
}

export function setEndMarkerIcon(marker){
    const Icon = L.icon({
        iconUrl: 'img/end-icon.png',
        iconSize: [40, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -10],
    });
    marker.setIcon(Icon)
    return marker
}

export function setStartEndMarkerIcon(marker){
    const Icon = L.icon({
        iconUrl: 'img/start-and-end-icon.png',
        iconSize: [40, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -10],
    });
    marker.setIcon(Icon)
    return marker
}

export function changeStartEindpuntIcons(startLineNumber, endLineNumber, startpunt, eindpunt){
    if (startLineNumber === endLineNumber){
        if (startpunt !== undefined) startpunt = setStartEndMarkerIcon(startpunt);
        if (eindpunt !== undefined) eindpunt = setStartEndMarkerIcon(eindpunt);
    } else {
        if (startpunt !== undefined) startpunt = setStartMarkerIcon(startpunt);
        if (eindpunt !== undefined) eindpunt = setEndMarkerIcon(eindpunt)
    }

    return [startpunt, eindpunt]
}
