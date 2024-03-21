export function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    let output = ""
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                output = allText
                // alert(allText);
            }
        }
    }
    rawFile.send(null);
    return output;
}

export function getCoordinates(textData){
    let cafecoords = [];
    for (let latlon of textData.split("\r\n")) {
        cafecoords.push(latlon.split(";"));
}
}