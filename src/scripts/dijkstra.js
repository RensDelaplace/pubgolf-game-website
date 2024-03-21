import {initGraph} from "./graphs.js";
import {permutator} from "./permutator.js";


export async function dijkstra(lineNumbers){
    let graph = await initGraph(lineNumbers);
    let endIndex = lineNumbers.length-1;
    let numbersTemp = [...lineNumbers];
    let allPermutation = permutator(numbersTemp.slice(1,lineNumbers.length-1))
    let shortestRoute;
    let mindist = Number.MAX_VALUE;

    for(let permutation of allPermutation) {
        let dist = 0
        dist += parseFloat(graph[0][lineNumbers.indexOf(permutation[0])]);
        for(let i =0;i<permutation.length-1;i++){
            dist += parseFloat(graph[lineNumbers.indexOf(permutation[i])][lineNumbers.indexOf(permutation[i+1])]);
        }
        dist += parseFloat(graph[lineNumbers.indexOf(permutation[permutation.length-1])][endIndex]);

        if(dist < mindist){
            shortestRoute = permutation;
            mindist = dist;
        }

     }
    return [lineNumbers[0],...shortestRoute, lineNumbers[endIndex]];
 }
