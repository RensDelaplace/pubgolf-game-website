import {Coordinate} from "./Coordinate.js";

const graph_file = "./data/matrix_afstanden.csv"

export async function initGraph(cafes) {
    let graph = []
    let graph_text = await readTextFile(graph_file);
    let graph_lines = graph_text.split("\n");
    for (let i = 0;i<cafes.length;i++){
        graph[i] = []
        let line = graph_lines[cafes[i]].split(";");
        for (let j= 0;j<cafes.length;j++){
            graph[i][j] = line[cafes[j]];
        }
    }
    return graph;
}

export async function getCoordArray(cafes){
    let cafe_coords=[];
    let coords_lines = (await readTextFile("./data/circle_coords_w_name.csv")).split("\n");
    let coord = [];
    for (let i = 0;i<cafes.length;i++){
        coord = coords_lines[cafes[i]].split(";")
        coord.push(cafes[i]);
        cafe_coords.push(new Coordinate(coord));
    }
    return cafe_coords;
}
export async function readTextFile(file)
{
    return await fetch(file).then(res=>res.text()).then(res=>{
        return res;
    });
}
