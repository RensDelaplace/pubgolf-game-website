export class Coordinate{
    lat;
    lon;
    index;
    name;
    constructor(coords) {
        this.lat = coords[0];
        this.lon = coords[1];
        this.index=coords[2];
        if(coords.length===4)
            this.name=coords[3];
        else
            this.name = null;
    }

    distance(other){
        function degrees_to_radians(degrees)
        {
            return degrees * (Math.PI/180);
        }
        return 2*Math.asin(Math.sqrt(Math.pow(Math.sin(degrees_to_radians((this.lat-other.lat)/2)), 2)+Math.cos(degrees_to_radians(this.lat))*Math.cos(degrees_to_radians(other.lat))*Math.pow(Math.sin(degrees_to_radians((this.lon-other.lon)/2)), 2)))*6371000;
    }

    isEqual(other){
        return other.lat === this.lat && other.lon === this.lon;
    }
}
