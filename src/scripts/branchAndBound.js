import {initGraph} from "./graphs.js";

export async function resultBranchAndBound(linenumbers){
    let res1= [...linenumbers]
    let res2= res1.slice(0, -1)
    let graph = await initGraph(res2);

    let volgorde= calculateBranchBound(res2);
    let linenumbers_finaal=[]
    for(let nummer of volgorde){
        linenumbers_finaal.push(res2[nummer])
    }
    linenumbers_finaal.push(linenumbers[linenumbers.length-1])
    return linenumbers_finaal

    function calculateBranchBound(linenumbers){
        let currentRoute=[]
        currentRoute.push(0);
        while(currentRoute.length!==linenumbers.length){
            let array_kleinste=[]
            let kleinste=1000000;
            for(let i=0; i<linenumbers.length; i++){
                if(!currentRoute.includes(i)){
                    let res1=[...(currentRoute)];
                    res1.push(i)
                    let lb= calculate_Lb(res1)
                    if(lb<kleinste){
                        kleinste=lb;
                        array_kleinste=res1;
                    }
                }
            }
            currentRoute=array_kleinste;
        }
        return currentRoute;
    }

    function calculate_Lb(gekozen_weg = []){//ervan uitgaand da je altijd begint met node 0 en nooit 1 argument in array steekt
        let som=0;
        let opgeslagen_locaties={};
        let opgeslagen_locatie=gekozen_weg[0]
        for(let getallen of gekozen_weg){
            opgeslagen_locaties[getallen]=[];
        }

        if(!(gekozen_weg.length===0)){//als er iets in steekt
            for(let i=1; i<gekozen_weg.length; i++){
                opgeslagen_locaties[opgeslagen_locatie].push(parseFloat(graph[opgeslagen_locatie][gekozen_weg[i]]))
                opgeslagen_locaties[gekozen_weg[i]].push(parseFloat(graph[opgeslagen_locatie][gekozen_weg[i]]))
                opgeslagen_locatie=gekozen_weg[i]
            }
        }
        for(let i=0; i<graph.length; i++){
            let res1=[...(graph[i])]//geen refernce opslagen (kopie)
            res1 = res1.map(x => parseFloat(x));
            if(gekozen_weg.includes(i)){

                som = som+ opgeslagen_locaties[i][0]
                if(opgeslagen_locaties[i].length===1){
                    if(opgeslagen_locaties[i][0]===(res1.sort((a, b) => a - b).slice(1, 2)[0])){
                        som = som +res1.sort((a,b) => a - b).slice(2, 3)[0];
                    }
                    else{
                        som = som + res1.sort((a, b) => a - b).slice(1, 2)[0]
                    }
                }
                else if(opgeslagen_locaties[i].length===2){
                    som= som+ opgeslagen_locaties[i][1]
                }
            }
            else{
                let res2 = res1.sort((a,b) => a - b).slice(1, 3);//laag naar hoog, 1ste 2 kiezen behalve 0 (afstand van a naar a)
                for(let j of res2){
                    som= som+j;
                }
            }
        }
        let uitkomst= som/2

        return Math.round( uitkomst* 10000) / 10000
    }
}
