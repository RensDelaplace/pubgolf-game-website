import {Game} from './Game.js';
showGame(false);

//alles uit sessionStorage halen
let players = JSON.parse(sessionStorage.getItem('players')) || [];
let gameStarted = JSON.parse(sessionStorage.getItem("gameStarted"));
let activeBar = JSON.parse(sessionStorage.getItem('activeBar'));
let bars = null;
if(sessionStorage.getItem("algoritme")!==null)
    bars = JSON.parse(sessionStorage.getItem("gekozenCafes"));

//interactie met html
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('add-player-button').addEventListener('click', confirmPlayer);
const playerList = document.getElementById('player-list');
let textarea = document.getElementById('player-name');
textarea.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        confirmPlayer();
    }
});

if(gameStarted)
    startGame();

//toont spel of tabel om spelers toe te voegen voor spel
function showGame(bool){
    if(bool){
        document.getElementById('beforeGame').hidden = true;
        document.getElementById('inGame').hidden = false;
    }else{
        document.getElementById('beforeGame').hidden = false;
        document.getElementById('inGame').hidden = true;
    }
}



//speler toevoegen
function confirmPlayer(){
    let name = textarea.value;
    if(name.trim() !== ''){
        players.push({ name: name, score: 0 });
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = name;
        playerList.append(tr);
        tr.append(td);
    }
    document.getElementById('player-name').value = '';
}

//checken of alles inorde is en start spel
function startGame(){
    if(players.length===0){
        alert("Er zijn nog geen spelers toegevoegd");
    }
    else if (bars ===null || bars===undefined ){
        alert("U heeft nog geen route met cafés gemaakt");
    }
    else {
        showGame(true);
        sessionStorage.setItem('players', JSON.stringify(players));
        sessionStorage.setItem('gameStarted', true);
        let game = new Game(players, bars, activeBar);
    }

}