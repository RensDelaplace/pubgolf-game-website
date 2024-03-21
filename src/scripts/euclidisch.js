import { lineToCoordinate } from "./fileReader.js";
import {permutator} from "./permutator.js";


export async function euclidisch(lineNumbers) {
    let coords = await lineToCoordinate(lineNumbers, "data/circle_coords_w_name.csv");
    let startpoint = coords[0];
    let endpoint = coords[coords.length - 1];
    let allPermutations = permutator(coords.slice(1, coords.length - 1))  // get all permutations without the start and end
    let mindist = Number.MAX_VALUE;
    let shortestRoute;

    allPermutations.forEach((permutation) =>{
        let dist = 0;
        dist += startpoint.distance(permutation[0]);
        for (let c in permutation.slice(1)) {
            c = parseInt(c)
            dist += permutation[c].distance(permutation[c + 1])
        }

        dist += permutation[permutation.length - 1].distance(endpoint);

        if(dist < mindist){
            shortestRoute = permutation;
            mindist = dist;
        }
    });

    return [lineNumbers[0], ...shortestRoute.map(c => lineNumbers[coords.indexOf(c)]), lineNumbers[lineNumbers.length-1]];
}
